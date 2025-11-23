import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routers/user.route.js';
import postRouter from './routers/post.route.js';
import commentRouter from './routers/comment.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Thay đổi thành domain frontend của bạn
  credentials: true, // Cho phép gửi cookie
}))
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});