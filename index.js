const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose')
const cors = require('cors'); 
const authRoute = require('./Routes/auth');
const userRoute = require('./Routes/user')
require('./passport');
require('dotenv').config()

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
  
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
console.log("Connected to MongoDB");
});

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true , cookie : { secure:false }}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/user", userRoute);


app.listen(8080, () => console.log('listening on port: 8080'));