var mongoose = require('mongoose')
var User = require('../user/userModel')
var Schema = mongoose.Schema

const InviteSchema = Schema({
    inviter : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    target : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    accepted : {
        type: Boolean,
        default: null
    }
})

InviteSchema.pre('save',function(next){
    if (JSON.stringify(this.inviter._id) === JSON.stringify(this.target._id)){
        next(new Error("you cant invite yourself"))
    }
   next()
})

InviteSchema.post('save', function(doc){
    
    if (this.accepted){
        doc.populate('inviter').populate('target').execPopulate(function(err,invite){
            if (invite.inviter){
                // invite.inviter.updateOne({_id: invite.inviter._id},{$addToSet:{friends: invite.target._id}})
                //     .then(function(doc){
                        
                //     })
                invite.inviter.friends.push(invite.target._id)
                invite.inviter.save(function(err,dix){
                    if (err){console.log(err)}
                    console.log(dix)
                })

            }
            
            if(invite.target){
                // invite.target.updateOne({_id: invite.target._id},{$addToSet:{friends: invite.inviter._id}})
                //     .then(function(){

                //     })
                invite.target.friends.push(invite.inviter._id)
                invite.target.save(function(err,dix){
                    if (err){console.log(err)}
                    console.log(dix)
                })
                    

                
                

            }
            invite.remove()
        })
        
        
    }else if (this.accepted == false){
        this.remove()
        
    }
    
})

module.exports = mongoose.model('invite', InviteSchema)

