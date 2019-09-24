var mongoose = require('mongoose')
var Schema = mongoose.Schema

const MessageSchema = Schema({
    sender = {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver = {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text = {
        type: String,
        required: true
    }
})

module.exports = mongoose.Model('message', MessageSchema)
