const axios = require("axios");
const {GraphQLInt, GraphQLObjectType, GraphQLString} = require("graphql");
const {GraphQLSchema} = require("graphql/type/schema");
const graphql = require('graphql');



const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt}
    }
});
// allow graphql to jump and land on a very specific datanode
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data);
            }
        }
   }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});