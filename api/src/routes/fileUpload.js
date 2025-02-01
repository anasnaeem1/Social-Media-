const express = require("express");
const upload = require("../multerConfig/multerConfig"); // Import multer config
const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const uniqueFileName = req.file.filename;

  res.status(200).json({ fileName: uniqueFileName });
});

module.exports = router;
