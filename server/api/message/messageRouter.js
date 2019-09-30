var router = require('express').Router()
var messageConvoRouter = require('./messageConvoRouter')
var controller = require('./messageController')
var auth = require('../../auth/auth')
var validateUsers = [auth.decodeToken(), auth.getFreshUser()]

router.use(validateUsers)
router.use('/convo/', messageConvoRouter)
router.param('id',controller.param)

router.route('/')
    .post(controller.post)
router.route('/:id')
    .get(controller.getOne)
    .delete(controller.delete)

module.exports = router