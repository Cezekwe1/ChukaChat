var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const UserSchema = Schema({
  username: {
    type: String,
    unique: True,
    required: True
  },
  password: {
    type: String,
    required: True
  },
  displayName: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: "conversation" }]
});

module.exports = mongoose.Model("user", UserSchema);
