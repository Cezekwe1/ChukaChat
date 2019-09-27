var Conversation = require('./conversationModel')
var _ = require('lodash')

exports.param = function(req,res,next,id){
    Conversation.findById(id)
        .populate('starter', '_id username conversations')
        .populate('target', '_id username conversations')
        .exec()
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

exports.post = function(req,res,next){
    var convo = new Conversation(req.body)
    convo.save(function(err,doc){
        if (err){next(err)}
        res.json(doc)
    })
}

exports.getOne = function(req,res){
    var conversation = req.conversation
    console.log(conversation)
    res.json(conversation)
}

exports.delete = function(req,res){
    var deleted = req.conversation
    deleted.delete()
    res.json(deleted )
}