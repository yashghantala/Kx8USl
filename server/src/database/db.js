const env = require('dotenv').config()
const mysql = require('mysql2')

// create the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})

connection.on('connect', function (e) {
    console.log('connected' + "  " + Date.now());
})

module.exports = connection