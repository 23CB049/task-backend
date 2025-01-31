import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnection } from "./database/dbConnection.js";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import taskRouter from "./routes/taskRouter.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Global cookie settings
app.use((req, res, next) => {
  const originalCookie = res.cookie;
  res.cookie = function (name, value, options = {}) {
    return originalCookie.call(this, name, value, {
      ...options,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" 
        ? ".onrender.com"  // Adjust this to match your domain
        : "localhost",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  };
  next();
});

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

// Database connection
dbConnection();

// Error handling
app.use(errorMiddleware);

export default app;