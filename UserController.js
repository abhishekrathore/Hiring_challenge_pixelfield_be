'use strict';
const USER = require('./UserModel')();
const jwt = require('jsonwebtoken');
class UserController {
    constructor() {
    }

    login(userInfo) {
        return new Promise((resolve, reject) => {
            USER.findOne({
                email: userInfo.email
            }, (error, user) => {
                if (error)
                    return reject(error && error.message ? error.message :'Error by database');
                if (!user)
                    return reject('User not found.');
                if (!user.validPassword(userInfo.password)) {
                    return reject('Invalid password');
                }
                user.token.push(jwt.sign({ _id: user._id }, 'jwt_secret'));
                user.save((error, updatedUser)=> {
                    if (error)
                        return reject(error && error.message ? error.message : 'Error by database');
                    updatedUser._doc._id = updatedUser._doc._id.toString();
                    updatedUser._doc.token = updatedUser._doc.token[updatedUser._doc.token.length -1];
                    return resolve(updatedUser._doc);
                });
            });
        });
    }

    register(userInfo) {
        return new Promise((resolve, reject) => {
            USER.findOne({
                email: userInfo.email
            }).exec((error, user)=> {
                if (error)
                    return reject(error && error.message ? error.message : 'Error by database');
                if (user) {
                    return reject('User already exist');
                }
                let newUser = new USER(userInfo);
                newUser.token = [jwt.sign({ _id: newUser._id }, 'jwt_secret')];
                newUser.password = newUser.generateHash(userInfo.password);
                newUser.save((error, user) => {
                    if (error)
                        return reject(error && error.message ? error.message : 'Error by database');
                    user._doc._id = user._doc._id.toString();
                    user._doc.token = user._doc.token[user._doc.token.length - 1];
                    return resolve(user._doc);
                });
            })
            
        });
    }

    getCurrentUser(tokenInfo) {
        return new Promise((resolve, reject) => {
            jwt.verify(tokenInfo.token, 'jwt_secret', (error, decoded) => {
                if (error)
                    return reject(error && error.message ? error.message : 'Error by database');
                USER.findById(decoded._id).exec((error, user)=> {
                    if (error)
                        return reject(error && error.message ? error.message : 'Error by database');
                    if (user) {
                        user._doc._id = user._doc._id.toString();
                        user._doc.token = user._doc.token[user._doc.token.length - 1];
                        return resolve(user._doc);
                    }
                    return reject('No user found');
                })
            });
        });
    }

    getUserById(flterObject = {}) {
        return new Promise((resolve, reject) => {
            USER.findById(flterObject._id).exec((error, user) => {
                if (error)
                    return reject(error && error.message ? error.message : 'Error by database');
                if (user) {
                    user._doc._id = user._doc._id.toString();
                    user._doc.token = user._doc.token[user._doc.token.length - 1];
                    return resolve(user._doc);
                }
                return reject('No user found');
            })
        });
    }


    getAllUser() {
        return new Promise((resolve, reject) => {
            USER.find({}).exec((error, users) => {
                if (error)
                    return reject(error && error.message ? error.message : 'Error by database');
                if (users && users.length) {
                    users.forEach((user)=> {
                        user._doc._id = user._doc._id.toString();
                        user._doc.token = user._doc.token[user._doc.token.length - 1];
                    })
                    return resolve(users);
                }
                return reject('No user found');
            })
        });
    }

}
module.exports = UserController;