require("dotenv").config();
const express = require("express");
const _ = express.Router();
const catagoryRoutes = require("./Api/catagory.ApiRoutes.js");
const NewsRoutes = require("./Api/News.ApiRoutes.js");
const topNewsRoutes = require("./Api/topNews.ApiRoutes.js");
const authorRoutes = require("./Api/author.ApiRoutes.js");
const superAdminRoutes = require("./Api/auth/superAdmin.auth.js");

const baseUrl = process.env.BASE_URL;
_.use(baseUrl, catagoryRoutes);
_.use(baseUrl, NewsRoutes);
_.use(baseUrl, topNewsRoutes);
_.use(baseUrl, authorRoutes);
_.use(baseUrl, superAdminRoutes);

_.use(baseUrl, (req, res) => {
  return res.status(400).json({
    success: false,
    data: null,
    error: `Routes is Missing or Invalid !!! `,
  });
});
module.exports = _;
