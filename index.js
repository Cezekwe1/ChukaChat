var config = require('./server/config/config')
var app = require('./server/server')
var server = require('http').Server(app)
var config = require('./server/config/config')
var logger = require('./server/util/logger')
var mongoose = require('mongoose')
var io = require('socket.io')(server,{pingInterval: 4000})
var socketEvents = require('./server/socketEvents')

mongoose.connect(config.db.url, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true})
if (config.seed){
    require('./server/util/seed')
}


server.listen(config.port)
logger.log('listening on http://localhost:' + config.port)
socketEvents(io)