
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
}

const postMutationResolvers = {

}

export {postMutationResolvers, postQueryResolvers}