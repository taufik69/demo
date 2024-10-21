const authorModel = require("../Model/auhor.model.js");
const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const createAuthor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(401)
        .json(new ApiError(401, null, "Missing Author Information"));
    }

    // check if catagory is already exist
    const isExistauthor = await authorModel.find({ name });

    if (isExistauthor?.length) {
      return res
        .status(401)
        .json(
          new ApiError(401, null, `${name} is Alrady Exist Try another One !!`)
        );
    }

    const saveauthor = await new authorModel({
      name,
    }).save();
    return res
      .status(201)
      .json(new ApiResponse(200, saveauthor, "Author Create Successfull"));
  } catch (error) {
    return res.status(401).json(new ApiError(401, null, error.message));
  }
};

//get all Author
const GetAllAutor = async (req, res) => {
  try {
    const getAllAuthor = await authorModel.find({});

    res
      .status(201)
      .json(
        new ApiResponse(200, getAllAuthor, "All Author getting Successfull")
      );
  } catch (error) {
    return res.status(401).json(new ApiError(401, null, error.message));
  }
};

//update author
const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updateAuthor = {
      ...(name && { name }),
    };
    const updateAuthorById = await authorModel.findOneAndUpdate(
      { _id: id },
      updateAuthor,
      {
        new: true,
      }
    );

    if (!updateAuthorById) {
      return res
        .status(401)
        .json(new ApiError(401, null, `${name} Not Found in system`));
    }

    res
      .status(201)
      .json(
        new ApiResponse(200, updateAuthorById, `${name} Update SuccesFull `)
      );
  } catch (error) {
    return res.status(401).json(new ApiError(401, null, error.message));
  }
};

//delte author
const deleteauthor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the category by ID
    const deletedauthor = await authorModel
      .findOneAndDelete({ _id: id })
      .select("-_id");

    // Check if the category exists and was deleted
    if (!deletedauthor) {
      return res
        .status(404)
        .json(new ApiError(404, null, `Author not found to delete`));
    }

    // Return a success response
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedauthor,
          `Category ${deletedauthor.title} deleted successfully`
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

// getSinglecatagory controller

const getSingleAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the author by ID
    const author = await authorModel.findById(id);

    // Check if the author exists
    if (!author) {
      return res
        .status(404)
        .json(new ApiError(404, null, `Category not found`));
    }

    // Return the found author
    res
      .status(200)
      .json(new ApiResponse(200, author, `author get successfully`));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};
module.exports = {
  createAuthor,
  GetAllAutor,
  updateAuthor,
  deleteauthor,
  getSingleAuthor,
};
