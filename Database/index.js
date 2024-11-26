const mongoose = require("mongoose");
const { dbName } = require("../constants");

const DbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}/${dbName}`);
    console.log("Database Connection Successful");
  } catch (error) {
    console.error("Database Connection Error:", error);
  }
};

module.exports = { DbConnection };
