const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const isUser = require("../middleware/user");
const subsController = require("../controllers/subs");

router.post("/createSubs", isUser, isAuth, subsController.createSub);

module.exports = router;
