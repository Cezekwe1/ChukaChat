var User = require('./userModel')
var _ = require('lodash')
var signToken = require('../../auth/auth').signToken

exports.param = function(req,res,next,id){
    User.findById(id)
    .select('-password')
    .exec()
    .then(function(user) {
      if (!user) {
        next(new Error('No user with that id'));
      } else {
        req.user = user;
        next();
      }
    }, function(err) {
      next(err);
    });
}

exports.get = function(req,res,next){
    User.find({})
        .select('-password')
        .then(function(doc){
            res.json(doc)
        })
        .catch(function(err){
            next(err)
        })
}

exports.getOne = function(req, res, next) {
    const user = req.user.toJson();
    res.json(user);
};

exports.put = function(req, res, next) {
    const user = req.user;
  
    const update = req.body;
  
    _.merge(user, update);
  
    user.save(function(err, saved) {
      if (err) {
        next(err);
      } else {
        res.json(saved.toJson());
      }
    });
};

exports.post = function(req, res, next) {
    const newUser = new User(req.body);
    console.log("trying to send this", req.body, newUser)
    newUser.save(function(err, user) {
      console.log("what we got", err, user)
      if(err) { return next(err);}
      const token = signToken(user._id);
      const username = user.username;
      res.json({token: token, user: user.toJson()});
    });
};

exports.delete = function(req, res, next) {
    req.user.remove(function(err, removed) {
      if (err) {
        next(err);
      } else {
        res.json(removed.toJson());
      }
    });
};