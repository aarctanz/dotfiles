const modQueryResolvers = {

}

const modMutationResolvers = {
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
}

export {modMutationResolvers, modQueryResolvers}