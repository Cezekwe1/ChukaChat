var express = require('express')
var app = express()
var api = require('./api') 
var auth = require('../server/auth/routes')
require('./middleware/appMiddleware')(app)
app.use('/api/',api)
app.use('/auth/',auth)
module.exports = app;

