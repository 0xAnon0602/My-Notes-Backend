const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    googleId:String,
    notesCount:Number,
    notes:[
        {
            title:String,
            text:String,
            lastUpdate:String
        }
    ]
    },
    { collection: 'Notes', versionKey: false }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;