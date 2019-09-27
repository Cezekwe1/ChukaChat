var router = require('express').Router()
var controller = require('./conversationController')

router.param(controller.param)

router.route('/')
    .post(controller.post)

router.route('/:id')
    .get(controller.getOne)
    .delete(controller.delete)

module.exports = router