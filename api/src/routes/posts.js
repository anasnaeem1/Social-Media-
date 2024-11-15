import express from "express";
const router = express.Router();
import Post from "../models/Post.js";
// import User from "../routes/users.js"
import User from "../models/User.js";

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
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userId === req.params.id) {
      await Post.deleteOne(post);
      res.status(200).json("The post has been deleted");
    } else {
      res.status(403).json("You can delete only your posts");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//like a post
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

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { updatedAt, ...others } = post._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get timeline posts
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const freindPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...freindPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
