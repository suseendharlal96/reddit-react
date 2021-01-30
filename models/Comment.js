const { model, Schema } = require("mongoose");

const commentSchema = new Schema(
  {
    identifier: {
      type: String,
      required: [true, "Identifier required"],
    },
    commentBody: {
      type: String,
      required: [true, "comment required"],
    },
    username: {
      type: String,
      required: [true, "username required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user required"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "post required"],
    },
    votes: [
      {
        username: { type: String, required: true },
        value: { type: Number, required: true },
      },
    ],
    voteCount: {
      type: Number,
      default: 0,
    },
    userVote: {
      type: Number,
    },
  },
  { timestamps: true }
);

commentSchema.pre("validate", function () {
  if (!this.identifier) {
    this.identifier = this.makeId(8);
  }
});

commentSchema.methods = {
  makeId(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
};

module.exports = model("Comment", commentSchema);
