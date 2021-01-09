const User = require("../models/User");

module.exports = {
  signup: async (req, res) => {
    const { email, username, password } = req.body;
    try {
      const errors = {};
      const isUsernameExists = await User.findOne({ username });
      const isEmailExists = await User.findOne({ email });
      if (isUsernameExists) errors.userame = "Username is already taken";
      if (isEmailExists) errors.email = "Email is already taken";
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
      const user = await User.create({
        email,
        username,
        password,
      });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};
