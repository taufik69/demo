const express = require("express");
const { PosttopNews } = require("../../Controller/topNews.Controller.js");
const _ = express.Router();

_.route("/topNews/:id").post(PosttopNews);

module.exports = _;
