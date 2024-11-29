const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db/index.js");
const userRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const postRouter = require("./routes/post.js");
const uploadRouter = require("./routes/fileUpload.js");
// const { console } = require("inspector");

// Configure environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB(process.env.MONGO_URI);

// Middleware

app.use(morgan("common"));
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use("/images", express.static(path.join(__dirname, "./public/images")));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/users", userRouter);  
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api", uploadRouter); // Mount the upload router

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
