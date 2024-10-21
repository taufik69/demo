const jwt = require("jsonwebtoken");
const Admin = require("../Model/auth.model");

const protect = async (req, res, next) => {
  let token;

  if (
    req.cookies?.Token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    try {
      token = req.headers.authorization?.split(" ")[1] || req.cookies?.Token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Admin.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorizeSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Access denied. Superadmin role required." });
  }
  next();
};

module.exports = { protect, authorizeSuperAdmin };
