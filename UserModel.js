(() => {
    'use strict';
    const mongoose = require('mongoose');
    const bcrypt = require('bcrypt');

    module.exports = () => {
        const user_schema_fileds = {
            email: {
                type: String,
                required: [true, 'Email is Require'],
                unique: true
            },
            password: {
                type: String,
                required: [true, 'Password is Require'],
            },
            
            token: [{
                type: String,
                required: [true, 'Token is Require'],
            }]
        };
        let user_schema = new mongoose.Schema(user_schema_fileds);
        user_schema.methods.generateHash = function (password) {
            var hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            this.password = hashPassword;
            return hashPassword;
        };
        user_schema.methods.validPassword = function (password) {
            return bcrypt.compareSync(password, this.password);
        };
        return mongoose.model('User', user_schema);
    };
})();