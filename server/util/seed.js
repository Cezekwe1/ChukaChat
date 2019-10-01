const User = require("../../server/api/user/userModel");

const cleanDB = function() {
  User.collection.drop()
  // User.find({}).then(function(users) {
  //   users.map(function(user) {
  //     console.log("done");
  //     return user.remove();
  //   });
  // });
};


// cleanDB()