const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const isUser = require("../middleware/user");
const postController = require("../controllers/post");
const commentController = require("../controllers/comment");

router.get("/", isUser, postController.getPosts);
router.post("/createPost", isUser, isAuth, postController.createPost);
router.get("/:identifier/:slug", postController.getPost);
router.post(
  "/:identifier/:slug/comment",
  isUser,
  isAuth,
  commentController.postComment
);
router.post("/vote", isUser, isAuth, postController.vote);

module.exports = router;
