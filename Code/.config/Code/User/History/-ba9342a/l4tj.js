import { GraphQLScalarType } from 'graphql';
import { Types, isValidObjectId } from 'mongoose';
import { APIError } from '../utils/errorHandler.js';


const mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// GraphQLScalarType is a class that is used to define a new scalar type in GraphQL
// parseValue is used to parse the value that is passed from the client to the server
// serialize is used to parse the value that is passed from the server to the client
// in this case, we are converting the date to a string and vice versa
// we are using the toISOString() method to convert the date to a string
// we are using the new Date() method to convert the string to a date
// we are using the name property to set the name of the scalar type
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