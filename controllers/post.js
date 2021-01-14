const Post = require("../models/Post");
const User = require("../models/User");
const Subs = require("../models/Subs");

module.exports = {
  createPost: async (req, res) => {
    const { title, body, subName } = req.body;
    const user = res.locals.user;
    try {
      const userObj = await User.findOne({ username: user.username }).select(
        "-password"
      );
      const sub = await Subs.findOne({ name: subName }).orFail();
      const newPost = await Post.create({
        title,
        body,
        subName,
        sub,
        user: userObj,
      });
      return res.status(201).json(newPost);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  getPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("sub")
        .populate("user")
        .sort({ createdAt: "-1" });
      return res.status(200).json(posts);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: "something went wrong" });
    }
  },

  getPost: async (req, res) => {
    const { identifier, slug } = req.params;
    try {
      const post = await Post.find({ slug, identifier }).populate("sub");
      if (!post) return res.status(404).json({ error: "Post not found" });
      return res.status(200).json(post);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: "something went wrong" });
    }
  },
};
