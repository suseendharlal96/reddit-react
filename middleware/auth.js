const jwt = require("jsonwebtoken");

const User = require("../models/User");

const isAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "Unauthenticated" });
  const { username } = jwt.verify(token, process.env.SECRET);
  try {
    const user = await User.findOne({ username }).select("-_id -password");
    if (!user) return res.status(403).json({ message: "Unauthenticated" });
    res.locals.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

module.exports = isAuth;
