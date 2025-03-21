const mongoose = require("mongoose");

const commentReplySchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true,
      },
      img : {
        type: String,
      },
      likes: {
        type: Array,
      },
      commentId: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommentReply", commentReplySchema);