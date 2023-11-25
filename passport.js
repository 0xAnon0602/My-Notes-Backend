const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./Schemas/User.js")
const Note = require('./Schemas/Note.js')
const updateLog = require('./Utils/updateLog.js')
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ["profile"]
},
async function(request, accessToken, refreshToken, profile, done) {

    done(null,profile);

    const userFindQuery = {
        googleId: profile.id
    }
  
    const userInfo = await User.find(userFindQuery)
    await updateLog(profile.id,'find','Users', userFindQuery)



    if(userInfo.length==0){

        const userQuery = {
            googleId: profile.id,
            name:profile.displayName,
            lastLogin: Math.floor(Date.now() / 1000)
        }

        const noteQuery = {
            googleId: profile.id,
            categories:['Home'],
            notes: [
                {
                    title:"How to use my notes",
                    text:"You can add notes from the new note section",
                    category:'Home',
                    lastUpdate: Math.floor(Date.now() / 1000)
                }
            ]
        }

        await User.insertMany(userQuery)
        await Note.insertMany(noteQuery)
 
        await updateLog(profile.id,'insertMany','Users', [userQuery])
        await updateLog(profile.id,'insertMany','Notes', [noteQuery])

    }else{

        const userUpdateQuery = [
            {googleId: profile.id},
            {lastLogin: Math.floor(Date.now() / 1000)}
        ]

        await User.updateOne(userUpdateQuery[0],userUpdateQuery[1])
        await updateLog(profile.id,'updateOne','Users', userUpdateQuery)

    }
  
}
  
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});