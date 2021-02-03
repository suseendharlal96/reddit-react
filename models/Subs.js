const { model, Schema } = require("mongoose");

const subsSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
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
    imageUrl: {
      type: String,
    },
    bannerUrl: {
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

subsSchema.post("find", function (doc) {
  doc.forEach((d) => {
    d.imageUrl = d.imageUrn
      ? `${process.env.APP_URL}${d.imageUrn}`
      : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    d.bannerUrl = d.bannerUrn
      ? `${process.env.APP_URL}${d.bannerUrn}`
      : undefined;
  });
});

module.exports = model("Subs", subsSchema);
