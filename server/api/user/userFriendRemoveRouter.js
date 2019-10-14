var router = require('express').Router()
var controller = require('./userController')
var auth = require('../../auth/auth')
var validateUsers = [auth.decodeToken(), auth.getFreshUser()]
router.route('/')
    .post(validateUsers,controller.removeFriend)

module.exports = router