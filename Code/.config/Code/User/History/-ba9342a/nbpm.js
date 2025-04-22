
const dateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
        return new Date(value);
    },
    serialize(value) {
        return value.toISOString();
    },
})

const nonEmptyStringScalar = new GraphQLScalarType({
    name: 'nonEmptyString',
    parseValue(value) {
        if (typeof value !== 'string' || value === '') {
            throw new APIError({
                code: 401,
                message: "Please Provide Valid String !!"
            })
        }
        return value
    },
    serialize(value) {
        if (typeof value !== 'string' || value === '') {
            throw new APIError({
                code: 401,
                message: "Please Provide Valid String !!"
            })
        }
        return value
    },
})
const mailScaler = new GraphQLScalarType({
    name: 'Email',
    parseValue(value) {
        if (typeof value !== 'string' || value === '' || !mailRegex.test(value)) {
            throw new APIError({
                code: 401,
                message: "Please Provide Valid Email !!"
            })
        }

        return value
    },
    serialize(value) {
        if (typeof value !== 'string' || value === '' || !mailRegex.test(value)) {
            throw new APIError({
                code: 401,
                message: "Please Provide Valid Email !!"
            })
        }

        return value
    },
})

const MongoIDScalar = new GraphQLScalarType({
    name: 'MongoID',
    parseValue(value) {
        if (!isValidObjectId(value)) {
            throw new APIError({
                code: 401,
                message: "Please Provide Valid ObjectID !!"
            })
        }
        return new Types.ObjectId(value);
    },
    serialize(value) {
        if (!isValidObjectId(value)) {
            throw new APIError({
                code: 401,
                message: "Please Provide Valid ObjectID !!"
            })
        }
        return value
    },
})

const PlainJSONScalar = new GraphQLScalarType({
    name: `PlainJSON`,

    description: `Bails out of GraphQL conventions and just returns the straight JSON Object.`,

    serialize(_) {
        return _;
    },
});

export { dateScalar, nonEmptyStringScalar, mailScaler, MongoIDScalar, PlainJSONScalar }