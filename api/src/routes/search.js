const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const router = express.Router();

router.get("/user/:searchInputForUsers", async (req, res) => {
  try {
    const searchInput = req.params.searchInputForUsers;

    const searchedUsers = await User.find({
      username: { $regex: `^${searchInput}`, $options: "i" }, // Match names starting with searchInput
    });

    if (searchedUsers.length > 0) {
      res.status(200).json(searchedUsers);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "Searching failed", error: error.message });
  }
});

router.get("/post/:searchInputForPost", async (req, res) => {
  try {
    const searchInput = req.params.searchInputForPost;

    const searchedPostDesc = await Post.find({
      desc: { $regex: searchInput, $options: "i" },
    })

    if (searchedPostDesc.length > 0) {
      res.status(200).json(searchedPostDesc);
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "Searching failed", error: error.message });
  }
});


// // Geting User DOB and some info
// router.get("/:id/DOB", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (user) {
//       const userInfo = {
//         DOB: user.DOB,
//         username: user.username,
//         profilePic: user.profilePic,
//         createdAt: user.createdAt,
//       };
//       res.status(200).json(userInfo);
//     } else {
//       res.status(400).json("user not found");
//     }
//   } catch (error) {
//     res.status(500).json("friendsList Not Found");
//   }
// });

module.exports = router;
