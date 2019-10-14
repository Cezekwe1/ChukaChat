var model = require('./messageModel')
var Message = require('./messageModel')
var _ = require('lodash')
exports.param = function(req,res,next,id){
    Message.findById(id)
        .then(function(err,message){
            if(err){next(err)}
            if(!message){
                res.status(400).json({error:"No message like this"})
            }else{
                req.message = message
                next()
            }
        })

} 

exports.convoParam = function(req, res,next,id){
    Message.find({conversation:id})
        .then(function(docs){
            req.messages = docs
            next()
        })
        .catch(function(err){next(err)})
}

exports.getAllConvoMessages = function(req,res){
    res.json(req.messages)
}

exports.post = function(req,res,next){
    _.merge(req.body, {sender: req.user._id})
    var newMessage = new Message(req.body)
    newMessage.save(function(err,doc){
        if (err){next(err)}
        res.json(doc)
    })
}

exports.getOne = function(req,res){
    res.send(req.message)
}
exports.delete = function(req,res,next){
    var del_message = req.message
    del_message.remove(function(err,doc){
        if (err){next(err)}
        res.json(doc)
    })
}



