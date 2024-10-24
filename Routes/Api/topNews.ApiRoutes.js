const express = require("express");
const {
  PosttopNews,
  GetAllTopNews,
  UpdateTopNews,
  DeleteTopNews,
} = require("../../Controller/topNews.Controller.js");
const _ = express.Router();

_.route("/topNews/:id").post(PosttopNews);
_.route("/get-all-topNews").get(GetAllTopNews);
_.route("/update-topNews/:id").patch(UpdateTopNews);
_.route("/delete-topNews/:id").delete(DeleteTopNews);

module.exports = _;
