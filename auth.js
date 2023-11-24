const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./Schemas/User.js")
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/google/callback",
  passReqToCallback:true
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