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

InviteSchema.post('save', function(doc){
    
    if (this.accepted){
        doc.populate('inviter').populate('target').execPopulate(function(err,invite){
            if (invite.inviter){
                invite.inviter.friends.push(invite.target._id)
                invite.inviter.save()
            }
            
            if(invite.target){
                invite.target.friends.push(invite.inviter._id)
                invite.target.save()
            }

            console.log("we are done blood")
            invite.remove()
        })
        
        
    }else if (this.accepted == false){
        this.remove()
    }
})

module.exports = mongoose.model('invite', InviteSchema)

