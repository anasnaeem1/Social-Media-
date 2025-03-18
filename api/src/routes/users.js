const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/User.js");
const { set } = require("mongoose");
const FollowReq = require("../models/FollowReq.js");
const router = express.Router();

const getUserFriends = async (user) => {
  const friendsId = user.followers.filter((follower) =>
    user.followings.includes(follower)
  );

  const userFriends = await Promise.all(
    friendsId.map(async (id) => {
      const user = await User.findById(id);
      return user;
    })
  );
  return userFriends;
};

const isUserFollowed = async (currentUserId, otherUserId) => {
  try {
    // Fetch the current user and their followings list
    const currentUser = await User.findById(currentUserId).select("followings");
    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // Fetch the other user and their followers list
    const otherUser = await User.findById(otherUserId).select("followers");
    if (!otherUser) {
      throw new Error("Other user not found");
    }

    // Ensure the fields are arrays
    if (!Array.isArray(currentUser.followings)) {
      throw new Error("Current user's 'followings' field is not an array");
    }
    if (!Array.isArray(otherUser.followers)) {
      throw new Error("Other user's 'followers' field is not an array");
    }

    // Check if the current user is following the other user
    const isFollowed =
      currentUser.followings.includes(otherUserId) &&
      otherUser.followers.includes(currentUserId);

    return isFollowed;
  } catch (error) {
    console.error("Error in isUserFollowed:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

// update a user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // Hash password if it exists in the request
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    // Filter out null or undefined fields from req.body
    const filteredBody = Object.fromEntries(
      Object.entries(req.body).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: filteredBody,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can update only your account");
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

router.get("/mutuals", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userFriends = await getUserFriends(user);

    const mutualsMap = new Map();

    await Promise.all(
      userFriends.map(async (friend) => {
        if (friend && friend.followers && friend.followings) {
          const mutualsIds = friend.followers.filter((follower) =>
            friend.followings.includes(follower)
          );

          // Fetch mutual friends' details
          const mutualFriends = await Promise.all(
            mutualsIds.map(async (id) => {
              const user = await User.findById(id);
              return user;
            })
          );

          mutualFriends.forEach((singleFriend) => {
            if (singleFriend) {
              const isFollowed = user.followings.includes(singleFriend._id);
              mutualsMap.set(singleFriend._id.toString(), {
                ...singleFriend.toObject(), // Convert Mongoose document to plain object
                isFollowed,
              });
            }
          });
        }
      })
    );

    // Convert the Map to an array and sanitize the data
    const sanitizedMutuals = Array.from(mutualsMap.values())
      .filter((mutual) => mutual)
      .map((mutual) => {
        const { password, updatedAt, ...rest } = mutual;
        return rest;
      });

    res.status(200).json(sanitizedMutuals);
  } catch (error) {
    console.error("Error fetching mutual friends:", error);
    res.status(500).json({
      error: "Failed to fetch mutual friends",
      details: error.message,
    });
  }
});

// Follow a user
router.put("/:id/follow", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user || !currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const isCurrentUserFollowUser = await isUserFollowed(
        currentUser._id,
        user._id
      );

      if (!isCurrentUserFollowUser) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        const isUserFollowCurrentUser = await isUserFollowed(
          user._id,
          currentUser._id
        );

        if (isUserFollowCurrentUser) {
          const deleteResult = await FollowReq.deleteOne({
            senderId: user._id.toString(),
            receiverId: currentUser._id.toString(),
          });
          return res.status(200).json({
            message: "User has been followed.",
            requestSent: false,
          });
        } else {
          const newFollowReq = new FollowReq({
            senderId: currentUser._id,
            receiverId: user._id,
          });
          const savedFollowReq = await newFollowReq.save();

          return res.status(200).json({
            message: "User has been followed. Follow request sent.",
            requestSent: true,
            followRequest: savedFollowReq,
          });
        }
      } else {
        return res
          .status(403)
          .json({ message: "You already follow this user" });
      }
    } else {
      return res.status(403).json({ message: "You can't follow yourself" });
    }
  } catch (error) {
    console.error("Error in follow route:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user || !currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the current user follows the other user
      const isCurrentUserFollowUser = await isUserFollowed(
        currentUser._id,
        user._id
      );

      if (isCurrentUserFollowUser) {
        // Unfollow the user
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });

        // Find the follow request
        const followReq = await FollowReq.findOne({
          senderId: currentUser._id.toString(),
          receiverId: user._id.toString(),
        });
        if (!followReq) {
          return res.status(200).json({
            message: "User has been unfollowed.",
            deletedFollowReq: false,
          });
        } else {
          console.log("Follow Request ID to Delete:", followReq._id);

          const deleteResult = await FollowReq.deleteOne({
            _id: followReq._id,
          });

          console.log("Deletion Result:", deleteResult);

          if (deleteResult.deletedCount === 1) {
            return res.status(200).json({
              message: "User has been unfollowed and follow request canceled.",
              deletedFollowReq: true,
            });
          } else {
            return res.status(500).json({
              message: "Failed to delete follow request.",
              deletedFollowReq: false,
            });
          }
        }
      } else {
        return res.status(403).json({ message: "You don't follow this user" });
      }
    } catch (error) {
      console.error("Error in unfollow route:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  } else {
    return res.status(403).json({ message: "You can't unfollow yourself" });
  }
});

