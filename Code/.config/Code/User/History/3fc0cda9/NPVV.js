import { verifyToken, createToken } from "../utils/tokenGenerator.js";
import { GraphQLError, GraphQLScalarType } from "graphql";

import { APIError } from "../utils/errorHandler.js";

import { Types } from 'mongoose';
import { accountModel } from '../models/user.js'
import { postModel, discussionModel, contributionModel, voteModel } from "../models/post.js";
import { imageGrabber, imageUploader } from "../services/imageHandler.js";
import { featureProperty, partsFeatures, plantParts } from "../models/default.js";

import { generateOTP } from '../utils/otpGenerator.js'
import { sendMail } from '../services/mailer.js'

import { graphqlSchema } from "./schema.js";
import { nonEmptyStringScalar, dateScalar, MongoIDScalar, PlainJSONScalar, mailScaler } from "./scalar.js";

import { authMutationResolvers, authQueryResolvers,setRedisClient } from "./resolvers/authResolvers.js";
import { postMutationResolvers, postQueryResolvers } from "./resolvers/postresolvers.js";




async function protectMe(context) {

    if (context.userID != undefined) {
        const isUserExists = await accountModel.exists({ _id: context.userID })
        if (isUserExists) {
            return;
        }
    }
    throw new APIError({
        code: 601,
        message: "Please Login First !!!"
    })
}



