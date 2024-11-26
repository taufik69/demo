const { json } = require("express");
const catagoryModel = require("../Model/catagory.model.js");
const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const createCatagory = async (req, res) => {
  try {
    const { Title } = req.body;
    if (!Title) {
      return res.status(401).json(new ApiError(401, null, "Missing Title"));
    }

    // check if catagory is already exist
    const isExistCatagory = await catagoryModel.find({ Title });

    if (isExistCatagory?.length) {
      return res
        .status(401)
        .json(
          new ApiError(401, null, `${Title} is Alrady Exist Try another One !!`)
        );
    }

    const saveCatagory = await new catagoryModel({
      Title,
    }).save();
    return res
      .status(201)
      .json(new ApiResponse(200, saveCatagory, "Catagory Create Successfull"));
  } catch (error) {
    return res.status(401).json(new ApiError(401, null, error.message));
  }
};

//get all catagory
const GetAllCatagory = async (req, res) => {
  try {
    const cachedCategory = myCache.get("category");
    if (cachedCategory == undefined) {
      const getAllCatagory = await catagoryModel.find({}).populate("News");

      myCache.set("category", JSON.stringify(getAllCatagory), 60 * 60);
      return res
        .status(201)
        .json(
          new ApiResponse(
            200,
            getAllCatagory,
            "All  Catagory getting Successfull"
          )
        );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          JSON.parse(cachedCategory),
          "All  Catagory getting Successfull (from chached)"
        )
      );
  } catch (error) {
    return res.status(401).json(new ApiError(401, null, error.message));
  }
};

//update catgory
const updateCatagory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateCatagoryById = await catagoryModel.findOneAndUpdate(
      { _id: id },
      {
        Title: req.body?.Title,
      },
      {
        new: true,
      }
    );
    if (!updateCatagoryById) {
      return res
        .status(401)
        .json(new ApiError(401, null, `${Title} Not Found in system`));
    }

    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          updateCatagoryById,
          `${req.body?.Title} Update SuccesFull `
        )
      );
  } catch (error) {
    return res.status(401).json(new ApiError(401, null, error.message));
  }
};

//delte catagory
const deleteCatagory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the category by ID
    const deletedCatagory = await catagoryModel
      .findOneAndDelete({ _id: id })
      .select("-_id");

    // Check if the category exists and was deleted
    if (!deletedCatagory) {
      return res
        .status(404)
        .json(new ApiError(404, null, `Category not found`));
    }

    // Return a success response
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedCatagory,
          `Category ${deletedCatagory.Title} deleted successfully`
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

// getSinglecatagory controller

const getSingleCatagory = async (req, res) => {
  try {
    const { id } = req.params;
    const getSingleCategory = myCache.get(`category${id}`);
    if (getSingleCategory == undefined) {
      // Find the category by ID
      const catagory = await catagoryModel
        .findById(id)
        .populate({
          path: "News",
          populate: {
            path: "author",
          },
        })
        .lean();

      // Reverse the populated News array
      if (catagory && catagory.News) {
        catagory.News.reverse();
      }

      myCache.set(`category${id}`, JSON.stringify(catagory));
      // Check if the category exists
      if (!catagory) {
        return res
          .status(404)
          .json(new ApiError(404, null, `Category not found`));
      }

      // Return the found category
      return res
        .status(200)
        .json(new ApiResponse(200, catagory, `Category fetched successfully`));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          JSON.parse(getSingleCategory),
          `Category fetched successfully (from cached)`
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};
module.exports = {
  createCatagory,
  GetAllCatagory,
  updateCatagory,
  deleteCatagory,
  getSingleCatagory,
};
