const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");

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

userSchema.pre("save", async function () {
  try {
    this.password = await bcrypt.hash(this.password, 6);
  } catch (err) {
    console.log(err);
  }
});

module.exports = model("User", userSchema);
