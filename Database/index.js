const mongoose = require("mongoose");
const { dbName } = require("../constants");

const DbConnection = async () => {
  try {
    const databaseInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}/${dbName}`
    );
    console.log(
      `Database Connection Successfull ${databaseInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Database Connection Error ${error}`);
  }
};

module.exports = { DbConnection };
