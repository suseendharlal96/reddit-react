const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const subsController = require("../controllers/subs");

router.post("/createSubs", isAuth, subsController.createSub);

module.exports = router;
