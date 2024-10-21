const bcrypt = require("bcrypt");
const generateBrcypt = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating superadmin bcrypt password", error });
  }
};

const compareCheckPassword = async (plainpassword, haspassword) => {
  return await bcrypt.compare(plainpassword, haspassword);
};
module.exports = { generateBrcypt, compareCheckPassword };
