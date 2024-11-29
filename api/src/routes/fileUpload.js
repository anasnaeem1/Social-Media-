const express = require("express");
const upload = require("../multerConfig/multerConfig");
const router = express.Router();

router.post("/uploads", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json("Uploading failed");
    }

    const file = req.files.find((f) => f.fieldname === "file"); // Extract the uploaded file
    const name = req.body.name; // Extract the filename

    console.log("File details:", file);
    console.log("Filename received:", name);

    if (!file || !name) {
      return res.status(400).json("File or filename missing");
    }

    res.status(200).json("File uploaded successfully");
  });
});

module.exports = router;
