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

  getUserData: async (req, res) => {
    const user = await User.find({ username: req.params.username }).select(
      "-password"
    );
    try {
      const posts = await Post.find({ user })
        .populate("sub")
        .populate("user")
        .sort({ createdAt: "-1" });
      const comments = await Comment.find({ user })
        .populate("post")
        .sort({ createdAt: "-1" });
      const submissions = [];
      if (res.locals.user) {
        const loggeduser = res.locals.user;
        posts.forEach((post) => {
          const index = post.votes.findIndex(
            (v) => v.username === loggeduser.username
          );
          post.userVote = index > -1 ? post.votes[index].value : 0;
          post.voteCount = post.votes.reduce(
            (prev, curr) => prev + (curr.value || 0),
            0
          );
        });
        comments.forEach((comment) => {
          const index = comment.votes.findIndex(
            (v) => v.username === loggeduser.username
          );
          comment.userVote = index > -1 ? comment.votes[index].value : 0;
          comment.voteCount = comment.votes.reduce(
            (prev, curr) => prev + (curr.value || 0),
            0
          );
        });

        submissions.push(...posts, ...comments);
        return res.status(200).json({ submissions, user: user[0] });
      } else {
        posts.forEach((post) => {
          post.voteCount = post.votes.reduce(
            (prev, curr) => prev + (curr.value || 0),
            0
          );
        });
        comments.forEach((comment) => {
          comment.voteCount = comment.votes.reduce(
            (prev, curr) => prev + (curr.value || 0),
            0
          );
        });
        submissions.push(...posts, ...comments);
        return res.status(200).json({ submissions, user: user[0] });
      }
    } catch (err) {
      console.log(err);
    }
  },

  getPosts: async (req, res) => {
    const currentPage = req.query.page ? req.query.page : 0;
    const postsPerPage = req.query.count ? req.query.count : 4;
    try {
      if (res.locals.user) {
        const user = res.locals.user;
        const posts = await Post.find()
          .limit(postsPerPage)
          .skip(currentPage * postsPerPage)
          .populate("sub")
          .populate("user")
          .sort({ createdAt: "-1" });
        posts.forEach((post) => {
          const index = post.votes.findIndex(
            (v) => v.username === user.username
          );
          post.userVote = index > -1 ? post.votes[index].value : 0;
          post.voteCount = post.votes.reduce(
            (prev, curr) => prev + (curr.value || 0),
            0
          );
        });
        return res.status(200).json(posts);
      } else {
        const posts = await Post.find()
          .select("-userVote")
          .populate("sub")
          .populate("user")
          .sort({ createdAt: "-1" });
        posts.forEach((post) => {
          post.voteCount = post.votes.reduce(
            (prev, curr) => prev + (curr.value || 0),
            0
          );
        });
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
      const post = await Post.find({ slug, identifier })
        .populate("sub")
        .populate("user")
        .populate("comments");
      if (!post) return res.status(404).json({ error: "Post not found" });
      if (res.locals.user) {
        const index = post[0].votes.findIndex(
          (v) => v.username === res.locals.user.username
        );
        post[0].userVote = index > -1 ? post[0].votes[index].value : 0;
        post[0].comments.forEach((comment) => {
          const index = comment.votes.findIndex(
            (v) => v.username === res.locals.user.username
          );
          comment.userVote = index > -1 ? comment.votes[index].value : 0;
        });
      }
      post[0].voteCount = post[0].votes.reduce(
        (prev, curr) => prev + (curr.value || 0),
        0
      );
      post[0].comments.forEach((comment) => {
        comment.voteCount = comment.votes.reduce(
          (prev, curr) => prev + (curr.value || 0),
          0
        );
      });
      return res.status(200).json(post[0]);
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
        if (comment.votes.length !== 0) {
          // comment.voteCount = comment.votes.reduce(
          //   (prev, curr) => prev + (curr.value || 0),
          //   0
          // );
          // const index = comment.votes.findIndex(
          //   (v) => v.username === user.username
          // );
          // comment.userVote = index > -1 ? comment.votes[index].value : 0;
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
        if (post.votes.length !== 0) {
          // post.voteCount = post.votes.reduce(
          //   (prev, curr) => prev + (curr.value || 0),
          //   0
          // );
          // const index = post.votes.findIndex(
          //   (v) => v.username === user.username
          // );
          // post.userVote = index > -1 ? post.votes[index].value : 0;
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
