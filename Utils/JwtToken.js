const jwt = require("jsonwebtoken");

const generateToken = async (userInfo) => {
  return await jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { generateToken };
