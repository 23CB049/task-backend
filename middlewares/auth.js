import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new ErrorHandler("User not found", 401));
      }
      
      req.user = user;
      next();
    } catch (error) {
      return next(new ErrorHandler("Invalid or expired token", 401));
    }
  } catch (error) {
    return next(new ErrorHandler("Authentication error", 401));
  }
});
