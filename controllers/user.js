const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

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
      await User.create({
        email,
        username,
        password,
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
    const errors = {};
    if (username && username.trim().length === 0)
      errors.username = "Username required";
    if (password && password.trim().length === 0)
      errors.password = "Password required";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    const user = await User.findOne({ username: username.trim() });
    if (!user) errors.username = "Username not found";
    const passMatch = await bcrypt.compare(password.trim(), user.password);
    if (!passMatch) errors.password = "Invalid credential";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    const token = jwt.sign({ username }, process.env.SECRET);
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
    const actualUser = await User.findOne({ username }).select(
      "-_id -password"
    );
    return res.json(actualUser);
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
};
