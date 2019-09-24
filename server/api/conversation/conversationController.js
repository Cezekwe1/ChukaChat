var Conversation = require('./conversationModel')
var _ = require('lodash')

exports.param = function(req,res,next,id){
    Conversation.findById(id)
        .then(function(conversation){
            if(!conversation){
                next(new Error('No conversation like this'))
            }else{
                req.conversation = conversation
                next()
            }
        },function(err){
            next(err)
        })
}

exports.getOne = function(req,res){
    var conversation = req.conversation.populate().exec()
    res.json(conversation)
}

exports.delete = function(req,res){
    var deleted = req.conversation
    deleted.delete()
    res.json(deleted )
}