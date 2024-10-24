const express = require("express");
const {
  PosttopNews,
  GetAllTopNews,
} = require("../../Controller/topNews.Controller.js");
const _ = express.Router();

_.route("/topNews/:id").post(PosttopNews);
_.route("/get-all-topNews").get(GetAllTopNews);

module.exports = _;
