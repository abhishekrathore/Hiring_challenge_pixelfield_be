const { buildSchema } = require('graphql');
// GraphQL schema
const userSchema = buildSchema(`
    type Query {
        login(email: String, password: String): User
        getCurrentUser(token: String): User
        getUserById(_id: String): User
        getAllUser(_id: String): [User]
        register(email: String, password: String, name: String): User
    }
    type User {
        _id: String
        email: String
        password: String
        token: String
        name: String
    }
`);

module.exports = userSchema;