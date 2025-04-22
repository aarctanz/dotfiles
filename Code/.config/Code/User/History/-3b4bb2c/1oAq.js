import mongoose from 'mongoose'
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { graphqlResolver, graphqlSchema, preFunction, setRedisClient } from './graphql/main.js';
import { createClient } from 'redis';


const server = new ApolloServer({
    typeDefs: graphqlSchema,
    resolvers: graphqlResolver,
    formatError: (err) => {
        console.log(err)
        return {
            code: typeof err.extensions.code == 'number' ? err.extensions.code : 500,
            message: typeof err.extensions.code == 'number' ? err.message : "Server Error"
        }
    },
});


mongoose.connect('mongodb://127.0.0.1:27017/eflora').then(() => {
    console.log("Database Connected");
    // Setting Redis :)
    createClient()
        .on('error', err => console.log('Redis Client Error', err))
        .connect().then(redisClient => {

            setRedisClient(redisClient);
            startStandaloneServer(server, {
                context: preFunction
            }).then((serverObj) => {
                console.log(serverObj.url);
            }).catch(err => {
                // Logger Attach For Logs !!!
                console.log("Error While Starting Server", err);
            })
        })

}).catch((err) => {
    console.log("Error While Starting Database", err);
})
