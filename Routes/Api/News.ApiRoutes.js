const express = require("express");
const _ = express.Router();
const { upload } = require("../../Middleware/multer.middleware.js");
const {
  CreateNewsController,
  deleteNews,
  updateNewsController,
  getSingleNews,
  getAllNews,
  getAuthorAllNews,
} = require("../../Controller/News.Controller.js");
_.route("/news")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), CreateNewsController)
  .get(getAllNews);
_.route("/news/:id")
  .get(getSingleNews)
  .delete(deleteNews)
  .patch(upload.fields([{ name: "image", maxCount: 1 }]), updateNewsController);

_.route("/getAuthorAllNews/:id").get(getAuthorAllNews);

module.exports = _;
