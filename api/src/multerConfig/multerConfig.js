const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destPath = path.join(__dirname, "../public/images");
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    file.uniqueFileName = uniqueFileName; 
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage }).any();

module.exports = upload;
