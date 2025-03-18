const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/User.js");
const { set } = require("mongoose");
const router = express.Router();
const { ObjectId } = require("mongodb");
const FollowReq = require("../models/FollowReq.js");

router.get("/allRequestsUsers/:id", async (req, res) => {
  try {
    const allRequests = await FollowReq.find({
      receiverId: new ObjectId(req.params.id),
    });
    const allSenders = await Promise.all(
      allRequests.map(async (request) => {
        const sender = await User.findById(new ObjectId(request.senderId));
        return sender;
      })
    );
    res.status(200).json(allSenders);
  } catch (error) {
    console.error("Error fetching follow requests:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.delete("/deleteReq/:senderId", async (req, res) => {
  try {
    const FollowReq = FollowReq.find({ senderId: req.params.senderId });
    const deletedReq = FollowReq.delete(FollowReq);
    res.status(200).json(deletedReq);
  } catch (error) {
    console.error("Error fetching follow requests:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
