const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  postComment: async (req, res) => {
    const { identifier, slug } = req.params;
    try {
      const post = await Post.findOne({ identifier, slug }).orFail();
      const user = res.locals.user;
      const userObj = await User.findOne({ username: user.username });
      const comment = await Comment.create({
        commentBody: req.body.body,
        username: user.username,
        user: userObj,
        post,
      });
      return res.status(201).json(comment);
    } catch (err) {
      console.log(err);
      return res.status(404).json({ err: "Post not found" });
    }
  },
};
