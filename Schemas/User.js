const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId:String,
    name: String,
    lastLogin: String
    },
    { collection: 'Users', versionKey: false }
);

const User = mongoose.model('User', userSchema);

module.exports = User;