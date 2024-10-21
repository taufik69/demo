const mongoose = require("mongoose");
const { Schema } = mongoose;

const catagorySchema = new Schema(
  {
    Title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    News: [
      {
        type: Schema.Types.ObjectId,
        ref: "News",
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("category", catagorySchema);
