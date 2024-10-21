const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
