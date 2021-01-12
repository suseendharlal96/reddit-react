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
};
