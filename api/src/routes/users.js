const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/User.js");
const router = express.Router();

// update a user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json(error); // Fix typo here
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("account has been updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can update only your account");
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("account has been deleted");
    } catch (error) {
      res.status(500).json("error alert");
    }
  } else {
    res.status(403).json("you can delete only your account");
  }
});

// Get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    try {
      if (
        !user.followers.includes(req.body.userId) &&
        !currentUser.followings.includes(req.params.id)
      ) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cant follow your self");
  }
});

// Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    try {
      if (
        user.followers.includes(req.body.userId) &&
        currentUser.followings.includes(req.params.id)
      ) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you don't follow the user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cant follow your self");
  }
});

router.get("/friends/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(user){
     const friends = await Promise.all(
      user.followings.map((friendId)=> User.findById(friendId))
     )
      const friendList = friends.map((friend)=> ({
        _id:friend.id,
        username:friend.username,
        profilePic:friend.profilePic
      }))
      res.status(200).json(friendList)
    }
    else{
      res.status(400).json("user not found")
    }
  } catch (error) {
    res.status(500).json("friendsList Not Found")
  }
  
});

module.exports = router; // Corrected export
