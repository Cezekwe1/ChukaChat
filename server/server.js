var express = require('express')
var app = express()
var api = require('./api') 
var auth = require('../server/auth/routes')
var path = require('path')
require('./middleware/appMiddleware')(app)

app.use(express.static(path.join(__dirname,'..','frontend')))
app.use('/api/',api)
app.use('/auth/',auth)
app.use(function(err,req,res,next){
    res.status(500).json({"error": err.message})
})

module.exports = app;

