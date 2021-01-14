const { model, Schema } = require("mongoose");

const postSchema = new Schema(
  {
    identifier: {
      type: String,
      required: [true, "Identifier required"],
      minlength: [7, "Identifier must be atleast 7 characters long"],
    },
    title: {
      type: String,
      required: [true, "Title required"],
      minlength: [3, "Title must be atleast 3 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Slug required"],
    },
    body: {
      type: String,
      default: "",
    },
    subName: {
      type: String,
      required: [true, "SubName required"],
    },
    sub: {
      type: Schema.Types.ObjectId,
      ref: "Subs",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User required"],
    },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

postSchema.pre("validate", function () {
  this.identifier = this.makeId(7);
  this.slug = this.slugify(this.title);
});

postSchema.post("find", function (doc) {
  doc.forEach((d) => {
    d.url = `r/${d.subName}/${d.identifier}/${d.slug}`;
  });
});

postSchema.methods = {
  makeId(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  slugify(str) {
    str = str.trim();
    str = str.toLowerCase();

    const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaaaeeeeiiiioooouuuunc------";

    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    return str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-") // collapse dashes
      .replace(/^-+/, "") // trim - from start of text
      .replace(/-+$/, "") // trim - from end of text
      .replace(/-/g, "_");
  },
};

module.exports = model("Post", postSchema);
