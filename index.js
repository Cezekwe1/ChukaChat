var config = require('./server/config/config')
var app = require('./server/server')
var config = require('./server/config/config')
var logger = require('./server/util/logger')


app.listen(config.port)
logger.log('listening on http://localhost:' + config.port)
