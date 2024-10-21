const topNewsModel = require("../Model/TopNews.model.js");

const PosttopNews = async () => {
  try {
    const { heading, author, standTime, body } = req.body;
    if (!heading || !author || !standTime || !body) {
      return res
        .status(401)
        .json(new ApiError(401, null, "Missing latestNews credintial !!"));
    }
    const uploadTopNews = await new topNewsModel({
      heading,
      author,
      standTime,
      body,
    }).save();
    if (uploadTopNews) {
      return res
        .status(201)
        .json(new ApiResponse(200, saveCatagory, "TopNews Upload Successfull"));
    }
    return res
      .status(401)
      .json(new ApiError(401, null, `TopNews upload Failed !!`));
  } catch (error) {
    return res.status(401).json(new ApiError(401, null, error.message));
  }
};

module.exports = { PosttopNews };
