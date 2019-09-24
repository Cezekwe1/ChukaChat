var _ = require('lodash')

var config = {
    dev: 'development',
    test: 'testing',
    prod: 'production',
    port: process.env.PORT || 3000
}

process.env.NODE_ENV = process.env.NODE_ENV || config.dev
config.env = process.env.NODE_ENV

var envconfig

try{
    envconfig = require('./' + config.env)  
    envconfig = envconfig || {}
}catch{
    envconfig = {}
}

module.exports = _.merge(config,envconfig)
