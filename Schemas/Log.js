const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    googleId:String,
    operation:String,
    collection: String,
    query:[Object],
    timestamp: String
    },
    { collection: 'Logs', versionKey: false }
);

const Log = mongoose.model('Log', logSchema);

module.exports = Log;