var router = require('express').Router()
var controller = require('./messageController')
router.param('id',controller.convoParam)
router.route('/:id')
    .get(controller.getAllConvoMessages)
module.exports = router