var Invite = require('./inviteModel')
var _ = require('lodash')
exports.param = function(req,res,next,id){
    Invite.findById(id)
        .then(function(invite){
            if (!invite){
                next(new Error("this invite doesnt exist"))
            }
            req.invite = invite
            next()
        })
        .catch(function(err){
            next(err)
        })
}

exports.get = function(req,res,next){
    Invite.find({target: req.user._id})
        .populate('inviter', '_id username')
        .exec()
        .then(function(invites){
            res.json(invites)
        })
        .catch(function(err){
            next(err)
        })
} 

exports.getOne = function(req,res){
    res.json(req.invite)
}

exports.post = function(req,res,next){
    _.merge(req.body, {inviter: req.user._id})
    var newInvite = new Invite(req.body)
    newInvite.save(function(err,invite){
        if (err){return next(err)}
        res.json(invite)
    })
} 

exports.put = function(req,res,next){
    var oldInvite = req.invite
    _.merge(oldInvite,req.body)
    oldInvite.save(function(err,updatedInvite){
                if(err){next(err)}
                res.json(updatedInvite)
            })
} 

exports.delete = function(req,res,next){
    req.invite.remove(function(err,del_invite){
        if (err){next(err)}
        res.json(del_invite)
    })
}

exports.error = function(err,req,res,next){
    if(err.message == "not unique invite"){
        return res.send()
    }
    
    next(err)
}