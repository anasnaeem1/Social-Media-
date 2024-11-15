import bcrypt from "bcrypt";
import express from "express";
import User from "../models/User.js";
const router = express.Router();

// update a user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.staus(500).json(err);
        // console.log(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("account has been updated");
    } catch (error) {
      // console.log(error);
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
      // console.log(error);
      res.status(500).json("error alert");
    }
  } else {
    // console.log("you can update delete your account");
    res.status(403).json("you can delete only your account");
  }
});

// Get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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

export default router;
