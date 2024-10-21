const {
  cloudinaryFileUpload,
  deleteCloudinaryFile,
} = require("../Utils/cloudinary.js");
const NewsModel = require("../Model/News.model.js");
const catagoryModel = require("../Model/catagory.model.js");
const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");

const CreateNewsController = async (req, res) => {
  try {
    const { HeadLine, author, StandFirst, NewsBody, category } = req.body;
    const image = req.files?.image;
    if (!HeadLine || !author || !StandFirst || !NewsBody || !category) {
      return res
        .status(401)
        .json(new ApiError(401, null, ` News Information Missing !!`));
    }
    // check if TopNews is already exist
    const isExistNews = await NewsModel.find({ $or: [{ HeadLine }] });

    if (isExistNews?.length) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            null,
            `${HeadLine} is Alrady Exist Upload another One !!`
          )
        );
    }

    const uploadResult = await cloudinaryFileUpload(image[0]?.path);
    const uploadtopNewsContent = await new NewsModel({
      HeadLine,
      author,
      StandFirst,
      NewsBody,
      category,
      image: uploadResult?.secure_url,
    }).save();

    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          uploadtopNewsContent,
          "upload NewsContent Successfull"
        )
      );

    //Now update the cagory db
    const getCatagory = await catagoryModel.find({ _id: category });
    if (!getCatagory) {
      return null;
    }
    await catagoryModel.findOneAndUpdate(
      { _id: category },
      { $push: { News: uploadtopNewsContent._id } },
      { new: true }
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

// delete Top new with params
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTopNews = await NewsModel.findOneAndDelete({ _id: id });

    if (!deleteTopNews) {
      return null;
    }
    const delteFile = deleteTopNews?.image?.split("/").slice(-2).join("/");
    await deleteCloudinaryFile(delteFile.split(".")[0]);

    await catagoryModel
      .findOneAndUpdate(
        {
          _id: deleteTopNews?.category,
        },
        {
          $pull: {
            News: id,
          },
        },
        {
          new: true,
        }
      )
      .select("-_id");
    return res
      .status(201)
      .json(
        new ApiResponse(200, deleteTopNews, "News Content Delete Successfull")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

//update the top news
const updateNewsController = async (req, res) => {
  try {
    const { id } = req.params;
    const { HeadLine, author, StandFirst, NewsBody, category } = req.body;
    const image = req.files?.image;

    // Check if the news item exists
    const isExistNews = await NewsModel.findById(id);
    if (!isExistNews) {
      return res
        .status(404)
        .json(new ApiError(404, null, `Top News with ID: ${id} not found!`));
    }

    // If there is an image, upload to Cloudinary
    let uploadResult = null;
    if (image && image.length > 0) {
      uploadResult = await cloudinaryFileUpload(image[0]?.path);
    }

    // Update the fields only if they are provided in the request body
    const updateFields = {
      ...(HeadLine && { HeadLine }),
      ...(author && { author }),
      ...(StandFirst && { StandFirst }),
      ...(NewsBody && { NewsBody }),
      ...(category && { category }),
      ...(uploadResult?.secure_url && { image: uploadResult.secure_url }),
    };
    const removeCategory = await NewsModel.findById(id);

    const updatedTopNews = await NewsModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    // If Top News is updated successfully, update the category as well
    if (category) {
      await catagoryModel.findOneAndUpdate(
        {
          _id: removeCategory?.category,
        },
        {
          $pull: { News: id },
        },
        { new: true }
      );
      const getCategory = await catagoryModel.findById(updatedTopNews.category);
      if (getCategory) {
        //insert new id into new catagory
        const updateCategory = await catagoryModel.findOneAndUpdate(
          { _id: category },
          { $push: { News: updatedTopNews._id } },
          { new: true }
        );
      }
    }

    // Return the updated news content
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedTopNews, " News updated successfully!")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

// get single getSingleTopNews
const getSingleNews = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the TopNews by id
    const topNews = await NewsModel.findById(id).populate([
      "category",
      "author",
    ]);

    if (!topNews) {
      return res
        .status(404)
        .json(new ApiError(404, null, `Top News with ID ${id} not found`));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, topNews, "Top News fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

//get all news
const getAllNews = async (req, res) => {
  try {
    const AllNews = await NewsModel.find({}).populate(["category", "author"]);
    console.log(AllNews);

    if (AllNews) {
      return res
        .status(200)
        .json(new ApiResponse(200, AllNews, "All News  fetched successfully"));
    }
    return res.status(404).json(new ApiError(404, null, `All News not found`));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

const getAuthorAllNews = async (req, res) => {
  try {
    const { id } = req.params;
    const authorNews = await NewsModel.find({ author: id }).populate({
      path: "author",
    });
    if (authorNews?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            authorNews,
            "Authol All News fetched successfully"
          )
        );
    }
    return res
      .status(404)
      .json(new ApiError(404, null, `All Author News not found`));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
};

module.exports = {
  CreateNewsController,
  deleteNews,
  updateNewsController,
  getSingleNews,
  getAllNews,
  getAuthorAllNews,
};
