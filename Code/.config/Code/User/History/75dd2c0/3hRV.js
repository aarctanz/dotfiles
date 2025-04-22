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

export { protectMe, protectMod}