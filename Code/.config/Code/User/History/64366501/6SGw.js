
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

}

export {postMutationResolvers, postQueryResolvers}