const graphqlResolver = {

    Date: dateScalar,
    nonEmptyString: nonEmptyStringScalar,
    Email: mailScaler,
    MongoID: MongoIDScalar,
    PlainJSON: PlainJSONScalar,
    Query: {
        login: authQueryResolvers.login,
        sendOTP: authQueryResolvers.sendOTP,

        getPosts: postQueryResolvers.getPosts,
        getComments: postQueryResolvers.getComments,
        getCommentsV1: postQueryResolvers.getCommentsV1,
        getPlantParts: postQueryResolvers.getPlantParts,
        getPartsFeature: postQueryResolvers.getPartsFeature,
        getFeatureProperty: postQueryResolvers.getFeatureProperty,
        getContribution: postQueryResolvers.getContribution,

        ModgetPendingParts: async (_, { userID }, context) => {
            await protectMod(context);
            const searchQuery = { isPending: true }

            if (userID) {
                searchQuery["createdBy"] = userID;
            }

            return (await plantParts.find(searchQuery).lean().populate('createdBy', 'name')).map(eachPart => ({
                userID: eachPart.createdBy._id,
                partID: eachPart._id,
                userName: eachPart.createdBy.name,
                partName: eachPart.name,
                createdAt: eachPart.createdAt
            }))

        },
        ModgetPendingPartsFeature: async (_, { details }, context) => {
            await protectMod(context);
            const searchQuery = { isPending: true };
            if (details?.userID) {
                searchQuery["createdBy"] = details.userID
            }
            if (details?.partID) {
                searchQuery["partID"] = details.partID
            }
            return (await partsFeatures.find(searchQuery).lean().populate([{ path: 'partID', select: 'name' }, { path: 'createdBy', select: 'name' }])).map((eachFeature) => {
                return {
                    partID: eachFeature.partID._id,
                    partName: eachFeature.partID.name,
                    featureID: eachFeature._id,
                    featureName: eachFeature.name,
                    userID: eachFeature.createdBy._id,
                    userName: eachFeature.createdBy.name,
                }
            })
        },
        ModgetPendingFeatureProperty: async (_, { details }, context) => {
            await protectMod(context);
            const searchQuery = { isPending: true }
            if (details?.userID) {
                searchQuery["createdBy"] = details.userID
            }
            if (details?.partID) {
                searchQuery["partID"] = details.partID
            }
            if (details?.featureID) {
                searchQuery["featureID"] = details.featureID
            }

            return (await featureProperty.find(searchQuery).lean().populate([{
                path: 'featureID',
                select: 'name partID',
                populate: {
                    path: 'partID',
                    select: 'name'
                }
            }, {
                path: 'createdBy',
                select: 'name'
            }])).map(eachPropery => ({
                userID: eachPropery.createdBy._id,
                userName: eachPropery.createdBy.name,
                propertyName: eachPropery.value,
                featureID: eachPropery.featureID._id,
                featureName: eachPropery.featureID.name,
                partID: eachPropery.featureID.partID._id,
                partName: eachPropery.featureID.partID.name,
                createdAt: eachPropery.createdAt
            }))

        },
        ModgetPendingContribution: async (_, { details }, context) => {
            await protectMod(context);
            const searchQuery = { isPending: true };
            if (details?.userID) {
                searchQuery["contributedBy"] = details?.userID
            }
            if (details?.postID) {
                searchQuery["postID"] = details?.postID
            }
            if (details?.featurePropertyID) {
                searchQuery["featurePropertyID"] = details?.featurePropertyID
            }

            return ((await contributionModel.find(searchQuery).lean().populate([{
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
            }, { path: 'contributedBy', select: 'name' }])).map(eachContribution => ({
                userID: eachContribution.contributedBy._id,
                userName: eachContribution.contributedBy.name,
                partID: eachContribution.featurePropertyID.featureID.partID._id,
                partName: eachContribution.featurePropertyID.featureID.partID.name,
                featureID: eachContribution.featurePropertyID.featureID._id,
                featureName: eachContribution.featurePropertyID.featureID.name,
                featurePropertyID: eachContribution.featurePropertyID._id,
                featurePropertyName: eachContribution.featurePropertyID.value,
                postID: eachContribution.postID,
                createdAt: eachContribution.createdAt
            })));

        }
    },
    Mutation: {
        signup: authMutationResolvers.signup,
        forgetPassword: authMutationResolvers.forgetPassword,
        
        createPost: postMutationResolvers.createPost,
        deletePost: postMutationResolvers.deletePost,
        postComment: postMutationResolvers.postComment,
        addPlantPart: postMutationResolvers.addPlantPart,
        addPartFeature: postMutationResolvers.addPartFeature,
        addFeatureProperty: postMutationResolvers.addFeatureProperty,
        addContribution: postMutationResolvers.addContribution,
        deleteComment: postMutationResolvers.deleteComment,
        updateInfo: postMutationResolvers.updateInfo,
        updateVote: postMutationResolvers.updateVote,

        ModverifyPendingPart: async (_, { partID }, context) => {
            await protectMod(context);

            const grabPartDetail = await plantParts.findOne({
                _id: partID
            });
            if (!grabPartDetail) {
                throw new APIError({
                    code: 400,
                    message: "Part Does Not Exists !!"
                })
            }

            if (!grabPartDetail.isPending) {
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
        ModverifyPendingFeature: async (_, { featureID }, context) => {
            await protectMod(context);

            const grabFeatureData = await partsFeatures.findOne({
                _id: featureID
            })

            if (!grabFeatureData) {
                throw new APIError({
                    code: 400,
                    message: "Feature Does Not Exists !!"
                })
            }
            if (!grabFeatureData.isPending) {
                throw new APIError({
                    code: 400,
                    message: "Feature Already Approved !!"
                })
            }
            grabFeatureData.isPending = false
            grabFeatureData.contributedBy = context.userID
            await grabFeatureData.save();
            return grabFeatureData._id
        },
        ModverifyPendingProperty: async (_, { featurePropertyID }, context) => {
            await protectMod(context);

            const grabPropertyData = await featureProperty.findOne({
                _id: featurePropertyID
            });

            if (!grabPropertyData) {
                throw new APIError({
                    code: 400,
                    message: "Feature Property Does Not Exists !!"
                })
            }
            if (!grabPropertyData.isPending) {
                throw new APIError({
                    code: 400,
                    message: "Feature Property Already Approved !!"
                })
            }

            grabPropertyData.isPending = false;
            grabPropertyData.contributedBy = context.userID
            await grabPropertyData.save();
            return grabPropertyData._id
        },
        ModverifyPendingContribution: async (_, { contributionID }, context) => {
            await protectMod(context);
            const grabContribution = await contributionModel.findOne({
                _id: contributionID
            })

            if (!grabContribution) {
                throw new APIError({
                    code: 400,
                    message: "Contribution Does Not Exists !!"
                })
            }

            if (!grabContribution.isPending) {
                throw new APIError({
                    code: 400,
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


const preFunction = ({ req }) => {
    if (req.headers.hasOwnProperty('token')) {
        const decodedData = verifyToken(req.headers.token)
        if (decodedData.hasOwnProperty("Error")) {
            throw new GraphQLError("Wrong Token Dude", {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                }
            })
        }

        return {
            userID: decodedData.userID,
            userType: decodedData.userType
        }
    }
    return {}
}
export { graphqlSchema, graphqlResolver, preFunction, setRedisClient }
