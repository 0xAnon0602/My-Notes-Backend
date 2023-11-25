const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    googleId:String,
    categories:[String],
    notes:[
        {
            title:String,
            text:String,
            category:String,
            lastUpdate:String
        }
    ]
    },
    { collection: 'Notes', versionKey: false }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;