router.get("/friends/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const userFriends = await getUserFriends(user);
      res.status(200).json(userFriends);
    } else {
      res.status(400).json("user not found");
    }
  } catch (error) {
    res.status(500).json("friendsList Not Found");
  }
});

router.get("/birthdayFriends/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const friends = await Promise.all(
        user.followings.map((friendId) => User.findById(friendId))
      );

      const today = new Date();
      const todayMonthDay = `${today.getDate()}/${today.getMonth() + 1}`;
      console.log(todayMonthDay);

      const birthdayFriends = friends.filter((friend) => {
        if (!friend.DOB) return false;
        const [day, month] = friend.DOB.split("/");
        console.log(`${day}/${month}`);
        return `${day}/${month}` === todayMonthDay;
      });

      const friendList = birthdayFriends.map((friend) => ({
        _id: friend.id,
        username: friend.username,
        fullname: friend.fullname,
        profilePic: friend.profilePic,
        DOB: friend.DOB,
      }));

      if (friendList.length > 0) {
        res.status(200).json(friendList);
      } else {
        res.status(200).json("No friends with a birthday today");
      }
    } else {
      res.status(400).json("User not found");
    }
  } catch (error) {
    res.status(500).json("Friends list not found");
  }
});

// get all followRequest
router.get("/followRequests/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const followers = user?.followers;

    // Filter followers who are not in the followings set
    const followRequestIds = followers.filter(
      (follower) => !user.followings.includes(follower)
    );

    // Fetch user details for each follow request
    const followRequests = await Promise.all(
      followRequestIds.map(async (id) => {
        const user = await User.findById(id);
        return user;
      })
    );

    res.status(200).json(followRequests);
  } catch (error) {
    console.error("Error fetching follow requests:", error);
    res.status(500).json({
      success: false,
      message: "Fetching follow requests failed",
      error: error.message,
    });
  }
});

// get all users except friends
router.get("/allUsers/:userId", async (req, res) => {
  ``;
  try {
    const currentUser = await User.findById(req.params.userId);
    const allUsers = await User.find({});

    if (currentUser && allUsers) {
      const filteredUsers = allUsers.filter((singleUser) => {
        return !currentUser.followings.includes(singleUser._id);
      });

      const sanitizedUsers = filteredUsers.map((singleUser) => {
        const { password, ...userData } = singleUser.toObject();
        return userData;
      });
      const withoutCurrentUser = sanitizedUsers.filter((user) => {
        user._id !== currentUser._id;
      });

      res.status(200).json(withoutCurrentUser);
    } else {
      res.status(404).json({ message: "User not found or no users available" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get user mutuals
router.get("/userMutuals", async (req, res) => {
  try {
    const { userId, currentUserId } = req.query;

    const user = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!user || !currentUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    const currentUserFriends = await getUserFriends(currentUser);
    const userFriends = await getUserFriends(user);
    const mutualFriends = currentUserFriends.filter((currentUserFriend) =>
      userFriends.some((userFriend) =>
        userFriend._id.equals(currentUserFriend._id)
      )
    );

    res.status(200).json(mutualFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
