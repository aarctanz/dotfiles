import { Types } from 'mongoose';
import { APIError } from '../utils/errorHandler.js';
import { imageUploader, imageGrabber } from '../services/imageHandler.js';
import { protectMe } from '../utils/tokenHandler.js';
import { accountModel, postModel, discussionModel, voteModel, plantParts, partsFeatures, featureProperty, contributionModel } from '../models/index.js';


const postQueryResolvers = {
    getPosts: async (_, { details }, context) => {
        await protectMe(context);
        const searchQuery = {}
        if (details?.showMyPosts) {
            searchQuery["_id"] = context.userID
        }
        if (details?.searchText) {
            searchQuery["$text"] = { $search: details.searchText }
        }
        const result = await postModel.find(searchQuery).lean().populate('postedBy', 'name');
        for (let [eachIndex, eachPosts] of result.entries()) {
            result[eachIndex] = {
                postID: eachPosts._id,
                postedBy: eachPosts.postedBy.name,
                description: eachPosts.description,
                imagesLink: (await imageGrabber(eachPosts.images)).images,
                createdAt: eachPosts.createdAt
            }

        }
        return result
    },
    getComments: async (_, { details }, context) => {
        await protectMe(context);
        const firstMatchPipeLine = { "$match": { postID: details["postID"] } };

        if (details.commentID) {
            firstMatchPipeLine["$match"]["repliedTo"] = details.commentID;
        }

        const result = await (discussionModel.aggregate([
            firstMatchPipeLine,
            {
                '$lookup': {
                    'from': voteModel.collection.name,
                    'let': {
                        'userID': new Types.ObjectId(context.userID),
                        'discussionID': "$_id"
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    "$and": [
                                        {
                                            '$eq': ["$postedBy", "$$userID"]
                                        },
                                        {
                                            '$eq': ["$commentID", "$$discussionID"]
                                        }
                                    ]
                                }
                            }
                        }
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
                "$project": {
                    "commentID": "$_id",
                    "postedBy": { "$first": "$userData.name" },
                    "repliedTo": 1,
                    "commentText": "$text",
                    "upvotes": 1,
                    "downvotes": 1,
                    "userAction": {
                        "$cond": {
                            "if": { "$eq": [{ "$size": "$voteData" }, 0] },
                            "then": "reset",
                            "else": {
                                "$cond": {
                                    "if": { "$eq": [{ "$first": "$voteData.isUpvoted" }, true] },
                                    "then": "upvote",
                                    "else": "downvote",
                                }
                            }
                        }
                    }
                }
            }
        ]).exec())

        return result
    },

    getCommentsV1: async (_, { details }, context) => {
        await protectMe(context);
        const firstMatchPipeLine = { "$match": { postID: details["postID"] } };
        if (details.commentID) {
            firstMatchPipeLine["$match"]["repliedTo"] = details.commentID;
        } else {
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
        if (details["depthLevel"] != undefined) {
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
                        { "$match": { "$expr": { "$eq": ["$_id", "$$postedBy"] } } },
                        { "$project": { name: 1, _id: 0 } },
                    ],
                    'as': 'childrenComments.userData'
                },
            },
            {
                '$lookup': {
                    'from': accountModel.collection.name,
                    "let": { "postedBy": "$postedBy" },
                    "pipeline": [
                        { "$match": { "$expr": { "$eq": ["$_id", "$$postedBy"] } } },
                        { "$project": { name: 1, _id: 0 } },
                    ],
                    'as': 'userData'
                },

            },
            {
                '$lookup': {
                    'from': voteModel.collection.name,
                    'let': {
                        'userID': new Types.ObjectId(context.userID),
                        'discussionID': "$_id"
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    "$and": [
                                        {
                                            '$eq': ["$postedBy", "$$userID"]
                                        },
                                        {
                                            '$eq': ["$commentID", "$$discussionID"]
                                        }
                                    ]
                                }
                            }

                        },
                        { "$project": { isUpvoted: 1 } },

                    ],
                    'as': 'voteData'
                }
            },
            {
                '$lookup': {
                    'from': voteModel.collection.name,
                    'let': {
                        'userID': new Types.ObjectId("6601d40f888aa27c17c54fb6"),
                        'discussionID': "$childrenComments._id"
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    "$and": [
                                        {
                                            '$eq': ["$postedBy", "$$userID"]
                                        },
                                        {
                                            '$eq': ["$commentID", "$$discussionID"]
                                        }
                                    ]
                                }
                            }

                        },
                        { "$project": { isUpvoted: 1 } },

                    ],
                    'as': 'childrenComments.voteData'
                }
            },

            {
                "$project": {

                    "commentID": "$_id",
                    "postedBy": { "$first": "$userData.name" },
                    "repliedTo": 1,
                    "postID": 1,
                    "upvotes": 1,
                    "downvotes": 1,
                    "text": 1,
                    "userAction": {
                        "$cond": {
                            "if": { "$eq": [{ "$size": "$voteData" }, 0] },
                            "then": "reset",
                            "else": {
                                "$cond": {
                                    "if": { "$eq": [{ "$first": "$voteData.isUpvoted" }, true] },
                                    "then": "upvote",
                                    "else": "downvote",
                                }
                            }
                        }
                    },
                    "childrenComments._id": 1,
                    "childrenComments.commentID": "$_id",
                    "childrenComments.postedBy": { "$first": "$userData.name" },
                    "childrenComments.repliedTo": 1,
                    "childrenComments.level": 1,
                    "childrenComments.commentText": "$childrenComments.text",
                    "childrenComments.upvotes": 1,
                    "childrenComments.downvotes": 1,
                    "childrenComments.userAction": {
                        "$cond": {
                            "if": { "$eq": [{ "$size": "$childrenComments.voteData" }, 0] },
                            "then": "reset",
                            "else": {
                                "$cond": {
                                    "if": { "$eq": [{ "$first": "$childrenComments.voteData.isUpvoted" }, true] },
                                    "then": "upvote",
                                    "else": "downvote",
                                }
                            }
                        }
                    }

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

                    commentID: { $first: "$_id" },
                    repliedTo: { $first: "$repliedTo" },
                    commentText: { $first: "$text" },
                    postID: { $first: "$postID" },
                    childrenComments: { $push: "$childrenComments" },
                    postedBy: { $first: "$postedBy" },
                    upvotes: { $first: "$upvotes" },
                    downvotes: { $first: "$downvotes" },
                    userAction: { $first: "$userAction" }

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
    getPlantParts: async (_, $, context) => {
        await protectMe(context)
        return (await plantParts.find({}).lean()).reduce((retArray, eachPart) => {
            if (eachPart.isPending && eachPart.createdBy != context.userID) {
                return retArray
            }
            retArray.push({
                partID: eachPart._id,
                name: eachPart.name,
                isPending: eachPart.isPending
            })
            return retArray

        }, [])
    },
    getPartsFeature: async (_, { partID }, context) => {
        await protectMe(context);
        return (await partsFeatures.find({
            partID
        }).lean()).reduce((retArray, eachFeature) => {
            if (eachFeature.isPending && eachFeature.createdBy != context.userID) {
                return retArray
            }
            retArray.push({
                partID: partID,
                name: eachFeature.name,
                isPending: eachFeature.isPending,
                featureID: eachFeature._id
            })
            return retArray
        }, [])
    },
    getFeatureProperty: async (_, { details }, context) => {
        await protectMe(context);
        const { featureID, searchText } = details;
        const searchResults = await featureProperty.find({ value: { $regex: `^${searchText}`, $options: 'i' }, featureID }).lean();
        return searchResults.reduce((retArray, eachResult) => {
            if (eachResult.isPending && eachResult.createdBy != context.userID) {
                return retArray
            }
            retArray.push({
                featurePropertyID: eachResult._id,
                value: eachResult.value
            });
            return retArray;

        }, []);
    },
    getContribution: async (_, { details }, context) => {
        await protectMe(context);
        const { showMyContribution, postID } = details;
        const searchQuery = { postID };
        if (showMyContribution) {
            searchQuery["contributedBy"] = context.userID;
        }

        return (await contributionModel.find(searchQuery).lean().populate({
            path: 'featurePropertyID',
            select: 'featureID value',
            populate: {
                path: 'featureID',
                select: 'name partID',
                populate: {
                    path: 'partID',
                    select: 'name'
                }
            }
        })).map((eachContribution) => ({
            contributionID: eachContribution._id,
            partName: eachContribution.featurePropertyID.featureID.partID.name,
            FeatureName: eachContribution.featurePropertyID.featureID.name,
            FeaturePropertyName: eachContribution.featurePropertyID.value
        }))

    },

}

const postMutationResolvers = {
    createPost: async (_, { details }, context) => {
        await protectMe(context);

        if (details.images.length == 0) {
            throw new APIError({
                code: 400,
                message: "Please Send Atleast One Images !!"
            })
        }

        const imageHandler = await imageUploader(details.images);
        const newPost = new postModel({
            images: imageHandler["uniqID"],
            description: details["description"],
            postedBy: context.userID,
            isPending: context.userType == 2
        })
        if (context.userType != 2) {
            newPost["approvedBy"] = context.userID;
        }
        await newPost.save();
        return newPost._id
    },
    deletePost: async (_, { postID }, context) => {
        await protectMe(context);

        const grabPostDetails = await postModel.findOne({ _id: postID });

        if (grabPostDetails == null)
            throw new APIError({ code: 404, message: "Post Does Not Exists !" });

        if (grabPostDetails.postedBy != context.userID)
            throw new APIError({ code: 401, message: "You Don't Have Permission To Delete This Post !" });

        // Deletion Post Need To Delete All Comments And Votes.

        throw new APIError({ code: 501, message: "This Route Is Still In Building Phase !!" })

    },
    postComment: async (_, { details }, context) => {
        await protectMe(context);

        const { commentText, postID } = details;
        // Can Have Some Checker

        const isPostExists = await postModel.exists({ _id: postID });
        if (!isPostExists) {
            throw new APIError({
                code: 400,
                message: "Post Does'nt Exists !!!"
            })
        }

        let repliedTo = details.repliedTo != undefined ? details.repliedTo : null
        const newComment = new discussionModel({
            text: commentText,
            postID,
            repliedTo,
            postedBy: context.userID
        })
        await newComment.save()
        return newComment._id
    },
    addPlantPart: async (_, { partName }, context) => {
        await protectMe(context);
        partName = partName.toUpperCase()


        const grabPartData = await plantParts.findOne({
            name: partName
        }).lean();

        if (grabPartData != undefined && grabPartData.createdBy == context.userID) {
            throw new APIError({
                code: 400,
                message: "Plant Part Already Exists !!"
            })
        }

        const newPlantPart = new plantParts({
            name: partName,
            isPending: context.userType == 2,
            createdBy: context.userID
        })
        if (context.userType != 2) {
            newPlantPart["approvedBy"] = context.userID
        }
        await newPlantPart.save();
        return newPlantPart._id
    },
    addPartFeature: async (_, { details }, context) => {
        await protectMe(context);
        const isPartExist = await plantParts.exists({
            _id: details.partID
        })
        if (!isPartExist) {
            throw new APIError({
                code: 400,
                message: "Plant Part Does Not Exists !!"
            })
        }
        details.featureName = details.featureName.toUpperCase();

        // Duplicate Features Can Happen
        // Due To Both User Have Diffrent ID
        // Work around for now.

        const grabFeature = await partsFeatures.findOne({
            partID: details.partID,
            name: details.featureName
        }).lean()

        if (grabFeature != undefined && (!grabFeature.isPending || grabFeature.createdBy == context.userID)) {
            throw new APIError({
                code: 400,
                message: "Part Feature Already Exists !!"
            })
        }
        const newPartFeature = new partsFeatures({
            name: details.featureName,
            partID: details.partID,
            isPending: context.userType == 2,
            createdBy: context.userID

        })
        if (context.userType != 2) {
            newPartFeature["approvedBy"] = context.userID
        }
        await newPartFeature.save();
        return newPartFeature._id

    },
    addFeatureProperty: async (_, { details }, context) => {
        await protectMe(context);

        const grabFeature = await partsFeatures.findOne({
            _id: details.featureID
        }).lean();

        if (grabFeature == undefined) {
            throw new APIError({
                code: 400,
                message: "Part Feature Does Not Exists !!"
            })
        }

        /*
            Kapil Sir's Service Which Could Detect Similarity
                Between Two Values
        */

        details.value = details.value.toUpperCase();
        const isPropertyExists = await featureProperty.exists({
            featureID: details.featureID,
            value: details.value
        })

        if (isPropertyExists) {
            throw new APIError({
                code: 400,
                message: "This Property Already Exists !!"
            })
        }

        const newPropertyOfFeature = new featureProperty({
            value: details.value,
            featureID: details.featureID,
            isPending: context.userType == 2,
            createdBy: context.userID
        })
        if (context.userType != 2) {
            newPropertyOfFeature["approvedBy"] = context.userID
        }
        await newPropertyOfFeature.save();
        return newPropertyOfFeature._id
    },
    addContribution: async (_, { details }, context) => {
        // Need To Work Here.
        await protectMe(context);
        const { postID, featurePropertyID } = details;


        const isPostExists = await postModel.exists({
            _id: postID
        });

        if (!isPostExists) {
            throw new APIError({
                code: 400,
                message: "Post Does Not Exists !!"
            })
        }

        const grabFeature = await featureProperty.findOne({
            _id: featurePropertyID
        }).lean();

        if (grabFeature == null || (grabFeature.isPending && grabFeature.createdBy != context.userID)) {
            throw new APIError({
                code: 400,
                message: "Feature Does Not Exists !!"
            })
        }

        // Does User Aleeady Contributed Same Stuff On Post
        const isContributionFromUserExists = await contributionModel.exists({
            postID,
            featurePropertyID,
            contributedBy: context.userID
        });

        if (isContributionFromUserExists) {
            throw new APIError({
                code: 400,
                message: "You Have Already Contributed Same Thing !!"
            })
        }

        // Create User Contribution

        const newContribution = new contributionModel({
            postID,
            featurePropertyID,
            isPending: context.userType == 2,
            contributedBy: context.userID
        });
        if (context.userType != 2) {
            newContribution["approvedBy"] = context.userID
        }
        await newContribution.save();

        return newContribution._id;

    },
    deleteComment: async (_, { commentID }, context) => {
        await protectMe(context);

        const grabcomment = await discussionModel.findOne({
            _id: commentID
        })

        if (!grabcomment) {
            throw new APIError({
                code: 400,
                message: "Comment Does Not Exists !!"
            })
        }

        if (grabcomment.postedBy != context.userID && context.userID != 2) {
            throw new APIError({
                code: 403,
                message: "You are not authorized to delete this comment !!"
            })
        }
        const result = await discussionModel.aggregate([
            { $match: { _id: commentID } },
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
                $project: {
                    _id: 1,
                    childID: "$ids._id"
                }
            }
        ]).exec();
        const idSet = new Set();



        for (let eachBlock of result) {
            idSet.add(eachBlock["_id"].toString())
            idSet.add(eachBlock["childID"]?.toString())
        }
        idSet.delete(undefined)

        const uniqueIDArray = [...idSet];

        await discussionModel.deleteMany({ "_id": { $in: uniqueIDArray } })
        await voteModel.deleteMany({ "commentID": { $in: uniqueIDArray } })

        return grabcomment._id
    },
    updateInfo: async (_, { details }, context) => {
        await protectMe(context);
        const toChange = {}
        if (details.name != undefined) {
            toChange["name"] = details.name;
        }

        if (details.password != undefined) {
            toChange["password"] = details.password;
        }

        await accountModel.updateOne({ _id: context.userID }, { "$set": toChange })
        return "Okay"
    },
    updateVote: async (_, { details }, context) => {
        await protectMe(context);
        const isCommentExists = await discussionModel.exists({ _id: details.commentID });

        if (!isCommentExists)
            throw new APIError({ code: 404, message: "Comment Does Not Exists !!" });


        const grabCurrentVotesInfo = await voteModel.findOne({ postedBy: context.userID, commentID: details.commentID });

        if (details.action == "reset") {
            if (grabCurrentVotesInfo == null)
                throw new APIError({ code: 404, message: "You Dont Have Any Vote Yet !!" });

            const decrementField = grabCurrentVotesInfo.isUpvoted ? "upvotes" : "downvotes"
            await discussionModel.updateOne({ _id: details.commentID }, { $inc: { [decrementField]: -1 } })
            await voteModel.deleteOne({ postedBy: context.userID, commentID: details.commentID });
            return "Vote Has Been Removed !"
        }

        if (grabCurrentVotesInfo == null) {
            // No Votes Yet !!
            const newVote = new voteModel({
                postedBy: context.userID,
                commentID: details.commentID,
                isUpvoted: details.action == 'upvote'
            })
            await newVote.save();

            const decrementField = newVote.isUpvoted ? "upvotes" : "downvotes"
            await discussionModel.updateOne({ _id: details.commentID }, { $inc: { [decrementField]: 1 } })

            return "Vote Has Been Created !!";

        } else {
            const needToChange = (grabCurrentVotesInfo.isUpvoted && details.action == 'downvote') || (!grabCurrentVotesInfo.isUpvoted && details.action == 'upvote')
            if (needToChange) {
                if (grabCurrentVotesInfo.isUpvoted) {
                    await discussionModel.updateOne({ _id: details.commentID }, { $inc: { "upvotes": -1, "downvotes": 1 } })
                    grabCurrentVotesInfo.isUpvoted = false;
                } else {
                    await discussionModel.updateOne({ _id: details.commentID }, { $inc: { "upvotes": 1, "downvotes": -1 } })
                    grabCurrentVotesInfo.isUpvoted = true;

                }
                await grabCurrentVotesInfo.save()
                return "Vote Has Been Updated !!";
            }
        }
        return "No Changes Required !!!"
    },
}

export { postMutationResolvers, postQueryResolvers }