const { model, Schema } = require("mongoose");

const voteSchema = new Schema({
  value: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = model("Vote", voteSchema);
