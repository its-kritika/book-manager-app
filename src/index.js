const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')
require('dotenv').config()

const publicDirectoryName = path.join(__dirname, 'book-manager-client/build')

mongoose.connect(process.env.DATABASE_CONNECTION_STRING)

const app = express()

app.use(express.static(publicDirectoryName))
app.use(cors())

app.use(express.json())

app.use(userRouter) 
app.use(bookRouter)

app.listen(5000, () => {
    console.log('Server has started functioning!')
})