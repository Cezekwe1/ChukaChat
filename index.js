var config = require('./server/config/config')
var app = require('./server/server')
var config = require('./server/config/config')
var logger = require('./server/util/logger')
var mongoose = require('mongoose')

mongoose.connect(config.db.url, { useNewUrlParser: true, useUnifiedTopology: true})
if (config.seed){
    require('./server/util/seed')
}
app.listen(config.port)
logger.log('listening on http://localhost:' + config.port)
