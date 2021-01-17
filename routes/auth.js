const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const isAuth = require("../middleware/auth");
const isUser = require("../middleware/user");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/me", isUser, isAuth, userController.me);
router.get("/logout", isUser, isAuth, userController.logout);

module.exports = router;
