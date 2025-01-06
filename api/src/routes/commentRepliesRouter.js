const express = require("express");
const router = express.Router();
const CommentReply = require("../models/CommentReply.js");

// Create a comment
router.post("/", async (req, res) => {
  const newComment = new CommentReply(req.body);
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:commentId", async (req, res) => {
  try {
    const comments = await CommentReply.find({ commentId: req.params.commentId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
