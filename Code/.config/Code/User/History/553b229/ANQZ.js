const queryResolvers = {
    
}

const mutationResolvers = {
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