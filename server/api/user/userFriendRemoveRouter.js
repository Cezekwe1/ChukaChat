var router = require('express').Router()
var controller = require('./userController')
var auth = require('../../auth/auth')
var validateUsers = [auth.decodeToken(), auth.getFreshUser()]
router.use(validateUsers)
router.use(controller.getOtherFriend)
router.use(controller.deleteConvos)
router.route('/')
    .post(validateUsers,controller.removeFriend)

module.exports = router