const router = require("express").Router();
const passport = require("passport");
const Note = require("../Schemas/Note.js")
require('dotenv').config()


router.get("/notes", async(req, res) => {
	if (req.user) {

        const allNotes = await Note.findOne({
            googleId: req.user._json.sub
        })

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

       await Note.findOneAndUpdate(
            {
            googleId: req.user._json.sub
            },
            {
                $push: {
                  notes: {
                    title: req.body.title,
                    text: req.body.text,
                    lastUpdate: Math.floor(Date.now() / 1000)
                  },
                },
            },
        )

		res.status(200).json({
			error: false,
			message: "Sucess"
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});




module.exports = router;
