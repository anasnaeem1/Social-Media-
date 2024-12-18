const express = require("express");
const router = express.Router();
const Convo = require("../models/Convo.js");
// import User from "../routes/users.js"
// const User = require("../models/User.js");

//create a Convo
router.post("/", async (req, res) => {
  const newConvo = new Convo({
    members: [req.body.senderId, req.body.recieverId],
  });
  try {
    const existingConvo = await Convo.findOne({
      members: { $all: [req.body.senderId, req.body.recieverId] },
    });
    if (existingConvo) {
      res.status(200).json({ convoId: existingConvo._id });
    } else {
      const savedConvo = await newConvo.save();
      res.status(200).json(savedConvo);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a Convo
router.get("/:convoId/convoId", async (req, res) => {
  try {
    const convo = await Convo.findById(req.params.convoId);
    if (!convo) {
      return res.status(404).json("Conversation not found");
    }
    const { updatedAt, ...others } = convo._doc;
    res.status(200).json(others);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Fetching conversation failed", details: error.message });
  }
});

// get a convo of a user
router.get("/:userId/userId", async (req, res) => {
  try {
    const conversation = await Convo.find({
      members: { $in: [req.params.userId] },
    });
    if (conversation.length === 0) {
        return res.status(404).json({message: "No message found"});
      }
      res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({
      error: "Fetching user conversations failed",
      details: error.message,
    });
  }
});

// Get a conversation involving both SenderId and ReceiverId
router.get("/:SenderId/:ReceiverId", async (req, res) => {
  try {
    const conversation = await Convo.findOne({
      members: { $all: [req.params.SenderId, req.params.ReceiverId] },
    });

    if (conversation) {
      res.status(200).json(conversation);
    } else {
      res.status(404).json("Conversation not found");
    }
  } catch (error) {
    res.status(500).json("Failed to find conversation");
  }
});

module.exports = router;
