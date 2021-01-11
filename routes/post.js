const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const postController = require("../controllers/post");


router.post("/createPost", isAuth, postController.createPost);

module.exports = router;
