var router = require('express').Router()
var searchRouter = require('./userSearchRouter')
var removeFriendRouter = require('./userFriendRemoveRouter')
var controller = require('./userController')
var auth = require('../../auth/auth')
var validateUsers = [auth.decodeToken(), auth.getFreshUser()]
router.use('/remove-friend/',removeFriendRouter )
router.use('/search/',searchRouter)
router.param('id',controller.param)
router.get('/me', validateUsers, controller.me)
router.route('/')
    .get(controller.get)
    .post(controller.post)

router.route('/:id')
    .get([validateUsers,controller.getPending], controller.getOne)
    .delete(validateUsers, controller.delete)

module.exports = router