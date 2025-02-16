const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    // Register
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      username: req.body.username,
      fullname: req.body.fullname,
      DOB: req.body.DOB,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOG IN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("404 User not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
