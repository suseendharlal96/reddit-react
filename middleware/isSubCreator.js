const Subs = require("../models/Subs");

const isSubCreator = async (req, res, next) => {
  const user = res.locals.user;
  try {
    const sub = await Subs.findOne({ name: req.params.name }).populate("user");
    if (!sub) {
      return res.status(404).json({ error: "Sub not found" });
    }
    if (sub.user.username !== user.username) {
      return res
        .status(403)
        .json({ error: "You are not the creator of this Sub." });
    }
    res.locals.sub = sub;
    return next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = isSubCreator;
