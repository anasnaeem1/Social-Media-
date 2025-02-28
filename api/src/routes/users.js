const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/User.js");
const { set } = require("mongoose");
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
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json(req.body);
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

router.get("/mutuals", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    // Fetch the current user based on userId or username
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendsId = user.followers.filter((follower) =>
      user.followings.includes(follower)
    );
    const friends = await Promise.all(
      friendsId.map(async (id) => {
        const user = await User.findById(id);
        return user;
      })
    );

    // Collect all the users that friends follow (mutuals)
    const mutualsSet = new Set();
    friends.forEach(async(friend) => {
      if (friend && friend.followings) {
        const mutualsIds = friend.followers.filter((follower) =>
          friend.followings.includes(follower)
        );
        const mutualFriends = await Promise.all(
          mutualsIds.map(async (id) => {
            const user = await User.findById(id);
            return user;
          })
        );
      }
    });

    // Sanitize the mutual friends' data
    const sanitizedMutuals = mutualFriends
      .filter((mutual) => mutual)
      .map(({ _doc }) => {
        const { password, updatedAt, ...rest } = _doc;
        return rest;
      });

    res.status(200).json(sanitizedMutuals);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch mutual friends",
      details: error.message,
    });
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
    if (user) {
      const followers = user?.followers;

      // Filter followers who are not in the followings set
      const friendsId = followers.filter((follower) =>
        user.followings.includes(follower)
      );
      const friends = await Promise.all(
        friendsId.map(async (id) => {
          const user = await User.findById(id);
          return user;
        })
      );
      res.status(200).json(friends);
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
      const todayMonthDay = `${today.getDate()}/${today.getMonth() + 1}`; // "17/2"
      console.log(todayMonthDay);

      // Filter friends with matching DOBs
      const birthdayFriends = friends.filter((friend) => {
        if (!friend.DOB) return false; // Ensure DOB exists
        const [day, month] = friend.DOB.split("/"); // Assuming stored as "17/2/2004"
        console.log(`${day}/${month}`);
        return `${day}/${month}` === todayMonthDay;
      });

      const friendList = birthdayFriends.map((friend) => ({
        _id: friend.id,
        username: friend.username,
        fullname: friend.fullname,
        profilePic: friend.profilePic,
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

// get all users
router.get("/allUsers", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
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
