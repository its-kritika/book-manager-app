const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')
const passport = require('passport'); // Import the Google Passport configuration
const session = require('express-session');
require('dotenv').config()
require('./middleware/google-auth')

const publicDirectoryName = path.join(__dirname, 'book-manager-client/build')

mongoose.connect(process.env.DATABASE_CONNECTION_STRING)

const app = express()

app.use(express.static(publicDirectoryName))
app.use(cors())

app.use(express.json())

// Session setup
app.use(session({
    secret: process.env.GOOGLE_AUTH_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(userRouter) 
app.use(bookRouter)

app.listen(5000, () => {
    console.log('Server has started functioning!')
})