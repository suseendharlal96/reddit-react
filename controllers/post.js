const Post = require("../models/Post");
const User = require("../models/User");
const Subs = require("../models/Subs");
// const Vote = require("../models/Vote");
const Comment = require("../models/Comment");

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
      if (res.locals.user) {
        const user = res.locals.user;
        const posts = await Post.find()
          .populate("sub")
          .populate("user")
          .sort({ createdAt: "-1" });
        posts.forEach((post) => {
          const index = post.votes.findIndex(
            (v) => v.username === user.username
          );
          post.userVote = index > -1 ? post.votes[index].value : 0;
        });
        return res.status(200).json(posts);
      } else {
        const posts = await Post.find()
          .select("-userVote")
          .populate("sub")
          .populate("user")
          .sort({ createdAt: "-1" });
        return res.status(200).json(posts);
      }
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

  vote: async (req, res) => {
    const { identifier, slug, value, commentIdentifier } = req.body;
    if (![1, 0, -1].includes(value)) {
      return res.status(400).json({ value: "Only 1, 0, -1 are allowed" });
    }
    try {
      const user = res.locals.user;
      const post = await Post.findOne({ identifier, slug });
      let comment;
      if (commentIdentifier.trim().length !== 0) {
        // If there is a comment identifier find vote by comment
        comment = await Comment.findOne({
          identifier: commentIdentifier,
        }).orFail();
        if (comment.votes && comment.votes.length !== 0) {
          const index = comment.votes.findIndex(
            (vote) => vote.username === user.username
          );
          if (index !== -1) {
            if (value === 0) {
              comment.votes.splice(index, 1);
            } else {
              comment.votes[index].value = value;
            }
          } else {
            if (value !== 0) {
              comment.votes.push({ username: user.username, value });
            }
          }
        } else {
          if (value === 0) {
            return res.json({ error: "Vote not found" });
          } else {
            comment.votes.push({ username: user.username, value });
          }
        }
        if (comment.votes.length !== 0 && value !== 0) {
          comment.voteCount = comment.votes.reduce(
            (prev, curr) => prev + (curr.value || 0),
            0
          );
          const index = comment.votes.findIndex(
            (v) => v.username === user.username
          );
          comment.userVote = index > -1 ? comment.votes[index].value : 0;
        }
        await comment.save();
      } else {
        // Else find vote by post
        if (post.votes && post.votes.length !== 0) {
          const index = post.votes.findIndex(
            (vote) => vote.username === user.username
          );
          if (index !== -1) {
            if (value === 0) {
              post.votes.splice(index, 1);
            } else {
              post.votes[index].value = value;
            }
          } else {
            if (value !== 0) {
              post.votes.push({ username: user.username, value });
            }
          }
        } else {
          if (value === 0) {
            return res.json({ error: "Vote not found" });
          } else {
            post.votes.push({ username: user.username, value });
          }
        }
        if (post.votes.length !== 0 && value !== 0) {
          post.voteCount = post.votes.reduce(
            (prev, curr) => prev + (curr.value || 0),
            0
          );
          const index = post.votes.findIndex(
            (v) => v.username === user.username
          );
          post.userVote = index > -1 ? post.votes[index].value : 0;
        }
        await post.save();
      }
      const updatedPost = await Post.findOne({ identifier, slug }).populate(
        "comments"
      );

      return res.json(updatedPost);
    } catch (err) {
      console.log(err);
    }
  },
};
