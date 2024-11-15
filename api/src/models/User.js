import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // Fixed 'require' to 'required'
      min: 3,
      max: 20,
      unique: true, // Fixed 'uniqw' to 'unique'
    },
    email: {
      type: String,
      required: true, // Fixed 'require' to 'required'
      max: 50,
      unique: true, // Fixed 'uniqw' to 'unique'
    },
    password: {
      type: String,
      required: true, // Fixed 'require' to 'required'
      min: 6,
    },
    coverPic: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [], // Changed from "" to []
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
