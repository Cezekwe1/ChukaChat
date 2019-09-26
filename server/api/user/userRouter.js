var router = require('express').Router()
var controller = require('./userController')

router.param('id',controller.param)
router.route('/')
    .get(controller.get)
    .post(controller.post)

router.route('/:id')
    .get(controller.getOne)
    .delete(controller.delete)

module.exports = router