import express from "express";
const router = express.Router();
import User from "../models/User.js";
import bcrypt from "bcrypt";

router.post("/register", async (req, res) => {
  try {
    // Register
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(error)
  }
});

//LOG IN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("404 User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    res.status(200).json(user)
  } catch (error) {
  res.status(500).json(error)
  }
});

export default router;
