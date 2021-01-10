const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const isAuth = require("../middleware/auth");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
// router.get("/isAuth", isAuth);
router.get("/logout", isAuth, userController.logout);

module.exports = router;
