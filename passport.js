const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./Schemas/User.js")
const Note = require('./Schemas/Note.js')
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ["profile"]
},
async function(request, accessToken, refreshToken, profile, done) {

    done(null,profile);
  
    const userInfo = await User.find({
        googleId: profile.id
    })

    if(userInfo.length==0){
        await User.insertMany(
            {
                googleId: profile.id,
                name:profile.displayName,
                lastLogin: Math.floor(Date.now() / 1000)
            }
        )
        await Note.insertMany(
            {
                googleId: profile.id,
                notes: [
                    {
                        title:"How to use my notes",
                        text:"You can add notes from the new note section",
                        lastUpdate: Math.floor(Date.now() / 1000)
                    }
                ]
            }
        )
    }else{
        await User.updateOne(
            {
                googleId: profile.id
            },
            {
                lastLogin: Math.floor(Date.now() / 1000)
            }
        )
    }
  
}
  
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});