const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose')
require('./auth');

const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

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

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }
));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/google/failure'}),
  function(req, res) {
    res.redirect('/protected');
  });

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(8080, () => console.log('listening on port: 8080'));