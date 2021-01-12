const { model, Schema } = require("mongoose");

const subsSchema = new Schema(
  {
    name: {
      type: String,
      lowercase:true,
      required: [true, "Sub name required"],
    },
    title: {
      type: String,
      required: [true, "Title required"],
    },
    descripion: {
      type: String,
    },
    imageUrn: {
      type: String,
    },
    bannerUrn: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user required"],
    },
  },
  { timestamps: true }
);

module.exports = model("Subs", subsSchema);
