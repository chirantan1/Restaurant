const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).send({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  const token = auth.split(" ")[1];
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Not authorized, token missing",
    });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { ...decoded, id: decoded.id || decoded._id };

    const user = await User.findById(req.user.id).select("isBlocked");
    if (user && user.isBlocked) {
      return res.status(403).send({
        success: false,
        message: "Your account has been blocked",
      });
    }

    next();
  } catch (err) {
    console.log("JWT verify error:", err.message);
    return res.status(401).send({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};
