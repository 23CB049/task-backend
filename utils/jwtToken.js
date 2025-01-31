export const sendToken = (message, user, res, statusCode) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" 
      ? ".onrender.com"  // Adjust this to match your domain
      : "localhost",
  };

  // Remove sensitive information from user object
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user: sanitizedUser,
  });
};