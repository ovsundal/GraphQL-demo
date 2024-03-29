const axios = require("axios");
const {GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull} = require("graphql");
const {GraphQLSchema} = require("graphql/type/schema");
const graphql = require('graphql');

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({    // closure scope UserType to prevent circular dependency between company and user
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then((res) => res.data)
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then((res) => res.data)
            }
        }
    })
});

// allow graphql to jump and land on a specific datanode
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
        },
       company: {
           type: CompanyType,
           args: {id: {type: GraphQLString}},
           resolve(parentValue, args) {
               return axios.get(`http://localhost:3000/companies/${args.id}`)
                   .then(resp => resp.data);
           }
       }
   }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, {firstName, age}) {
                return axios.post('http://localhost:3000/users', {firstName, age})
                    .then((res) => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});