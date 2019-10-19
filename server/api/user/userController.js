var User = require("./userModel");
var Conversation = require("../conversation/conversationModel");
var Invite = require("../invite/inviteModel");
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

exports.getOtherFriend = function(req, res, next) {
  User.findById(req.body.target)
    .then(person => {
      req.friend = person;
      next();
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteConvos = function(req, res, next) {
  const me = req.user;
  const user = req.friend;
  query = {
    $or: [
      { starter: req.body.target, target: me._id },
      { starter: me._id, target: req.body.target }
    ]
  };
  Conversation.find(query)
    .then(convos => {
      convos.forEach(el => {
        user.conversations.remove(el._id);
        me.conversations.remove(el._id);
        el.remove(function(err, removed) {
          if (err) {
            next(err);
          }
        });
      });
      next();
    })
    .catch(err => {
      next(err);
    });
};

exports.searchParam = function(req, res, next, username) {
  User.find({ username: { $regex: new RegExp(username, "gi") } })
    .select("-password -conversations -friends")
    .then(function(matches) {
      req.matches = matches;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

exports.removeFriend = function(req, res, next) {
  const me = req.user;
  const user = req.friend;
  me.friends.remove(req.body.target);
  
  user.friends.remove(me._id);
  user.save(function(err,doc) {
    if (err) {
      return next(err);
    }
    
  });
  me.save(function(err, doc) {
    if (err) {
      return next(err);
    }
    res.json(doc.toJson());
  });
};
exports.search = function(req, res) {
  res.json(req.matches);
};

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
exports.getPending = function(req, res, next) {
  Invite.find({ inviter: req.user._id, target: req.person._id, accepted: null })
    .then(invites => {
      if (invites.length > 0) {
        let person = req.person.toJson();
        _.merge(person, { pending: true });
        req.person = person;
      } else {
        let person = req.person.toJson();
        _.merge(person, { pending: false });
        req.person = person;
      }
      next();
    })
    .catch(err => next(err));
};
exports.getOne = function(req, res, next) {
  const person = req.person;
  
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

exports.me = function(req, res, next) {
  res.json(req.user.toJson());
};
