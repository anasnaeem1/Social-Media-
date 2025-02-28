const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    isProfileUpdate: Boolean,
    desc: {
      required: true,
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    pinned: {
      type: Boolean,
      default:false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
