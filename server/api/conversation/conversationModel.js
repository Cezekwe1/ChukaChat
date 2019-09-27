var mongoose = require('mongoose')
var Schema = mongoose.Schema

const ConversationSchema = Schema({

    starter : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true

    },

    target : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    
})

ConversationSchema.post('save',function(doc,next){
    doc.populate('starter', '_id conversations')
        .populate('target', '_id conversations')
        .execPopulate(function(err, doc){
            if (err){next(err)}
            console.log(doc)
            doc.target.conversations.push(doc._id)
            doc.starter.conversations.push(doc._id)
            doc.target.save(function(err,doc){ if (err){next(err)}})
            doc.starter.save(function(err,doc){ if (err){next(err)}})
            next()
        })
    next()
})

module.exports = mongoose.model('conversation', ConversationSchema)
