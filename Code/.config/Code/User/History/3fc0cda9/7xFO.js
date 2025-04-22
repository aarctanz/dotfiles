import { verifyToken, createToken } from "../utils/tokenGenerator.js";
import { GraphQLError, GraphQLScalarType  } from "graphql";

import { APIError } from "../utils/errorHandler.js";

import {Types} from 'mongoose';
import {accountModel} from '../models/user.js'
import { postModel,discussionModel, contributionModel,voteModel } from "../models/post.js";
import { imageGrabber, imageUploader } from "../services/imageHandler.js";
import { featureProperty, partsFeatures, plantParts } from "../models/default.js";

import { generateOTP } from '../utils/otpGenerator.js'
import { sendMail } from '../services/mailer.js'

import {isValidObjectId, ObjectId} from 'mongoose';
let redisClient;

function setRedisClient(redisClientOB){
    redisClient = redisClientOB;
}
const mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;





async function protectMe(context){

    if(context.userID != undefined){
        const isUserExists = await accountModel.exists({_id : context.userID})
        if(isUserExists){
          return;
        }
    }
    throw new APIError({
        code: 601,
        message: "Please Login First !!!"
    })
}

async function protectMod(context){
    // Remove when you want mod !!
    return await protectMe(context);
    if(context.userType == 2) {
        throw new APIError({
            code : 403,
            message : "You are not authorized to perform this request"
        })
    }
}

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
})

const nonEmptyStringScalar = new GraphQLScalarType({
    name : 'nonEmptyString',
    parseValue(value) {
       if (typeof value !== 'string' || value === '') {
            throw new APIError({
                    code: 401,
                    message: "Please Provide Valid String !!"
            })
       }
       return value
    },
    serialize(value) {
      if (typeof value !== 'string' || value === '') {
            throw new APIError({
                    code: 401,
                    message: "Please Provide Valid String !!"
            })
       }
       return value
    },
})
const mailScaler = new GraphQLScalarType({
    name : 'Email',
    parseValue(value) {
       if (typeof value !== 'string' || value === '' || !mailRegex.test(value)) {
            throw new APIError({
                    code: 401,
                    message: "Please Provide Valid Email !!"
            })
       }

       return value
    },
    serialize(value) {
      if (typeof value !== 'string' || value === '' || !mailRegex.test(value)) {
            throw new APIError({
                    code: 401,
                    message: "Please Provide Valid Email !!"
            })
       }

       return value
    },
})

const MongoIDScalar = new GraphQLScalarType({
    name : 'MongoID',
    parseValue(value) {
       if (!isValidObjectId(value)) {
            throw new APIError({
                    code: 401,
                    message: "Please Provide Valid ObjectID !!"
            })
       }
       return new Types.ObjectId(value);
    },
    serialize(value) {
      if (!isValidObjectId(value)) {
            throw new APIError({
                    code: 401,
                    message: "Please Provide Valid ObjectID !!"
            })
       }
       return value
    },
})

const PlainJSONScalar = new GraphQLScalarType({
    name: `PlainJSON`,

    description: `Bails out of GraphQL conventions and just returns the straight JSON Object.`,

    serialize(_) {
      return _;
    },
  });
