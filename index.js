const express = require('express');
const express_graphql = require('express-graphql');
const UserController = require('./UserController');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.connect('mongodb://localhost:27017/userdata', {}).then(null, (error) => {
    throw error;
});
const UserControllerInstance = new UserController();
const root = {
    login: async (userInfo) => {
        const user = await UserControllerInstance.login(userInfo);
        return user
    },
    register: async (userInfo) => {
        let user = await UserControllerInstance.register(userInfo);
        return user;
    },
    getCurrentUser: async (tokenInfo) => {
        let user = await UserControllerInstance.getCurrentUser(tokenInfo);
        return user;
    },
    getUserById: async (userInfo) => {
        let user = await UserControllerInstance.getUserById(userInfo);
        return user;
    },
    getAllUser: async () => {
        let users = await UserControllerInstance.getAllUser();
        return users;
    }
};
// Create an express server and a GraphQL endpoint
const app = express();
app.use(cors());
app.use('/graphql', express_graphql({
    schema: require('./UserSchema'),
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));