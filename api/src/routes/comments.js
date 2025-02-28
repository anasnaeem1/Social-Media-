const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.js");

// Create a comment
router.post("/", async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/singleComment/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Like/unlike a Comment
router.put("/:id/likeComment", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.likes.includes(userId)) {
      // Add like
      await comment.updateOne({ $push: { likes: userId } });
      return res.status(200).json({ message: "Comment liked" });
    } else {
      // Remove like
      await comment.updateOne({ $pull: { likes: userId } });
      return res.status(200).json({ message: "Comment unliked" });
    }
  } catch (error) {
    console.error("Error liking/unliking comment:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
