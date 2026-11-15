module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({
      success: false,
      message: "Not authorized",
    });
  }

  if (req.user.userType !== "admin") {
    return res.status(403).send({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};
