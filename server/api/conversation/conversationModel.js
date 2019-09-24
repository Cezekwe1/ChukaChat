var mongoose = require('mongoose')
var Schema = mongoose.Schema

const ConversationSchema = Schema({

    starter = {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true

    },

    target = {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    messages = [{type: Schema.Types.ObjectId, ref: 'message'}]
    
})

module.exports = mongoose.Model('conversation', ConversationSchema)
