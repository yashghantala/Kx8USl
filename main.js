const env = require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const path = require('path');
const discussionRoutes = require('./src/routes/discussion') //Route Import

// Public Static Resources
app.use('/public', express.static(path.join(__dirname + '/public')))

// Discussion app Routes
app.use(discussionRoutes)

app.listen(port, () => {
    console.log(`Discussion Server Started on Port ${port}`)
})