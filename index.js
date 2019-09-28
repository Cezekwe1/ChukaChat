var config = require('./server/config/config')
var app = require('./server/server')
var server = require('http').Server(app)
var config = require('./server/config/config')
var logger = require('./server/util/logger')
var mongoose = require('mongoose')
var io = require('socket.io').listen(server)
var connections = []
var users = []

mongoose.connect(config.db.url, {useNewUrlParser: true, useUnifiedTopology: true})
if (config.seed){
    require('./server/util/seed')
}


server.listen(config.port)
logger.log('listening on http://localhost:' + config.port)
