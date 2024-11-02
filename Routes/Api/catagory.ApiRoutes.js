const express = require("express");
const {
  createCatagory,
  GetAllCatagory,
  updateCatagory,
  deleteCatagory,
  getSingleCatagory,
} = require("../../Controller/Catagory.Controller");
const _ = express.Router();
_.route("/catagory").post(createCatagory).get(GetAllCatagory);
_.route("/update-catagory/:id").patch(updateCatagory);
_.route("/delete-catagory/:id").delete(deleteCatagory);
_.route("/get-catagory/:id").get(getSingleCatagory);
module.exports = _;
