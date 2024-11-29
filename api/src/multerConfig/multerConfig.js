// multerConfig.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const destPath = path.join(__dirname, "../public/images");
      cb(null, destPath);
    },
    filename: (req, file, cb) => {
      console.log(req.body.name)
    const uniqueName = req.body.name || "Anas"
    cb(null, uniqueName);
  },
});

const upload = multer({ storage }).any();

module.exports = upload;
