const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true,
      },
      img: {
        type: String,
      },
      postId: {
        type: String,
        required: true,
      },
      likes: {
        type: Array,
      },
      text: {
        type: String,
        required: true,
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);