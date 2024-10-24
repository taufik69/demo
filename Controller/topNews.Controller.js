const { default: mongoose } = require("mongoose");
const topNewsModel = require("../Model/TopNews.model.js");
const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const PosttopNews = async (req, res) => {
  try {
    const { id } = req.params;
    const isExistTopNews = await topNewsModel.findOne({
      // topNews: {
      //   $elemMatch: { $eq: id },
      // },
      topNews: id,
    });
    if (isExistTopNews) {
      return res
        .status(401)
        .json(new ApiError(401, null, `TopNews Is Already Exist !!`));
    }
    // Create a new instance of the topnews model
    const newTopNews = new topNewsModel({
      topNews: [id],
    });

    await newTopNews.save();
    if (newTopNews) {
      return res
        .status(200)
        .json(new ApiResponse(200, newTopNews, "TopNews Create successfully!"));
    }
    return res
      .status(401)
      .json(new ApiError(401, null, "TopNews Create Failed"));
  } catch (error) {
    return res.status(401).json(new ApiError(401, null, error.message));
  }
};

const GetAllTopNews = async (req, res) => {
  try {
    // Find the topNews document by id and populate the topNews array
    const topNews = await topNewsModel.find({}).populate("topNews");

    if (!topNews) {
      return res
        .status(404)
        .json(new ApiError(404, null, "TopNews not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, topNews, "TopNews fetched successfully!"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

module.exports = { PosttopNews, GetAllTopNews };
