const router = require("express").Router();
const passport = require("passport");
require('dotenv').config()

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user._json,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/google", passport.authenticate("google", ["profile"]));

router.get("/google/callback",passport.authenticate("google", {
	successRedirect: process.env.CLIENT_URL,
	failureRedirect: "/login/failed",
}));

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});


module.exports = router;