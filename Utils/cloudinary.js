const cloudinary = require("cloudinary").v2;
const fs = require("fs");
//cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRECT,
  secure: true,
});

const cloudinaryFileUpload = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(
      localFilePath ||
        "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        resource_type: "auto",
        folder: "topNews",
      }
    );
    if (uploadResult) {
      fs.unlinkSync(localFilePath);
    }
    return uploadResult;
  } catch (error) {
    console.log("From cloudinary file uplaod ", error);
    fs.unlinkSync(localFilePath);
  }
};

const deleteCloudinaryFile = async (localFilePath = "taufik") => {
  try {
    if (!localFilePath) {
      return null;
    }

    const afterdeleted = await cloudinary.api.delete_resources(
      [localFilePath],
      {
        type: "upload",
        resource_type: "image",
        folder: "topNews",
      }
    );

    return afterdeleted;
  } catch (error) {
    throw new ApiError(501, "cloudinary image delete failded " + error);
  }
};

module.exports = { cloudinaryFileUpload, deleteCloudinaryFile };
