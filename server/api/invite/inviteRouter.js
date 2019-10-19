var router = require('express').Router()
var controller = require('./inviteController')
var auth = require('../../auth/auth')
var validateUsers = [auth.decodeToken(), auth.getFreshUser()]

router.use(validateUsers)
router.param('id',controller.param)
router.route('/')
    .get(controller.get)
    .post(controller.post)

router.route('/:id')
    .get(controller.getOne)
    .put(controller.put)
    .delete(controller.delete)
    
router.use(controller.error)
    
module.exports = router