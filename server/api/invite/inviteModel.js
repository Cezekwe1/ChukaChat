var mongoose = require('mongoose')
var Schema = mongoose.Schema

const InviteSchema = Schema({
    inviter = {
        type: mongoose.Schema.types.ObjectId,
        ref: 'user',
        required: true
    },
    target = {
        type: mongoose.Schema.types.ObjectId,
        ref: 'user',
        required: true
    },
    accepted = {
        type: Boolean,
        default: null
    }
})

module.exports = mongoose.Model('invite', InviteSchema)

