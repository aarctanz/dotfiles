import {
    dateScalar,
    nonEmptyStringScalar,
    mailScaler,
    MongoIDScalar,
    PlainJSONScalar,
  } from "./scaler.js";

export const graphqlSchema = `#graphql
    scalar Date
    scalar nonEmptyString
    scalar Email
    scalar MongoID
    scalar PlainJSON
    enum voteAction {
        upvote
        downvote
        reset
    }
    input signupDetails{
        name : nonEmptyString!
        email: Email!
        password: nonEmptyString!
        otp : Int!
    }
    input updateDetails {
        name : nonEmptyString
        password: nonEmptyString
    }
    input searchQuery{
        showMyPosts : Boolean
        searchText : nonEmptyString
    }
    input userLogin {
        usermail : Email!
        password : nonEmptyString!
    }

    input PostCreateRequest {
        images : [nonEmptyString!]!
        description: nonEmptyString!
    }

    input PostCommentRequest{
        postID: MongoID!
        commentText : nonEmptyString!
        repliedTo: MongoID
    }
    input getComment {
        postID: MongoID!
        commentID: MongoID
    }

    input getCommentV1Input {
        postID: MongoID!
        commentID: MongoID
        depthLevel : Int
    }

    input AddPartFeatureRequest{
        partID: MongoID!
        featureName: nonEmptyString!
    }
    input AddFeaturePropertyRequest {
        featureID : MongoID!
        value: nonEmptyString!
    }
    input AddContributionRequest{
        postID : MongoID!
        featurePropertyID : MongoID!
    }
    input GetFeaturePropertyRequest{
        searchText : nonEmptyString!
        featureID : MongoID!
    }
    input GetContributionRequest {
        showMyContribution : Boolean!
        postID : MongoID!
    }

    input forgetPasswordDetail {
        otp : Int!
        newPassword: nonEmptyString!
        emailID : nonEmptyString!
    }

    input sendOTPDetail {
        emailID : nonEmptyString!
        isNew : Boolean!
    }
    input updateVoteDetail {
        commentID : MongoID!
        action : voteAction!
    }
    input ModgetPendingPartsFeatureRequest {
        userID : MongoID
        partID : MongoID
    }
    input ModgetPendingFeaturePropertyRequest {
        userID : MongoID
        partID : MongoID
        featureID : MongoID
    }
    input ModgetPendingContributionRequest {
        userID : MongoID
        postID : MongoID
        featurePropertyID : MongoID
    }
    type getPostsResponse {
        postID : MongoID!
        description : nonEmptyString!
        imagesLink : [nonEmptyString!]!
        postedBy : nonEmptyString!
        createdAt : Date!
    }
    type tokenOutput {
        token: nonEmptyString,
        currentRating : Int
        name : nonEmptyString
        email : nonEmptyString
        accountType: Int
    }
    type commentInfoResponse {
        commentID : MongoID!
        postedBy : nonEmptyString!
        repliedTo: MongoID
        commentText: nonEmptyString!

        upvotes : Int!
        downvotes: Int!
        userAction: voteAction!

    }

    type getCommentV1Response {

        commentID : MongoID!
        postedBy : nonEmptyString!
        repliedTo: MongoID
        commentText: nonEmptyString!

        upvotes : Int!
        downvotes: Int!
        userAction: voteAction!

        childrenComments : [getCommentV1Response!]!
    }
    type plantPartResponse {
        name : nonEmptyString!
        isPending: Boolean!
        partID : MongoID!
    }
    type partFeaturesResponse {
        partID : MongoID!
        featureID : MongoID!
        name : nonEmptyString!
        isPending: Boolean!
    }
    type featurePropertyResponse{
        featurePropertyID : MongoID!
        value : nonEmptyString!
    }
    type contributionDetailResponse {
        contributionID : MongoID!
        partName : nonEmptyString!
        FeatureName : nonEmptyString!
        FeaturePropertyName : nonEmptyString!
    }
    type ModgetPendingPartsResponse{
        partID : MongoID!
        partName : nonEmptyString!
        userID :MongoID!
        userName: nonEmptyString!
        createdAt: Date!
    }

    type ModgetPendingPartsFeatureResponse{
        partID : MongoID!
        partName : nonEmptyString!
        userID :MongoID!
        featureID : MongoID!
        featureName: nonEmptyString!
        propertyName : nonEmptyString!
        userName: nonEmptyString!
        createdAt: Date!
    }
    type ModgetPendingContributionResponse {
        userID :MongoID!
        userName: nonEmptyString!
        partID : MongoID!
        partName : nonEmptyString!
        featureID : MongoID!
        featureName: nonEmptyString!
        featurePropertyID: MongoID!
        featurePropertyName: nonEmptyString!
        postID : MongoID!
        createdAt: Date!
    }
    type Query {
        login(details : userLogin): tokenOutput
        sendOTP(details : sendOTPDetail!): Boolean!
        getPosts(details : searchQuery): [getPostsResponse!]!
        getComments(details: getComment!): [commentInfoResponse!]!
        getCommentsV1(details: getCommentV1Input) : PlainJSON!
        getPlantParts: [plantPartResponse!]!
        getPartsFeature(partID : MongoID!): [partFeaturesResponse!]!
        getFeatureProperty(details : GetFeaturePropertyRequest): [featurePropertyResponse!]!
        getContribution(details : GetContributionRequest!): [contributionDetailResponse!]!



        ModgetPendingParts(userID : MongoID): [ModgetPendingPartsResponse!]!
        ModgetPendingPartsFeature(details : ModgetPendingPartsFeatureRequest): [ModgetPendingPartsFeatureResponse!]!
        ModgetPendingFeatureProperty(details : ModgetPendingFeaturePropertyRequest): [ModgetPendingPartsFeatureResponse!]!
        ModgetPendingContribution(details: ModgetPendingContributionRequest):  [ModgetPendingContributionResponse!]!
    }
    type Mutation {
        signup(details : signupDetails!): tokenOutput
        forgetPassword(details: forgetPasswordDetail!): nonEmptyString!
        createPost(details : PostCreateRequest!): MongoID!
        deletePost(postID : MongoID!): MongoID!
        postComment(details : PostCommentRequest!): MongoID!
        addPlantPart(partName: nonEmptyString!): MongoID!
        addPartFeature(details : AddPartFeatureRequest!): MongoID!
        addContribution(details : AddContributionRequest!): MongoID!
        deleteComment(commentID : MongoID!): MongoID!
        addFeatureProperty(details : AddFeaturePropertyRequest): MongoID!
        updateInfo(details : updateDetails!) : nonEmptyString!
        updateVote(details : updateVoteDetail!): nonEmptyString!

        ModverifyPendingPart(partID : MongoID!): MongoID!
        ModverifyPendingFeature(featureID : MongoID!): MongoID!
        ModverifyPendingProperty(featurePropertyID: MongoID!): MongoID!
        ModverifyPendingContribution(contributionID : MongoID!): MongoID!



    }
`;
