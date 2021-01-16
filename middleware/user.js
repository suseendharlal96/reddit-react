const jwt = require("jsonwebtoken");

const User = require("../models/User");

const isUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next();
  const { username } = jwt.verify(token, process.env.SECRET);
  try {
    const user = await User.findOne({ username }).select("-password");
    res.locals.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

module.exports = isUser;
