const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (!isCloudinaryConfigured()) {
  console.error("Cloudinary configuration is missing. Please check your .env file.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

router.post("/uploads", async (req, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(500).json({ error: "Cloudinary configuration is missing" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file; 
    console.log("Uploaded file:", file); 

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "uploads",
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

module.exports = router;