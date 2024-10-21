require("dotenv").config();
const { DbConnection } = require("../src/Database/index.js");
const { app } = require("./app.js");

DbConnection()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server Running on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MONGODB CONNECTION  ERROR !!! ${err}`);
  });
