const adminMiddleware = async (req, res, next) => {
  const user = req.user;
  if (user.role == "ADMIN") {
    next();
  } else {
    return res
      .status(403)
      .send("Access denied. User does not have ADMIN role.");
  }
};
export default adminMiddleware;
