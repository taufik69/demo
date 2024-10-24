const mongoose = require("mongoose");
const { Schema } = mongoose;

const topNewsSchema = new Schema(
  {
    topNews: [
      {
        type: Schema.Types.ObjectId,
        ref: "News",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("topnews", topNewsSchema);
