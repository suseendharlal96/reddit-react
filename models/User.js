const { model, Schema } = require("mongoose");

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      minlength: [3, "Must be atleast 3 characters long"],
      trim: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      validate: {
        validator: (email) => emailRegex.test(email),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      minlength: [6, "Must be atleast 6 characters long"],
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
