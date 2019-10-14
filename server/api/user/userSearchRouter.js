var router = require('express').Router()
var controller = require('./userController')
var auth = require('../../auth/auth')
var validateUsers = [auth.decodeToken(), auth.getFreshUser()]

router.param('username', controller.searchParam)
router.route('/:username')
    .get(validateUsers, controller.search)

module.exports = router