const fs = require("fs");

const Post = require("../models/Post");
const Subs = require("../models/Subs");
const User = require("../models/User");

module.exports = {
  createSub: async (req, res) => {
    const { name, title, description } = req.body;
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
      if (oldSub) errors.sub = "Sub already exists";
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
      const posts = await Post.find({ subName: name })
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
        });
      }
      return res.status(200).json({ sub: subs[0], posts });
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  getTopSubs: async (req, res) => {
    console.log("asd");
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

  uploadSubImage: async (req, res) => {
    const passedSub = res.locals.sub;
    try {
      const sub = await Subs.findOne({ name: passedSub.name });
      const type = req.body.type;
      if (!req.file) {
        let oldImageUrn = "";
        if (type === "image") {
          oldImageUrn = sub.imageUrn;
          sub.imageUrn = null;
        } else if (type === "banner") {
          oldImageUrn = sub.bannerUrn;
          sub.bannerUrn = null;
        }
        if (oldImageUrn) {
          fs.unlinkSync(`public/images/${oldImageUrn}`);
        }
        await sub.save();
        return res.json(sub);
      }
      if (type !== "image" && type !== "banner") {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Invalid type" });
      }
      let oldImageUrn = "";
      if (type === "image") {
        oldImageUrn = sub.imageUrn;
        sub.imageUrn = req.file.filename;
      } else if (type === "banner") {
        oldImageUrn = sub.bannerUrn;
        sub.bannerUrn = req.file.filename;
      }
      if (oldImageUrn) {
        fs.unlinkSync(`public/images/${oldImageUrn}`);
      }
      await sub.save();
      return res.json(sub);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
};
