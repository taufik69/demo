const { default: mongoose } = require("mongoose");
const topNewsModel = require("../Model/TopNews.model.js");
const newsModel = require("../Model/News.model.js");
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
    const topNews = await topNewsModel.find({}).populate({
      path: "topNews",
      populate: ["author", "category"],
    });

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

// update topnews controller
const UpdateTopNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { newId } = req.body;

    // Check if the topNews document exists
    let topNewsDoc = await topNewsModel.findById(id);

    if (!topNewsDoc) {
      return res
        .status(404)
        .json(new ApiError(404, null, "TopNews document not found!"));
    }

    // Check if the new ID is already in the topNews array
    const isIdExist = topNewsDoc.topNews.includes(newId);

    if (isIdExist) {
      return res
        .status(400)
        .json(new ApiError(400, null, "This news is already in the topNews !"));
    }

    // If not, add the new ID to the array and save the document
    topNewsDoc.topNews.push(newId);
    await topNewsDoc.save();

    return res
      .status(200)
      .json(new ApiResponse(200, topNewsDoc, "TopNews updated successfully!"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

// delte top news
const DeleteTopNews = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the topNews document
    let topNewsDoc = await topNewsModel.findOne();

    if (!topNewsDoc) {
      return res
        .status(404)
        .json(new ApiError(404, null, "TopNews document not found!"));
    }

    // Find the index of the ID in the topNews array
    const index = topNewsDoc.topNews.indexOf(id);

    // If the ID doesn't exist in the array
    if (index === -1) {
      return res
        .status(404)
        .json(new ApiError(404, null, "ID not found in the topNews !"));
    }

    // Remove the ID from the array using splice
    topNewsDoc.topNews.splice(index, 1); // Remove 1 element at the found index

    // Save the updated document
    await topNewsDoc.save();

    return res
      .status(200)
      .json(new ApiResponse(200, topNewsDoc, "TopNews Deleted successfully!"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

const GetSingleTopNews = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the specific topNews to fetch

    // Find the topNews document by ID and populate the topNews array
    const topNewsDoc = await newsModel
      .findOne({ _id: id }) //this id is the news id
      .populate(["author", "category"]);

    if (!topNewsDoc) {
      return res
        .status(404)
        .json(new ApiError(404, null, "TopNews document not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, topNewsDoc, "TopNews fetched successfully!"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

module.exports = {
  PosttopNews,
  GetAllTopNews,
  UpdateTopNews,
  DeleteTopNews,
  GetSingleTopNews,
};
