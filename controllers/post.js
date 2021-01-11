const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  createPost: async (req, res) => {
    const { title, body, subName } = req.body;
    const user = res.locals.user;
    try {
      const userObj = await User.findOne({ username: user.username }).select(
        "-password"
      );
      const newPost = await Post.create({
        title,
        body,
        subName,
        user: userObj,
      });
      return res.status(201).json(newPost);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
};
