const User = require("../../server/api/user/userModel");
const Invite = require("../../server/api/invite/inviteModel");
const Message = require("../../server/api/message/messageModel");
const Conversation = require("../../server/api/conversation/conversationModel");

const users = [
  { username: "guest1", password: "test" },
  { username: "guest2", password: "test" },
  { username: "guest3", password: "test" }
];

const createDoc = function(model, doc) {
  return new Promise(function(resolve, reject) {
    new model(doc).save(function(err, person) {
      return err ? reject(err) : resolve(person);
    });
  });
};

const createUsers = function() {
  const promises = users.map(function(user) {
    return createDoc(User, user);
  });

  return Promise.all(promises);
};

const addFriends = function(friends) {
  for (let i = 0; i < friends.length; i++) {
    let currentUser = friends[i];
    for (let j = 0; j < friends.length; j++) {
      let friend = friends[j];
      if (j != i) {
        currentUser.friends.addToSet(friend._id);
      }
    }
  }

  const newFriends = friends.map(function(person) {
    return new Promise(function(resolve, reject) {
      person.save(function(err, doc) {
        return err ? reject(err) : resolve(doc);
      });
    });
  });
  return Promise.all(newFriends);
};
const cleanDB = function() {
  const collections = [User, Message].map(function(model) {
    return model.deleteMany().exec();
  });
  return Promise.all(collections);
};

cleanDB()
  .then(createUsers)
  .then(data => {
    addFriends(data);
  })
