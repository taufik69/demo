const express = require("express");
const _ = express.Router();
const {
  createAuthor,
  GetAllAutor,
  updateAuthor,
  deleteauthor,
  getSingleAuthor,
} = require("../../Controller/author.Controller.js");
_.route("/author").post(createAuthor).get(GetAllAutor);
_.route("/author/:id")
  .patch(updateAuthor)
  .delete(deleteauthor)
  .get(getSingleAuthor);

module.exports = _;
