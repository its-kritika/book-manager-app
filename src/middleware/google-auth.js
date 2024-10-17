const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); 
require('dotenv').config();

const url = process.env.BACKEND_URL || 'http://localhost:5000'

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: `${url}/auth/google/callback`, // Redirect URL after Google Auth
},
async (accessToken, refreshToken, profile, done) => {
    // Find or create user in your database
    const user = await User.findOne({ googleId: profile.id });
    if (user) {
        return done(null, user);
        
    } else {
        const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password : process.env.GOOGLE_PASSWORD
        });
        await newUser.save();

        return done(null, newUser);
    }
}));

// Serialize and deserialize user to support session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
