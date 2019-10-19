var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const ConversationSchema = Schema({
  starter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});

ConversationSchema.pre("save", function(next)  {
  let query = {
    $or: [
      { starter: this.starter, target: this.target },
      { starter: this.target, target: this.starter }
    ]
  };
  mongoose
    .model("conversation", ConversationSchema)
    .find(query)
    .then(convos => {
      convos.forEach(() => {
        next(new Error("Combo Not Unique"));
        return
      });
      next();
    })
    .catch(err => {
      next(err);
    });
});

ConversationSchema.post("save", function(doc, next) {
  doc
    .populate("starter", "_id conversations")
    .populate("target", "_id conversations")
    .execPopulate(function(err, doc) {
      if (err) {
        next(err);
      }
      doc.target.conversations.addToSet(doc._id);
      doc.starter.conversations.addToSet(doc._id);
      doc.target.save(function(err, doc) {
        if (err) {
          next(err);
        }
      });
      doc.starter.save(function(err, doc) {
        if (err) {
          next(err);
        }
      });
      next();
    });
  next();
});

module.exports = mongoose.model("conversation", ConversationSchema);
