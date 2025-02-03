const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: "datcr1zua",
  api_key: "252361716913516",
  api_secret: "iIeFjHzkowTaCSN07ygz5J7D7rM",
});

router.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

router.post("/uploads", async (req, res) => {
  try {
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
