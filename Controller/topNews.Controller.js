const { default: mongoose } = require("mongoose");
const topNewsModel = require("../Model/TopNews.model.js");
const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const PosttopNews = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the topNews document exists
    let topNewsDoc = await topNewsModel.findOne();

    if (topNewsDoc) {
      // Check if the ID is already in the array
      const isIdExist = topNewsDoc.topNews.includes(id);

      if (isIdExist) {
        return res
          .status(401)
          .json(new ApiError(401, null, `TopNews Is Already Exist !!`));
      }

      // Push the new id into the topNews array and save
      topNewsDoc.topNews.push(id);
      await topNewsDoc.save();

      return res
        .status(200)
        .json(
          new ApiResponse(200, topNewsDoc, "TopNews updated successfully!")
        );
    } else {
      // If no topNews document exists, create a new one with the provided ID
      const newTopNews = new topNewsModel({
        topNews: [id],
      });

      await newTopNews.save();

      return res
        .status(200)
        .json(
          new ApiResponse(200, newTopNews, "TopNews created successfully!")
        );
    }
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

const GetAllTopNews = async (req, res) => {
  try {
    // Find all topNews documents and populate the topNews array, sort by 'createdAt' in descending order
    const topNews = await topNewsModel.find({}).populate("topNews");

    if (!topNews || topNews?.length === 0) {
      return res
        .status(404)
        .json(new ApiError(404, null, "TopNews not found!"));
    }

    // Reverse the 'topNews' array inside each document
    topNews.forEach((doc) => {
      doc.topNews.reverse();
    });

    return res
      .status(200)
      .json(new ApiResponse(200, topNews, "TopNews fetched successfully!"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

module.exports = { PosttopNews, GetAllTopNews };
