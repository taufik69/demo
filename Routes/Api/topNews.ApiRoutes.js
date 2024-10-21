const express = require("express");
const { PosttopNews } = require("../../Controller/topNews.Controller.js");
const _ = express.Router();

_.route("/topNews").post(PosttopNews);

module.exports = _;
