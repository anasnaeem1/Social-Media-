const express = require("express");
const destination = require("../multerConfig/multerConfig");
const router = express.Router();

router.post("/", (req, res) => {
  destination(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "Uploading failed" });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Retrieve the unique file name
    const file = req.files[0];
    const uniqueFileName = file.uniqueFileName;

    res.status(200).json(uniqueFileName);
  });
});

module.exports = router;
