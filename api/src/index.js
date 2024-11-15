import express from "express";
const app = express();
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/index.js";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/posts.js";

const PORT = process.env.PORT || 8800;

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// app.use("/", (req, res)=> {
//     res.send("Home Page")
// })


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

connectDB(process.env.MONGO_URI);

app.listen(8800, () => {
  console.log(`backend server is running! on ${PORT} `);
});
