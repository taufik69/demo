const mongoose = require("mongoose");
const { Schema } = mongoose;

const NewsSchema = new Schema(
  {
    HeadLine: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "author",
    },
    StandFirst: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    NewsBody: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
