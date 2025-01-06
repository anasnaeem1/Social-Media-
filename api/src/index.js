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
const deleteRouter = require("./routes/fileDelete.js");
const convosRouter = require("./routes/convos.js");
const commentsRouter = require("./routes/comments.js");
const commentRepliesRouter = require("./routes/commentRepliesRouter.js");
const messagesRouter = require("./routes/messages.js");
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
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/convos", convosRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/commentsReplies", commentRepliesRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/delete", deleteRouter);


app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
