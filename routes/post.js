const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const postController = require("../controllers/post");
const commentController = require("../controllers/comment");

router.get("/", postController.getPosts);
router.post("/createPost", isAuth, postController.createPost);
router.get("/:identifier/:slug", postController.getPost);
router.post(
  "/:identifier/:slug/comment",
  isAuth,
  commentController.postComment
);

module.exports = router;
