const { model, Schema } = require("mongoose");

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      minlength: [3, "Must be atleast 3 characters long"],
      trim: true,
      required: [true, "Must not be empty"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Must not be empty"],
      trim: true,
      validate: {
        validator: (email) => emailRegex.test(email),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      minlength: [6, "Must be atleast 6 characters long"],
      required: [true, "Must not be empty"],
    },
    profileUrn:{
      type:String
    },
    profileUrl:{
      type:String
    }
  },
  { timestamps: true }
);

userSchema.post('find',function(doc){
doc.forEach((d)=>{
d.profileUrl = d.profileUrn ? `${process.env.APP_URL}/images/${d.profileUrn}`
: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
})
})

module.exports = model("User", userSchema);
