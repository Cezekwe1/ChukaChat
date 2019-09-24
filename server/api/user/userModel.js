var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')

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


UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = this.encryptPassword(this.password);
  next();
});

UserSchema.methods = {
  authenticate: function(plainTextPword) {
    return bcrypt.compareSync(plainTextPword, this.password);
  },
  encryptPassword: function(plainTextPword) {
    if (!plainTextPword) {
      return '';
    } else {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPword, salt);
    }
  },
  toJson: function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  }
};


module.exports = mongoose.model('user', UserSchema);
module.exports = mongoose.Model("user", UserSchema);