const graphqlResolver = {

    Date: dateScalar,
    nonEmptyString : nonEmptyStringScalar,
    Email: mailScaler,
    MongoID : MongoIDScalar,
    PlainJSON : PlainJSONScalar,
    Query: {
        login: async (_, {details}, context) => {

            let searchQuery;
            if(details == undefined){
                if(context.userID == undefined){
                    throw new APIError({
                        code: 401,
                        message: "Please Provide Either Login Details Or Valid Token !!"
                    })
                }
                searchQuery = {_id : context.userID }
            }else{

                searchQuery = {email : details["usermail"]}
            }



            const userDetails = await accountModel.findOne(searchQuery).lean();
            if(userDetails == null){
                // User does not exists !!
                throw new APIError({
                    code: 404,
                    message: "User Does Not Exists"
                })
            }



            const loginAttempt = Number(await redisClient.get(`LoginAttempt::${userDetails.email}`));
            if(details != undefined){
                if(loginAttempt >= 3){
                    throw new APIError({
                        code : 403,
                        message : "Max Login Attempt Crossed !! Please Try After 30 Minutes"
                    })
                }

                if(userDetails.password != details.password){
                    await redisClient.set(`LoginAttempt::${userDetails.email}`, `${loginAttempt+1}`,{EX: 60*30})
                    throw new APIError({
                        code : 403,
                        message : "Please Enter Correct Password !!"
                    })
                }
            }

            await redisClient.del(`LoginAttempt::${userDetails.email}`);
            return {
                    token: createToken({
                            userID : userDetails._id,
                            userType: userDetails.accountType
                        }),
                    name : userDetails.name,
                    email : userDetails.email,
                    currentRating : userDetails.currentRating,
                    accountType : userDetails.accountType
                }
        },
        sendOTP: async(_,  {details})  => {

            const {emailID, isNew} = details;
            const userDetails = await accountModel.findOne({email : emailID }).lean();
            if(!isNew && userDetails == null){
                throw new APIError({
                        code: 404,
                        message: "User Does Not Exists"
                })
            }
            console.log(isNew, userDetails)
            if(isNew && userDetails != null){
                throw new APIError({
                        code: 404,
                        message: "User Already Exists !!"
                })
            }


            let otpInfo = JSON.parse(await redisClient.get(`OTPRequest::${emailID}`));
            if(otpInfo != null){
               if(otpInfo.attempt > 3){
                  throw new APIError({
                    code: 401,
                    message: "You Have Exceeded Limit, Please Try After 30 Minutes"
                  })
               }
               otpInfo.attempt += 1
               otpInfo.otp = generateOTP();
            }else{
                otpInfo = {
                    "otp" :generateOTP(),
                    "attempt" : 1

                }
            }
            await redisClient.set(`OTPRequest::${emailID}`, JSON.stringify(otpInfo),{EX: 60*30});
            await sendMail(emailID, isNew ? "Welcome User !!": "Forget Passowrd !!", `Your OTP is :- ${otpInfo.otp} !!!`);
            return true

        },
        getPosts: async(_, {details}, context) =>{
            await protectMe(context);
            const searchQuery = {}
            if(details?.showMyPosts){
                searchQuery["_id"] = context.userID
            }
            if(details?.searchText){
                searchQuery["$text"] = { $search: details.searchText }
            }
            const result =  await postModel.find(searchQuery).lean().populate('postedBy', 'name');
            for(let [eachIndex, eachPosts] of result.entries()){
                result[eachIndex] = {
                    postID : eachPosts._id,
                    postedBy: eachPosts.postedBy.name,
                    description: eachPosts.description,
                    imagesLink: (await imageGrabber(eachPosts.images)).images,
                    createdAt : eachPosts.createdAt
                }

            }
            return result
        },
        getComments: async(_, { details }, context) => {
            await protectMe(context);
            const firstMatchPipeLine = {"$match" : {postID : details["postID"]}};

            if(details.commentID) {
                firstMatchPipeLine["$match"]["repliedTo"] = details.commentID;
            }

            const result = await (discussionModel.aggregate([
                firstMatchPipeLine,
                {
                    '$lookup': {
                        'from': voteModel.collection.name,
                        'let' : {
                            'userID' :  new Types.ObjectId(context.userID),
                            'discussionID': "$_id"
                        },
                        'pipeline' : [
                            {'$match' : {
                                '$expr': {
                                    "$and" : [
                                        {
                                            '$eq': ["$postedBy", "$$userID"]
                                        },
                                        {
                                            '$eq' : ["$commentID", "$$discussionID"]
                                        }
                                    ]
                                }
                            }}
                        ],
                        'as': 'voteData'
                    }
                },
                {
                    '$lookup': {
                        'from': accountModel.collection.name,
                        'localField': 'postedBy',
                        'foreignField': '_id',
                        'as': 'userData'
                    }
                },


                {
                    "$project" : {
                        "commentID" : "$_id",
                        "postedBy" : {"$first" : "$userData.name"},
                        "repliedTo" : 1,
                        "commentText" : "$text",
                        "upvotes" : 1,
                        "downvotes" : 1,
                        "userAction" : {"$cond" : {
                            "if" : {"$eq" : [{"$size" : "$voteData"}, 0] },
                            "then" : "reset",
                            "else" : {
                                "$cond" : {
                                    "if" : {"$eq" : [{"$first" : "$voteData.isUpvoted"}, true]},
                                    "then" : "upvote",
                                    "else" : "downvote",
                                }
                            }
                        }}
                    }
                }
            ]).exec())

            return result
        },

        getCommentsV1: async(_, {details}, context) => {
            await protectMe(context);
            const firstMatchPipeLine = {"$match" : {postID : details["postID"]}};
            if(details.commentID) {
                firstMatchPipeLine["$match"]["repliedTo"] = details.commentID;
            }else{
                firstMatchPipeLine["$match"]["repliedTo"] = null;

            }

            const secondPipeLine = {
                $graphLookup: {
                    from: discussionModel.collection.name,
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "repliedTo",
                    depthField: "level",
                    as: "childrenComments",
                }
            }
            if(details["depthLevel"] != undefined) {
                secondPipeLine["$graphLookup"]["maxDepth"] = details["depthLevel"]
            }
            const result = await discussionModel.aggregate([
                firstMatchPipeLine,
                secondPipeLine,
                {
                    $unwind: {
                      path: "$childrenComments",
                      preserveNullAndEmptyArrays: true
                    }
                },
                {
                    '$lookup': {
                        'from': accountModel.collection.name,
                        "let": { "postedBy": "$childrenComments.postedBy" },
                        "pipeline": [
                            { "$match": { "$expr": { "$eq": ["$_id", "$$postedBy"] }}},
                            { "$project": {name : 1, _id : 0}},
                          ],
                        'as': 'childrenComments.userData'
                    },
                },
                {
                    '$lookup': {
                        'from': accountModel.collection.name,
                        "let": { "postedBy": "$postedBy" },
                        "pipeline": [
                            { "$match": { "$expr": { "$eq": ["$_id", "$$postedBy"] }}},
                            { "$project": {name : 1, _id : 0}},
                          ],
                        'as': 'userData'
                    },

                },
                {
                    '$lookup': {
                        'from': voteModel.collection.name,
                        'let' : {
                            'userID' :  new Types.ObjectId(context.userID),
                            'discussionID': "$_id"
                        },
                        'pipeline' : [
                            {
                                '$match' : {
                                    '$expr': {
                                        "$and" : [
                                            {
                                                '$eq': ["$postedBy", "$$userID"]
                                            },
                                            {
                                                '$eq' : ["$commentID", "$$discussionID"]
                                            }
                                        ]
                                    }
                                }

                            },
                            { "$project": {isUpvoted : 1}},

                        ],
                        'as': 'voteData'
                    }
                },
                {
                    '$lookup': {
                        'from': voteModel.collection.name,
                        'let' : {
                            'userID' :  new Types.ObjectId("6601d40f888aa27c17c54fb6"),
                            'discussionID': "$childrenComments._id"
                        },
                        'pipeline' : [
                            {
                                '$match' : {
                                    '$expr': {
                                        "$and" : [
                                            {
                                                '$eq': ["$postedBy", "$$userID"]
                                            },
                                            {
                                                '$eq' : ["$commentID", "$$discussionID"]
                                            }
                                        ]
                                    }
                                }

                            },
                            { "$project": {isUpvoted : 1}},

                        ],
                        'as': 'childrenComments.voteData'
                    }
                },

              {
                 "$project" : {

                    "commentID" : "$_id",
                    "postedBy" : {"$first" : "$userData.name"},
                    "repliedTo" : 1,
                    "postID" : 1,
                    "upvotes" : 1,
                    "downvotes" : 1,
                    "text" : 1,
                    "userAction" : {"$cond" : {
                        "if" : {"$eq" : [{"$size" : "$voteData"}, 0] },
                        "then" : "reset",
                        "else" : {
                            "$cond" : {
                                "if" : {"$eq" : [{"$first" : "$voteData.isUpvoted"}, true]},
                                "then" : "upvote",
                                "else" : "downvote",
                            }
                        }
                    }},
                    "childrenComments._id" : 1,
                    "childrenComments.commentID" : "$_id",
                    "childrenComments.postedBy" : {"$first" : "$userData.name"},
                    "childrenComments.repliedTo" : 1,
                    "childrenComments.level" : 1,
                    "childrenComments.commentText" : "$childrenComments.text",
                    "childrenComments.upvotes" : 1,
                    "childrenComments.downvotes" : 1,
                    "childrenComments.userAction" : {"$cond" : {
                        "if" : {"$eq" : [{"$size" : "$childrenComments.voteData"}, 0] },
                        "then" : "reset",
                        "else" : {
                            "$cond" : {
                                "if" : {"$eq" : [{"$first" : "$childrenComments.voteData.isUpvoted"}, true]},
                                "then" : "upvote",
                                "else" : "downvote",
                            }
                        }
                    }}

                },

            },
            // WorkAround For Fixture No Child Comment Bug !!
            {
                "$set": {
                  "childrenComments": {
                    "$cond": {
                      "if": { "$gt": [{ "$ifNull": ["$childrenComments._id", null] }, null] },
                      "then": "$childrenComments",
                      "else": "$$REMOVE"
                    }
                  }
                }
            },
            { $sort: { "childrenComments.level": -1 } },
            {
                $group: {
                    _id: "$_id",

                    commentID : { $first: "$_id" },
                    repliedTo: { $first: "$repliedTo" },
                    commentText: { $first: "$text" },
                    postID: { $first: "$postID" },
                    childrenComments: { $push: "$childrenComments" },
                    postedBy : {$first : "$postedBy"},
                    upvotes : { $first: "$upvotes" },
                    downvotes : { $first: "$downvotes" },
                    userAction : { $first: "$userAction" }

                }
            },
            {

                $addFields: {
                    childrenComments: {
                    $reduce: {
                      input: "$childrenComments",
                      initialValue: {
                        level: -1,
                        presentChild: [],
                        prevChild: []
                      },
                      in: {
                        $let: {
                          vars: {
                            prev: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$value.level",
                                    "$$this.level"
                                  ]
                                },
                                "$$value.prevChild",
                                "$$value.presentChild"
                              ]
                            },
                            current: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$value.level",
                                    "$$this.level"
                                  ]
                                },
                                "$$value.presentChild",
                                []
                              ]
                            }
                          },
                          in: {
                            level: "$$this.level",
                            prevChild: "$$prev",
                            presentChild: {
                              $concatArrays: [
                                "$$current",
                                [
                                  {
                                    $mergeObjects: [
                                      "$$this",
                                      {
                                        childrenComments: {
                                          $filter: {
                                            input: "$$prev",
                                            as: "e",
                                            cond: {
                                              $eq: [
                                                "$$e.repliedTo",
                                                "$$this._id"
                                              ]
                                            }
                                          }
                                        }
                                      }
                                    ]
                                  }
                                ]
                              ]
                            }
                          }
                        }
                      }
                    }
                  }
                }
            },
            {
                $addFields: {
                    childrenComments: "$childrenComments.presentChild"
                }
            }
            ]).exec();
            return result
        },
        getPlantParts: async(_,  $, context) => {
            await protectMe(context)
            return (await plantParts.find({}).lean()).reduce((retArray, eachPart) => {
                if(eachPart.isPending && eachPart.createdBy != context.userID){
                    return retArray
                }
                retArray.push({
                    partID : eachPart._id,
                    name : eachPart.name,
                    isPending: eachPart.isPending
                })
                return retArray

            },[])
        },
        getPartsFeature: async(_, {partID}, context) => {
            await protectMe(context);
            return (await partsFeatures.find({
                partID
            }).lean()).reduce((retArray, eachFeature) => {
                if(eachFeature.isPending && eachFeature.createdBy != context.userID){
                    return retArray
                }
                retArray.push({
                    partID : partID,
                    name : eachFeature.name,
                    isPending: eachFeature.isPending,
                    featureID : eachFeature._id
                })
                return retArray
            },[])
        },
        getFeatureProperty : async(_, {details}, context) => {
            await protectMe(context);
            const { featureID, searchText } = details;
            const searchResults = await featureProperty.find({ value: { $regex: `^${searchText}`, $options: 'i' } , featureID}).lean();
            return searchResults.reduce((retArray, eachResult) => {
                if(eachResult.isPending && eachResult.createdBy != context.userID){
                    return retArray
                }
                retArray.push({
                    featurePropertyID : eachResult._id,
                    value: eachResult.value
                });
                return retArray;

            }, []);
        },
        getContribution : async(_, {details}, context) => {
            await protectMe(context);
            const {showMyContribution, postID} = details;
            const searchQuery = {postID};
            if(showMyContribution){
                searchQuery["contributedBy"] = context.userID;
            }

            return (await contributionModel.find(searchQuery).lean().populate({
                path: 'featurePropertyID',
                select: 'featureID value',
                populate: {
                    path: 'featureID',
                    select: 'name partID',
                    populate: {
                        path : 'partID',
                        select: 'name'
                    }
                }
            })).map((eachContribution) => ({
                contributionID : eachContribution._id,
                partName : eachContribution.featurePropertyID.featureID.partID.name,
                FeatureName : eachContribution.featurePropertyID.featureID.name,
                FeaturePropertyName : eachContribution.featurePropertyID.value
            }))

        },

        ModgetPendingParts: async(_, {userID}, context)  => {
            await protectMod(context);
            const searchQuery = {isPending : true}

            if(userID) {
                searchQuery["createdBy"] = userID;
            }

            return (await plantParts.find(searchQuery).lean().populate('createdBy', 'name')).map(eachPart => ({
                userID : eachPart.createdBy._id,
                partID : eachPart._id,
                userName: eachPart.createdBy.name,
                partName: eachPart.name ,
                createdAt: eachPart.createdAt
            }))

        },
        ModgetPendingPartsFeature: async(_, {details}, context) => {
            await protectMod(context);
            const searchQuery = {isPending : true};
            if(details?.userID){
                searchQuery["createdBy"] = details.userID
            }
            if(details?.partID){
                searchQuery["partID"] = details.partID
            }
            return (await partsFeatures.find(searchQuery).lean().populate([{path: 'partID', select : 'name'},{path: 'createdBy', select : 'name'}])).map((eachFeature) => {
                return {
                    partID : eachFeature.partID._id,
                    partName : eachFeature.partID.name,
                    featureID: eachFeature._id,
                    featureName: eachFeature.name,
                    userID : eachFeature.createdBy._id,
                    userName : eachFeature.createdBy.name,
                }
            })
        },
        ModgetPendingFeatureProperty : async (_, {details}, context) => {
            await protectMod(context);
            const searchQuery = {isPending : true}
            if(details?.userID){
                searchQuery["createdBy"] = details.userID
            }
            if(details?.partID){
                searchQuery["partID"] = details.partID
            }
            if(details?.featureID){
                searchQuery["featureID"] = details.featureID
            }

            return (await featureProperty.find(searchQuery).lean().populate([{
                path: 'featureID',
                select: 'name partID',
                populate: {
                    path : 'partID',
                    select: 'name'
                }
            }, {
                path: 'createdBy',
                select: 'name'
            }])).map(eachPropery => ({
                userID : eachPropery.createdBy._id,
                userName : eachPropery.createdBy.name,
                propertyName: eachPropery.value,
                featureID: eachPropery.featureID._id,
                featureName: eachPropery.featureID.name,
                partID : eachPropery.featureID.partID._id,
                partName: eachPropery.featureID.partID.name,
                createdAt: eachPropery.createdAt
            }))

        },
        ModgetPendingContribution: async (_, {details}, context) => {
            await protectMod(context);
            const searchQuery = {isPending : true};
            if(details?.userID) {
                searchQuery["contributedBy"] = details?.userID
            }
            if(details?.postID){
                searchQuery["postID"] = details?.postID
            }
            if(details?.featurePropertyID){
                searchQuery["featurePropertyID"] = details?.featurePropertyID
            }

             return ((await contributionModel.find(searchQuery).lean().populate([{
                path: 'featurePropertyID',
                select: 'featureID value',
                populate: {
                    path: 'featureID',
                    select: 'name partID',
                    populate: {
                        path : 'partID',
                        select: 'name'
                    }
                }
            }, {path : 'contributedBy', select: 'name'}])).map(eachContribution => ({
                userID :eachContribution.contributedBy._id,
                userName: eachContribution.contributedBy.name,
                partID : eachContribution.featurePropertyID.featureID.partID._id,
                partName : eachContribution.featurePropertyID.featureID.partID.name,
                featureID : eachContribution.featurePropertyID.featureID._id,
                featureName: eachContribution.featurePropertyID.featureID.name,
                featurePropertyID: eachContribution.featurePropertyID._id,
                featurePropertyName: eachContribution.featurePropertyID.value,
                postID : eachContribution.postID,
                createdAt: eachContribution.createdAt
            })));

        }
    },
    Mutation: {
        signup: async (_, {details}) => {
            const isExists = await accountModel.exists({email: details.email});
            if(isExists){
                // User already exists !!
                throw new APIError({
                    code: 400,
                    message: "User Already Exists !!"
                })
            }



            const totalAttempt = Number(await redisClient.get(`OTPAttempt::${details.email}`));
            const otpInfo = JSON.parse(await redisClient.get(`OTPRequest::${details.email}`));

            if(otpInfo == null){
                throw new APIError({
                    code : 404,
                    message: "Please Request For New OTP First !!"
                })
            }

            if(totalAttempt >= 3 ){
                throw new APIError({
                    code : 404,
                    message: "You Have Exhausted Attempt Request, Try After 30 Minutes !!"
                })
            }

            if(otpInfo.otp != details.otp){
                await redisClient.set(`OTPAttempt::${details.email}`, totalAttempt+1, {"EX" : 60*30});
                throw new APIError({
                    code : 404,
                    message : "You Have Entered Wrong OTP !! Please Try Again !!"
                })
            }
            await redisClient.del(`OTPAttempt::${details.email}`);
            await redisClient.del(`OTPRequest::${details.email}`);
            const user = new accountModel({
                name : details.name,
                email : details.email,
                password: details.password
            })

            await user.save()
            return {
                token : createToken({
                            userID : user._id,
                            userType: 2
                        }),
                name : user.name,
                email : user.email,
                currentRating : user.currentRating,
                accountType : user.accountType
        }

        },
        forgetPassword: async(_, {details}) => {
            const {otp, emailID, newPassword} = details;


            const totalAttempt = Number(await redisClient.get(`OTPAttempt::${emailID}`));
            const otpInfo = JSON.parse(await redisClient.get(`OTPRequest::${emailID}`));

            if(otpInfo == null){
                throw new APIError({
                    code : 404,
                    message: "Please Request For New OTP First !!"
                })
            }

            if(totalAttempt >= 3 ){
                throw new APIError({
                    code : 404,
                    message: "You Have Exhausted Attempt Request, Try After 30 Minutes !!"
                })
            }

            if(otp == otpInfo.otp){
                await accountModel.updateOne({email : emailID}, {password : newPassword});

                await redisClient.del(`OTPAttempt::${emailID}`);
                await redisClient.del(`OTPRequest::${emailID}`);
                await redisClient.del(`LoginAttempt::${emailID}`);

                return "Password Has Been Changed Successfully !!"
            }

            await redisClient.set(`OTPAttempt::${emailID}`, totalAttempt+1, {"EX" : 60*30});
            throw new APIError({
                code : 404,
                message : "You Have Entered Wrong OTP !! Please Try Again !!"
            })

        },
        createPost: async(_, {details}, context) => {
            await protectMe(context);

            if(details.images.length == 0){
                throw new APIError({
                    code : 400,
                    message: "Please Send Atleast One Images !!"
                })
            }

            const imageHandler = await imageUploader(details.images);
            const newPost = new postModel({
                    images : imageHandler["uniqID"],
                    description: details["description"],
                    postedBy: context.userID,
                    isPending: context.userType == 2
            })
            if(context.userType != 2) {
                    newPost["approvedBy"] = context.userID;
            }
            await newPost.save();
            return newPost._id
        },
        deletePost: async(_, {postID}, context) => {
            await protectMe(context);

            const grabPostDetails = await postModel.findOne({_id : postID});

            if(grabPostDetails == null)
                throw new APIError({code : 404, message : "Post Does Not Exists !"});

            if(grabPostDetails.postedBy != context.userID)
                throw new APIError({code : 401, message : "You Don't Have Permission To Delete This Post !"});

            // Deletion Post Need To Delete All Comments And Votes.

            throw new APIError({code : 501, message : "This Route Is Still In Building Phase !!"})

        },
        postComment: async(_, {details}, context) => {
            await protectMe(context);

            const { commentText, postID } = details;
            // Can Have Some Checker

            const isPostExists = await postModel.exists({_id : postID});
            if(!isPostExists){
                throw new APIError({
                    code : 400,
                    message: "Post Does'nt Exists !!!"
                })
            }

            let repliedTo = details.repliedTo != undefined ? details.repliedTo : null
            const newComment = new discussionModel({
                text: commentText,
                postID,
                repliedTo,
                postedBy : context.userID
            })
            await newComment.save()
            return newComment._id
        },
        addPlantPart:  async(_, {partName}, context) => {
            await protectMe(context);
            partName = partName.toUpperCase()


            const grabPartData = await plantParts.findOne({
                name : partName
            }).lean();

            if(grabPartData != undefined && grabPartData.createdBy == context.userID){
                throw new APIError({
                    code : 400,
                    message: "Plant Part Already Exists !!"
                })
            }

            const newPlantPart = new plantParts({
                name: partName,
                isPending: context.userType == 2,
                createdBy: context.userID
            })
            if(context.userType != 2){
                newPlantPart["approvedBy"] = context.userID
            }
            await newPlantPart.save();
            return newPlantPart._id
        },
        addPartFeature: async(_, { details }, context) => {
            await protectMe(context);
            const isPartExist = await plantParts.exists({
                _id : details.partID
            })
            if(!isPartExist){
                throw new APIError({
                    code : 400,
                    message: "Plant Part Does Not Exists !!"
                })
            }
            details.featureName = details.featureName.toUpperCase();

            // Duplicate Features Can Happen
            // Due To Both User Have Diffrent ID
            // Work around for now.

            const grabFeature = await partsFeatures.findOne({
                partID : details.partID,
                name :  details.featureName
            }).lean()

            if(grabFeature != undefined && (!grabFeature.isPending || grabFeature.createdBy == context.userID) ){
                throw new APIError({
                    code : 400,
                    message: "Part Feature Already Exists !!"
                })
            }
            const newPartFeature = new partsFeatures({
                name : details.featureName,
                partID : details.partID,
                isPending : context.userType == 2,
                createdBy: context.userID

            })
            if(context.userType != 2){
                newPartFeature["approvedBy"] = context.userID
            }
            await newPartFeature.save();
            return newPartFeature._id

        },
        addFeatureProperty: async(_, {details}, context) => {
            await protectMe(context);

            const grabFeature = await partsFeatures.findOne({
                _id: details.featureID
            }).lean();

            if(grabFeature == undefined){
                throw new APIError({
                    code : 400,
                    message : "Part Feature Does Not Exists !!"
                })
            }

            /*
                Kapil Sir's Service Which Could Detect Similarity
                    Between Two Values
            */

            details.value = details.value.toUpperCase();
            const isPropertyExists = await featureProperty.exists({
                featureID : details.featureID,
                value : details.value
            })

            if(isPropertyExists){
                throw new APIError({
                    code: 400,
                    message: "This Property Already Exists !!"
                })
            }

            const newPropertyOfFeature = new featureProperty({
                value : details.value,
                featureID : details.featureID,
                isPending : context.userType == 2,
                createdBy: context.userID
            })
            if(context.userType != 2){
                newPropertyOfFeature["approvedBy"] = context.userID
            }
            await newPropertyOfFeature.save();
            return newPropertyOfFeature._id
        },
        addContribution: async(_, {details}, context) => {
            // Need To Work Here.
            await protectMe(context);
            const { postID, featurePropertyID} = details;


            const isPostExists = await postModel.exists({
                _id : postID
            });

            if(!isPostExists){
                throw new APIError({
                    code : 400,
                    message : "Post Does Not Exists !!"
                })
            }

            const grabFeature = await featureProperty.findOne({
                _id : featurePropertyID
            }).lean();

            if(grabFeature == null || (grabFeature.isPending && grabFeature.createdBy != context.userID)){
                throw new APIError({
                    code : 400,
                    message : "Feature Does Not Exists !!"
                })
            }

            // Does User Aleeady Contributed Same Stuff On Post
            const isContributionFromUserExists = await contributionModel.exists({
                postID,
                featurePropertyID,
                contributedBy : context.userID
            });

            if(isContributionFromUserExists){
                throw new APIError({
                    code : 400,
                    message: "You Have Already Contributed Same Thing !!"
                })
            }

            // Create User Contribution

            const newContribution = new contributionModel({
                postID,
                featurePropertyID,
                isPending : context.userType == 2,
                contributedBy : context.userID
            });
            if(context.userType != 2){
                newContribution["approvedBy"] = context.userID
            }
            await newContribution.save();

            return newContribution._id;

        },
        deleteComment : async(_, {commentID}, context) => {
            await protectMe(context);

            const grabcomment = await discussionModel.findOne({
                _id : commentID
            })

            if(!grabcomment){
                throw new APIError({
                    code: 400,
                    message: "Comment Does Not Exists !!"
                })
            }

            if(grabcomment.postedBy != context.userID && context.userID != 2){
                throw new APIError({
                    code: 403,
                    message: "You are not authorized to delete this comment !!"
                })
            }
            const result = await discussionModel.aggregate([
                {$match : {_id : commentID}},
                {
                  $graphLookup: {
                    from: discussionModel.collection.name,
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "repliedTo",
                    as: "ids"
                  }
                },
                {
                    $unwind: {
                      path: "$ids",
                      preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $project : {
                        _id : 1,
                        childID : "$ids._id"
                    }
                }
              ]).exec();
            const idSet = new Set();



            for(let eachBlock of result){
                idSet.add(eachBlock["_id"].toString())
                idSet.add(eachBlock["childID"]?.toString())
            }
            idSet.delete(undefined)

            const uniqueIDArray = [...idSet];

            await discussionModel.deleteMany({"_id":{$in:uniqueIDArray}})
            await voteModel.deleteMany({"commentID":{$in:uniqueIDArray}})

            return grabcomment._id
        },
        updateInfo: async(_, {details}, context) => {
            await protectMe(context);
            const toChange = {}
            if(details.name != undefined){
                toChange["name"] = details.name;
            }

            if(details.password != undefined){
                toChange["password"] = details.password;
            }

            await accountModel.updateOne({_id: context.userID}, {"$set" : toChange})
            return "Okay"
        },
        updateVote: async(_, {details}, context) => {
            await protectMe(context);
            const isCommentExists = await discussionModel.exists({_id : details.commentID});

            if(!isCommentExists)
                throw new APIError({ code : 404, message : "Comment Does Not Exists !!"});


            const grabCurrentVotesInfo = await voteModel.findOne({postedBy : context.userID, commentID: details.commentID});

            if(details.action == "reset"){
                if(grabCurrentVotesInfo == null)
                    throw new APIError({code : 404, message : "You Dont Have Any Vote Yet !!"});

                const decrementField = grabCurrentVotesInfo.isUpvoted ? "upvotes" : "downvotes"
                await discussionModel.updateOne({_id : details.commentID}, {$inc : {[decrementField] : -1 }})
                await voteModel.deleteOne({postedBy : context.userID, commentID: details.commentID });
                return "Vote Has Been Removed !"
            }

            if(grabCurrentVotesInfo == null){
                // No Votes Yet !!
                const newVote = new voteModel({
                    postedBy : context.userID,
                    commentID: details.commentID,
                    isUpvoted: details.action == 'upvote'
                })
                await newVote.save();

                const decrementField = newVote.isUpvoted ? "upvotes" : "downvotes"
                await discussionModel.updateOne({_id : details.commentID}, {$inc : {[decrementField] : 1 }})

                return "Vote Has Been Created !!";

            }else{
                const needToChange = (grabCurrentVotesInfo.isUpvoted && details.action == 'downvote') ||  (!grabCurrentVotesInfo.isUpvoted && details.action == 'upvote')
                if(needToChange){
                    if(grabCurrentVotesInfo.isUpvoted){
                        await discussionModel.updateOne({_id : details.commentID}, {$inc : {"upvotes" : -1,  "downvotes" : 1}})
                        grabCurrentVotesInfo.isUpvoted = false;
                    }else{
                        await discussionModel.updateOne({_id : details.commentID}, {$inc : {"upvotes" : 1,  "downvotes" : -1}})
                        grabCurrentVotesInfo.isUpvoted = true;

                    }
                    await grabCurrentVotesInfo.save()
                    return "Vote Has Been Updated !!";
                }
            }
            return "No Changes Required !!!"
        },

        ModverifyPendingPart: async(_, {partID}, context) => {
            await protectMod(context);

            const grabPartDetail = await plantParts.findOne({
                _id : partID
            });
            if(!grabPartDetail){
                throw new APIError({
                    code: 400,
                    message: "Part Does Not Exists !!"
                })
            }

            if(!grabPartDetail.isPending){
                throw new APIError({
                    code: 400,
                    message: "Part Does Not Exists !!"
                })
            }

            grabPartDetail.isPending = false;
            grabPartDetail.approvedBy = context.userID
            await grabPartDetail.save();
            return grabPartDetail._id

        },
        ModverifyPendingFeature: async(_, {featureID}, context) => {
            await protectMod(context);

            const grabFeatureData = await partsFeatures.findOne({
                _id : featureID
            })

            if(!grabFeatureData){
                throw new APIError({
                    code : 400,
                    message: "Feature Does Not Exists !!"
                })
            }
            if(!grabFeatureData.isPending){
                throw new APIError({
                    code: 400,
                    message : "Feature Already Approved !!"
                })
            }
            grabFeatureData.isPending = false
            grabFeatureData.contributedBy = context.userID
            await grabFeatureData.save();
            return grabFeatureData._id
        },
        ModverifyPendingProperty: async(_, {featurePropertyID},context) => {
            await protectMod(context);

            const grabPropertyData = await featureProperty.findOne({
                _id: featurePropertyID
            });

            if(!grabPropertyData){
                throw new APIError({
                    code: 400,
                    message: "Feature Property Does Not Exists !!"
                })
            }
            if(!grabPropertyData.isPending){
                throw new APIError({
                    code : 400,
                    message: "Feature Property Already Approved !!"
                })
            }

            grabPropertyData.isPending = false;
            grabPropertyData.contributedBy = context.userID
            await grabPropertyData.save();
            return grabPropertyData._id
        },
        ModverifyPendingContribution: async(_, {contributionID}, context) => {
            await protectMod(context);
            const grabContribution = await contributionModel.findOne({
                _id : contributionID
            })

            if(!grabContribution){
                throw new APIError({
                    code: 400,
                    message: "Contribution Does Not Exists !!"
                })
            }

            if(!grabContribution.isPending){
                throw new APIError({
                    code : 400,
                    message: "Contribution Is Already Approved !!"
                })
            }

            grabContribution.approvedBy = context.userID
            grabContribution.isPending = false
            await grabContribution.save();
            return grabContribution._id;
        }
    },

  };


const preFunction = ({req}) =>{
    if(req.headers.hasOwnProperty('token')){
        const decodedData = verifyToken(req.headers.token)
        if(decodedData.hasOwnProperty("Error")){
            throw new GraphQLError("Wrong Token Dude", {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                  }
            })
        }

        return {
            userID : decodedData.userID,
            userType: decodedData.userType
        }
    }
    return {}
}
export { graphqlSchema,graphqlResolver,preFunction,setRedisClient }
