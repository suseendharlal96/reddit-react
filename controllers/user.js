const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const fs = require("fs");

const User = require("../models/User");

module.exports = {
  signup: async (req, res) => {
    const { email, username, password } = req.body;
    try {
      const errors = {};
      const isUsernameExists = await User.findOne({ username });
      const isEmailExists = await User.findOne({ email });
      if (isUsernameExists) errors.username = "Username is already taken";
      if (isEmailExists) errors.email = "Email is already taken";
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
      const hashedPass = await bcrypt.hash(password, 6);
      await User.create({
        email,
        username,
        password: hashedPass,
      });
      const user = await User.findOne({ username }).select("-password");
      res.status(201).json(user);
    } catch (err) {
      const errObj = {};
      Object.entries(err.errors).forEach(([key, value]) => {
        errObj[key] = value.properties.message;
      });
      res.status(400).json(errObj);
    }
  },

  signin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const errors = {};
      if (username && username.trim().length === 0)
        errors.username = "Username required";
      if (password && password.trim().length === 0)
        errors.password = "Password required";
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
      let user;
      let email;
      user = await User.findOne({ username: username.trim() });
      if (!user) {
        user = await User.findOne({ email: username.trim() });
        email = user.email;
      }
      if (!user) errors.username = "User not found";
      if (user) {
        const passMatch = await bcrypt.compare(password.trim(), user.password);
        if (!passMatch) errors.password = "Invalid credential";
      }
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
      const token = jwt.sign({ username: user.username }, process.env.SECRET);
      console.log(token);
      res.set(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "strict",
          maxAge: 3600,
        })
      );
      let actualUser;
      if (email) {
        actualUser = await User.find({ email }).select("-_id -password");
      } else {
        actualUser = await User.find({ username }).select("-_id -password");
      }
      console.log(actualUser);
      return res.json(actualUser[0]);
    } catch (err) {
      console.log(err);
    }
  },

  logout: (_, res) => {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: new Date(0),
        sameSite: "strict",
      })
    );
    return res.status(200).json({ success: "Logout success" });
  },

  me: (_, res) => {
    return res.json(res.locals.user);
  },

  uploadProfilePic: async (req, res) => {
    const username = req.params.username;
    const user = res.locals.user;
    if (username !== user.username) {
      fs.unlinkSync(`public/images/${req.file.filename}`);
      return res.status(400).json({ error: "Un-authorized" });
    }
    try {
      const USER = await User.findOne({ username });
      const type = req.body.type;
      if (!req.file) {
        let oldProfileUrn = "";
        if (type === "profile") {
          oldProfileUrn = USER.profileUrn;
          USER.profileUrn = null;
        }
        if (oldProfileUrn) {
          fs.unlinkSync(`public/images/${oldProfileUrn}`);
        }
        await USER.save();
        return res.json(USER);
      }
      if (type !== "profile") {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Invalid type" });
      }
      let oldProfileUrn = "";
      if (type === "profile") {
        oldProfileUrn = USER.profileUrn;
        USER.profileUrn = req.file.filename;
      }
      if (oldProfileUrn) {
        fs.unlinkSync(`public/images/${oldProfileUrn}`);
      }
      await USER.save();
      return res.json(USER);
    } catch (err) {
      console.log(err);
    }
  },
};
