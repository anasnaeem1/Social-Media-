const mongoose = require("mongoose");

const convoSchema = new mongoose.Schema(
  {
    members: {
        type: Array,
        required: true,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Convo", convoSchema);
