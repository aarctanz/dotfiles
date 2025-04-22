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
import { modQueryResolvers, modMutationResolvers } from "./resolvers/modResolvers.js";



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

        ModgetPendingParts: modQueryResolvers.ModgetPendingParts,
        ModgetPendingPartsFeature: modQueryResolvers.ModgetPendingFeature,
        ModgetPendingFeatureProperty: modQueryResolvers.ModgetPendingFeatureProperty,
        ModgetPendingContribution: modQueryResolvers.ModgetPendingContribution,
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

        ModverifyPendingPart: modMutationResolvers.ModverifyPendingPart,
        ModverifyPendingFeature: modMutationResolvers.ModverifyPendingFeature,
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
