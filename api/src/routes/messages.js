const express = require("express");
const router = express.Router();
const Message = require("../models/Message.js");
const Convo = require("../models/Convo.js");
// import User from "../routes/users.js"
// const User = require("../models/User.js");

//create a post
router.post("/", async (req, res) => {
  const newMessage = new Message({
    convoId: req.body.convoId,
    senderId: req.body.senderId,
    text: req.body.text,
  });
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:convoId", async (req, res) => {
  try {
    const messages = await Message.find({
      convoId: req.params.convoId,
    });
    if (messages) {
      res.status(200).json(messages);
    } else {
      res.status(404).json("no message found in this conversation");
    }
  } catch (error) {
    res.status(500).json("convo found failed");
  }
});

router.get("/:SenderId/:ReceiverId/latestMessage", async (req, res) => {
  try {
    const conversation = await Convo.findOne({
      members: { $all: [req.params.SenderId, req.params.ReceiverId] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const latestMessage = await Message.findOne({ convoId: conversation._id })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .limit(1);

    if (!latestMessage) {
      return res
        .status(404)
        .json({ message: "No messages found in this conversation." });
    }

    // Respond with the latest message
    res.status(200).json(latestMessage);
  } catch (error) {
    console.error("Error fetching the latest message:", error);
    res.status(500).json({ message: "Failed to fetch the latest message." });
  }
});


module.exports = router;
