var router = require('express').Router()
var friendRouter = require('./friend/friendRouter')
var userRouter = require('./user/userRouter')
var inviteRouter = require('./invite/inviteRouter')
var conversationRouter = require('./conversation/conversationRouter')
var messageRouter = require('./message/messageRouter')


router.use('/users/',userRouter)
router.use('/friends/',friendRouter)
router.use('/messages/',messageRouter)
router.use('/invites/',inviteRouter)
router.use('/conversations/',conversationRouter)


module.exports = router

