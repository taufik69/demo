const mongoose = require("mongoose");
const { Schema } = mongoose;

const topNewsSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    standTime: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("topnews", topNewsSchema);
