var router = require('express').Router()
var controller = require('./userController')
var auth = require('../../auth/auth')
var validateUsers = [auth.decodeToken(), auth.getFreshUser()]
router.param('id',controller.param)
router.route('/')
    .get(controller.get)
    .post(controller.post)

router.route('/:id')
    .get(validateUsers, controller.getOne)
    .delete(validateUsers, controller.delete)

module.exports = router