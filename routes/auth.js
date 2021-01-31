const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, cb) => {
      const profileName = makeId(15);
      cb(null, profileName + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Files of type jpeg,png,jpg are only allowed"));
    }
  },
});

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
  

const userController = require("../controllers/user");
const isAuth = require("../middleware/auth");
const isUser = require("../middleware/user");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post(
  "/profilepic/:username",
  isUser,
  isAuth,
  upload.single("file"),
  userController.uploadProfilePic
);
router.get("/me", isUser, isAuth, userController.me);
router.get("/logout", isUser, isAuth, userController.logout);

module.exports = router;
