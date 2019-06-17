const {GraphQLInt, GraphQLObjectType, GraphQLString} = require("graphql");
const {GraphQLSchema} = require("graphql/type/schema");
const graphql = require('graphql');
const _ = require('lodash');

const users = [
    {
        id: '23', firstName: 'Bill', age: 20
    },
    {
        id: '47', firstName: 'Samantha', age: 21
    }
];

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
                return _.find(users, {id: args.id});
            }
        }
   }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});