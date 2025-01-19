const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./src/db/index.js");
const userRouter = require("./src/routes/users.js");
const authRouter = require("./src/routes/auth.js");
const postRouter = require("./src/routes/post.js");
const uploadRouter = require("./src/routes/fileUpload.js");
const deleteRouter = require("./src/routes/fileDelete.js");
const convosRouter = require("./src/routes/convos.js");
const commentsRouter = require("./src/routes/comments.js");
const commentReplies = require("./src/routes/commentReplies.js");
const messagesRouter = require("./src/routes/messages.js");
const search = require("./src/routes/search.js");
const { readFileSync } = require("fs");
// const { console } = require("inspector");

// Configure environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8801;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB(process.env.MONGO_URI);
const STATIC_PATH = path.join(process.cwd(), "./frontendDist");

app.use(express.static(STATIC_PATH));

// Middleware

app.use(morgan("common"));
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use("/images", express.static(path.join(__dirname, "./src/public/images")));
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "https://social-media-self-beta.vercel.app/",
// ];

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/convos", convosRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/commentsReplies", commentReplies);
app.use("/api/search", search);
app.use("/api/messages", messagesRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/delete", deleteRouter);

app.use("/*", async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(path.join(STATIC_PATH, "index.html")));
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
