var router = require('express').Router()

router.route('/')
    .get(function(req,res){
        res.send({message:"hello"})
    })

router.route('/:id')
    .get(function(req,res){
        res.send
    })
module.exports = router