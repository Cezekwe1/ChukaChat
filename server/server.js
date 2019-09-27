var express = require('express')
var app = express()
var api = require('./api') 
var auth = require('../server/auth/routes')
require('./middleware/appMiddleware')(app)
app.use('/api/',api)
app.use('/auth/',auth)
app.use(function(err,req,res,next){
    res.status(500).json({"error": err.message})
})
module.exports = app;

