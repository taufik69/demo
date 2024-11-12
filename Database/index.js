const mongoose = require("mongoose");
const { dbName } = require("../constants");

const DbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000, // 10 seconds connection timeout
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for selecting MongoDB server
    });
    console.log("Database Connection Successful");
  } catch (error) {
    console.error("Database Connection Error:", error);
  }
};

// const DbConnection = async () => {
//   mongoose
//     .connect(`${process.env.DATABASE_URL}/${dbName}`)
//     .then((databaseInstance) => {
//       console.log(`Database Connection Successfull `);
//     })
//     .catch((error) => {
//       console.log(`Database Connection Error ${error}`);
//     });
// };
module.exports = { DbConnection };
