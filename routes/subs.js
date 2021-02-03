const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const isAuth = require("../middleware/auth");
const isUser = require("../middleware/user");
const isSubCreator = require("../middleware/isSubCreator");
const subsController = require("../controllers/subs");

// MULTER DISK STORAGE
const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file, callback) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Files of type jpeg,png,jpg are only allowed"));
    }
  },
});

// const upload = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: (_, file, callback) => {
//     if (
//       file.mimetype == "image/jpeg" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/png"
//     ) {
//       callback(null, true);
//     } else {
//       callback(new Error("Files of type jpeg,png,jpg are only allowed"));
//     }
//   },
// });

const makeId = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

router.post("/createSubs", isUser, isAuth, subsController.createSub);
router.get("/:name", isUser, subsController.getSubs);
router.get("/", subsController.getTopSubs);
router.get("/search/:name", subsController.searchSubs);
router.post(
  "/:name/image",
  isUser,
  isAuth,
  isSubCreator,
  upload.single("file"),
  subsController.uploadSubImage
);
module.exports = router;
