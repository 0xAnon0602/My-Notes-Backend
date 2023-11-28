const router = require("express").Router();
const passport = require("passport");
const Note = require("../Schemas/Note.js")
const updateLog = require('../Utils/updateLog.js')
require('dotenv').config()


router.get("/notes", async(req, res) => {
	if (req.user) {

        const findQuery = {
            googleId: req.user._json.sub
        }

        const allNotes = await Note.findOne(findQuery)
        await updateLog(req.user._json.sub,'findOne','Notes',[findQuery])

		res.status(200).json({
			error: false,
			info: allNotes
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});


router.post("/addNote", async(req, res) => {
	if (req.user) {

        const addNoteQuery = [
            {googleId: req.user._json.sub},
            {
                $push: {
                  notes: {
                    title: req.body.title,
                    text: req.body.text,
                    category:req.body.category,
                    lastUpdate: Math.floor(Date.now() / 1000)
                  },
                },
            }]

        if(req.body.category != ''){
            const addCateogryQuery = [
                { googleId: req.user._json.sub, categories: { $ne: req.body.category } }, 
                { $addToSet: { categories: req.body.category } } 
            ]
            await Note.updateOne(addCateogryQuery[0],addCateogryQuery[1])
        }

       await Note.findOneAndUpdate(addNoteQuery[0],addNoteQuery[1])
       await updateLog(req.user._json.sub,'findOneAndUpdate','Notes',addNoteQuery)
       await updateLog(req.user._json.sub,'updateOne','Notes',addCateogryQuery)

		res.status(200).json({
			error: false,
			message: "Sucess"
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});


router.post("/updateNote", async(req, res) => {
	if (req.user) {

       const { noteId, newTitle, newText } = req.body;

       const updateNoteQuery =[
        { "notes._id": noteId },
        { $set: { "notes.$.title": newTitle, "notes.$.text": newText, "notes.$.lastUpdate":Math.floor(Date.now() / 1000) } }
       ]

       await Note.findOneAndUpdate(updateNoteQuery[0],updateNoteQuery[1])
       await updateLog(req.user._json.sub,'findOneAndUpdate','Notes',updateNoteQuery)
    

		res.status(200).json({
			error: false,
			message: "Sucess"
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});


router.post("/deleteNote", async(req, res) => {
	if (req.user) {

        const deleteNoteQuery = [
            {googleId: req.user._json.sub},
            { $pull: { notes: { _id: req.body.noteId } } }
        ]

       await Note.findOneAndUpdate(deleteNoteQuery[0],deleteNoteQuery[1])
       await updateLog(req.user._json.sub,'findOneAndUpdate','Notes',deleteNoteQuery)

		res.status(200).json({
			error: false,
			message: "Sucess"
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});


module.exports = router;
