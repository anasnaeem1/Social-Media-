const express = require("express");
const router = express.Router();
const Message = require("../models/Message.js");
const Convo = require("../models/Convo.js");
// import User from "../routes/users.js"
// const User = require("../models/User.js");

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

// Delete all message of conversation
router.delete("/:convoId", async (req, res) => {
  try {
    const deletedMessages = await Message.deleteMany({
      convoId: req.params.convoId,
    });

    if (deletedMessages.deletedCount > 0) {
      res.status(200).json(deletedMessages);
    } else {
      res.status(404).json("no message found in this conversation");
    }
  } catch (error) {
    res.status(500).json("convo found failed");
  }
});

// Get a latestMesage of conversation
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
        .status(200)
        .json({ message: "No messages found in this conversation." });
    }

    res.status(200).json(latestMessage);
  } catch (error) {
    console.error("Error fetching the latest message:", error);
    res.status(500).json({ message: "Failed to fetch the latest message." });
  }
});

router.put("/:messageId/seen", async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (!message.seen) {
      message.seen = true;
      await message.save();
      res.status(200).json({ message: message });
    } else {
      res.status(200).json("Already Seen");
    }
  } catch (error) {
    console.error("Error updating the message:", error);
    res.status(500).json({ message: "Failed to update the message." });
  }
});

module.exports = router;
