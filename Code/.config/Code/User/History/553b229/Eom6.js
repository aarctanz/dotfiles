

const authQueryResolvers = {
    login: async (_, { details }, context) => {

        let searchQuery;
        if (details == undefined) {
            if (context.userID == undefined) {
                throw new APIError({
                    code: 401,
                    message: "Please Provide Either Login Details Or Valid Token !!"
                })
            }
            searchQuery = { _id: context.userID }
        } else {

            searchQuery = { email: details["usermail"] }
        }



        const userDetails = await accountModel.findOne(searchQuery).lean();
        if (userDetails == null) {
            // User does not exists !!
            throw new APIError({
                code: 404,
                message: "User Does Not Exists"
            })
        }



        const loginAttempt = Number(await redisClient.get(`LoginAttempt::${userDetails.email}`));
        if (details != undefined) {
            if (loginAttempt >= 3) {
                throw new APIError({
                    code: 403,
                    message: "Max Login Attempt Crossed !! Please Try After 30 Minutes"
                })
            }

            if (userDetails.password != details.password) {
                await redisClient.set(`LoginAttempt::${userDetails.email}`, `${loginAttempt + 1}`, { EX: 60 * 30 })
                throw new APIError({
                    code: 403,
                    message: "Please Enter Correct Password !!"
                })
            }
        }

        await redisClient.del(`LoginAttempt::${userDetails.email}`);
        return {
            token: createToken({
                userID: userDetails._id,
                userType: userDetails.accountType
            }),
            name: userDetails.name,
            email: userDetails.email,
            currentRating: userDetails.currentRating,
            accountType: userDetails.accountType
        }
    },
    sendOTP: async (_, { details }) => {

        const { emailID, isNew } = details;
        const userDetails = await accountModel.findOne({ email: emailID }).lean();
        if (!isNew && userDetails == null) {
            throw new APIError({
                code: 404,
                message: "User Does Not Exists"
            })
        }
        console.log(isNew, userDetails)
        if (isNew && userDetails != null) {
            throw new APIError({
                code: 404,
                message: "User Already Exists !!"
            })
        }


        let otpInfo = JSON.parse(await redisClient.get(`OTPRequest::${emailID}`));
        if (otpInfo != null) {
            if (otpInfo.attempt > 3) {
                throw new APIError({
                    code: 401,
                    message: "You Have Exceeded Limit, Please Try After 30 Minutes"
                })
            }
            otpInfo.attempt += 1
            otpInfo.otp = generateOTP();
        } else {
            otpInfo = {
                "otp": generateOTP(),
                "attempt": 1

            }
        }
        await redisClient.set(`OTPRequest::${emailID}`, JSON.stringify(otpInfo), { EX: 60 * 30 });
        await sendMail(emailID, isNew ? "Welcome User !!" : "Forget Passowrd !!", `Your OTP is :- ${otpInfo.otp} !!!`);
        return true

    },
}

const authMutationResolvers = {
    signup: async (_, { details }) => {
        const isExists = await accountModel.exists({ email: details.email });
        if (isExists) {
            // User already exists !!
            throw new APIError({
                code: 400,
                message: "User Already Exists !!"
            })
        }



        const totalAttempt = Number(await redisClient.get(`OTPAttempt::${details.email}`));
        const otpInfo = JSON.parse(await redisClient.get(`OTPRequest::${details.email}`));

        if (otpInfo == null) {
            throw new APIError({
                code: 404,
                message: "Please Request For New OTP First !!"
            })
        }

        if (totalAttempt >= 3) {
            throw new APIError({
                code: 404,
                message: "You Have Exhausted Attempt Request, Try After 30 Minutes !!"
            })
        }

        if (otpInfo.otp != details.otp) {
            await redisClient.set(`OTPAttempt::${details.email}`, totalAttempt + 1, { "EX": 60 * 30 });
            throw new APIError({
                code: 404,
                message: "You Have Entered Wrong OTP !! Please Try Again !!"
            })
        }
        await redisClient.del(`OTPAttempt::${details.email}`);
        await redisClient.del(`OTPRequest::${details.email}`);
        const user = new accountModel({
            name: details.name,
            email: details.email,
            password: details.password
        })

        await user.save()
        return {
            token: createToken({
                userID: user._id,
                userType: 2
            }),
            name: user.name,
            email: user.email,
            currentRating: user.currentRating,
            accountType: user.accountType
        }

    },
    forgetPassword: async (_, { details }) => {
        const { otp, emailID, newPassword } = details;


        const totalAttempt = Number(await redisClient.get(`OTPAttempt::${emailID}`));
        const otpInfo = JSON.parse(await redisClient.get(`OTPRequest::${emailID}`));

        if (otpInfo == null) {
            throw new APIError({
                code: 404,
                message: "Please Request For New OTP First !!"
            })
        }

        if (totalAttempt >= 3) {
            throw new APIError({
                code: 404,
                message: "You Have Exhausted Attempt Request, Try After 30 Minutes !!"
            })
        }

        if (otp == otpInfo.otp) {
            await accountModel.updateOne({ email: emailID }, { password: newPassword });

            await redisClient.del(`OTPAttempt::${emailID}`);
            await redisClient.del(`OTPRequest::${emailID}`);
            await redisClient.del(`LoginAttempt::${emailID}`);

            return "Password Has Been Changed Successfully !!"
        }

        await redisClient.set(`OTPAttempt::${emailID}`, totalAttempt + 1, { "EX": 60 * 30 });
        throw new APIError({
            code: 404,
            message: "You Have Entered Wrong OTP !! Please Try Again !!"
        })

    },
}

export { queryResolvers, mutationResolvers }