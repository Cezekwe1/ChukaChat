var mongoose = require('mongoose')
var Schema = mongoose.Schema

const MessageSchema = Schema({
    sender : {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver : {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text : {
        type: String,
        required: true
    },

    conversation:{
        type: Schema.Types.ObjectId,
        ref: 'conversation',
        required: true
    }
})

module.exports = mongoose.model('message', MessageSchema)
