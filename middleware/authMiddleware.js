const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("No token provided.");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).send("Failed to authenticate token.");
  }
};
export default authMiddleware;
