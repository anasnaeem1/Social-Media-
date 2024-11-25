const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const connectDB = require("./db/index.js");
const userRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const postRouter = require("./routes/post.js");
// const { console } = require("inspector");

// Configure environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;

// Middleware
app.use(express.json());
app.use(morgan("common"));
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the correct frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// File upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    // console.error(error);
    return res.status(500).json("Something went wrong");
  }
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

// Database connection
connectDB(process.env.MONGO_URI);

// Server start
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
