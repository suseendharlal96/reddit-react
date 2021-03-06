const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const Post = require("../models/Post");
const Subs = require("../models/Subs");
const User = require("../models/User");

module.exports = {
  createSub: async (req, res) => {
    const { name, title, description } = req.body;
    console.log(description);
    const errors = {};
    if (name.trim() === "") errors.name = "Name is required";
    if (title.trim() === "") errors.title = "Title is required";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    const user = res.locals.user;
    try {
      const userObj = await User.findOne({ username: user.username });
      const oldSub = await Subs.findOne({ name: name.toLowerCase() });
      if (oldSub) errors.sub = `Community with name '${name}' already exists`;
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
      const newSub = await Subs.create({
        name,
        title,
        description,
        user: userObj,
      });
      return res.status(201).json(newSub);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  getSubs: async (req, res) => {
    const name = req.params.name;
    try {
      const subs = await Subs.find({ name }).populate("user").orFail();
      // console.log(sub)
      const posts = await Post.find({ sub: subs[0] })
        .populate("comments")
        .populate("user")
        .sort({ createdAt: "-1" });
      if (res.locals.user) {
        const user = res.locals.user;
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
      } else {
        posts.forEach((post) => {
          post.voteCount = post.votes.reduce(
            (prev, curr) => prev + (curr.value || 0),
            0
          );
        });
      }
      return res.status(200).json({ sub: subs[0], posts });
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  getTopSubs: async (req, res) => {
    try {
      const subs = await Subs.find().select("-_id title name imageUrn");
      // const posts = await Post.find();
      // subs.forEach((sub) => {

      // });
      return res.status(200).json(subs);
    } catch (err) {
      console.log(err);
    }
  },

  searchSubs: async (req, res) => {
    try {
      const name = req.params.name;
      console.log(req.params);
      if (!req.params) {
        return res.status(400).json({ error: "Name must not be empty" });
      }
      if (!name) {
        return res.status(400).json({ error: "Name must not be empty" });
      }
      const subs = await Subs.find({ name: { $regex: "^" + name } });
      return res.status(200).json(subs);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  uploadSubImage: async (req, res) => {
    const passedSub = res.locals.sub;
    try {
      const sub = await Subs.findOne({ name: passedSub.name });
      const type = req.body.type;
      if (!req.file) {
        if (type === "image") {
          sub.imageUrn = null;
        } else if (type === "banner") {
          sub.bannerUrn = null;
        }
        await sub.save();
        return res.json(sub);
      }
      if (type !== "image" && type !== "banner") {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Invalid type" });
      }
      if (type === "image") {
        cloudinary.uploader.upload(
          "public/images/" + req.file.filename,
          async (err, result) => {
            const cloudUrn =
              result.secure_url.split("/")[6] +
              "/" +
              result.secure_url.split("/")[7];
            try {
              sub.imageUrn = cloudUrn;
              await sub.save();
              return res.json(sub);
            } catch (err) {
              console.log(err);
            }
          }
        );
      } else if (type === "banner") {
        cloudinary.uploader.upload(
          "public/images/" + req.file.filename,
          async (err, result) => {
            const cloudUrn =
              result.secure_url.split("/")[6] +
              "/" +
              result.secure_url.split("/")[7];
            try {
              sub.bannerUrn = cloudUrn;
              await sub.save();
              return res.json(sub);
            } catch (err) {
              console.log(err);
            }
          }
        );
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
};
