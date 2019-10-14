var User = require("./userModel");
var _ = require("lodash");
var signToken = require("../../auth/auth").signToken;

exports.param = function(req, res, next, id) {
  User.findById(id)
    .select("-password")
    .exec()
    .then(
      function(user) {
        if (!user) {
          next(new Error("No user with that id"));
        } else {
          req.person = user;
          next();
        }
      },
      function(err) {
        next(err);
      }
    );
};

exports.searchParam = function(req, res, next, username) {
  User.find({username:{$regex: new RegExp(username,'gi')}})
    .select("-password -conversations -friends")
    .then(function(matches){
      req.matches = matches
      next()
    })
    .catch(function(err){
      next(err)
    })
};

exports.removeFriend = function(req,res,next){
  const me = req.user
  me.friends.remove(req.body.target)
  me.save(function(err,doc){
    if (err){next(err)}
    res.json(doc.toJson())
  })
}
exports.search = function(req,res){
  res.json(req.matches)
}

exports.get = function(req, res, next) {
  User.find({})
    .select("-password")
    .then(function(doc) {
      res.json(doc);
    })
    .catch(function(err) {
      next(err);
    });
};

exports.getOne = function(req, res, next) {
  const person = req.person.toJson();
  
  res.json(person);
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
 
  newUser.save(function(err, user) {
    if (err) {
      return next(err);
    }
    const token = signToken(user._id);
    const username = user.username;
    res.json({ token: token, user: user.toJson() });
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
