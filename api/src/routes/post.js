const express = require("express");
const router = express.Router();
const Post = require("../models/Post.js");
// import User from "../routes/users.js"
const User = require("../models/User.js");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//upload a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The post has been updated");
    } else {
      res.status(403).json("You can update only your posts");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete a post
router.delete("/deletePost/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.query.userId;

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId === userId) {
      const deletedPost = await Post.findByIdAndDelete(post._id);
      return res
        .status(200)
        .json({ message: "Post deleted successfully", deletedPost });
    } else {
      return res
        .status(403)
        .json({ message: "You can delete only your posts" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

//like/dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      try {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("liked a post");
      } catch (error) {
        res.status(500).json;
      }
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("unliked a post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a post
router.get("/getPost/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { updatedAt, ...others } = post._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const freindPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...freindPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user's all posts
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
    const pinnedPosts = posts.filter((post) => post.pinned);
    const notPinnedPosts = posts.filter((post) => !post.pinned);
    const sortedPosts = [...pinnedPosts, ...notPinnedPosts];
    res.status(200).json(sortedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get user top 3 recent posts
router.get("/topThreeRecentPosts/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    // console.log(user)
    const posts = await Post.find({ userId: user._id });
    const recentPosts = posts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const topThreeRecentPosts = recentPosts.slice(0, 3);
    res.status(200).json(topThreeRecentPosts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
