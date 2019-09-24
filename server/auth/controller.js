var User = require('../api/user/userModel')

exports.signup = function(req,res,next){
  User.create(req.body)
}

exports.signin = function(req,res,next){
  var token = signToken(req.user._id)
  res.json({token})
}