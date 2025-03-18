const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Delete route for removing files from the public/images directory
router.delete("/:filename", (req, res) => {
  const { filename } = req.params;

  const filePath = path.join(__dirname, "../public/images", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err.message);
      return res.status(500).json({ error: "File deletion failed" });
    }

    res.status(200).json({ message: "File successfully deleted" });
  });
});

module.exports = router;
