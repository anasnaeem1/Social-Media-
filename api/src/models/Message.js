const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    convoId: {
        type: String,
      },
      senderId: {
        type: String
      },
      text: {
        type: String
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
