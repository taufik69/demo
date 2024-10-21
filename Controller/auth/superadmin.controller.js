const { ApiError } = require("../../Utils/ApiError.js");
const bcrypt = require("bcrypt");
const Admin = require("../../Model/auth.model.js");
const {
  generateBrcypt,
  compareCheckPassword,
} = require("../../Utils/bcrypt.js");
const { generateToken } = require("../../Utils/JwtToken.js");
const { ApiResponse } = require("../../Utils/ApiResponse.js");
const { emailChecker, passwordChecker } = require("../../Utils/Checker.js");

// Create Superadmin (You can use this once to create the first superadmin manually)
const createSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json(new ApiError(400, null, "Superadmin Credential Missing !!"));
    }
    if (!emailChecker(email) || !passwordChecker(password)) {
      return res
        .status(400)
        .json(
          new ApiError(400, null, "Superadmin Email or password  Invalid !!")
        );
    }

    if (email === process.env.SUPERADMIN_EMAIL_KEY) {
      const existingAdmin = await Admin.findOne({ email });

      if (existingAdmin) {
        return res
          .status(400)
          .json(new ApiError(500, null, "Superadmin already exists !!"));
      }
      const hasspassword = await generateBrcypt(password);

      const superAdmin = await new Admin({
        name,
        email,
        password: hasspassword,
        role: "superadmin",
      }).save();

      // generate a access token with the helps of id and email
      const token = await generateToken({
        email: superAdmin.email,
        id: superAdmin._id,
      });

      // send a otp in the client end

      return res
        .status(201)
        .cookie("Token", token, { httpOnly: false, secure: false })
        .json(
          new ApiResponse(
            200,
            { token: `Bearer ${token}`, superAdmin: superAdmin },
            "Superadmin created successfully"
          )
        );
    }
    return res
      .status(400)
      .json(new ApiError(400, null, "Only Superadmin can Registration !!"));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating superadmin" + error.message });
  }
};

const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiError(400, null, "Superadmin credentials missing!"));
    }

    // Validate email and password format
    if (!emailChecker(email) || !passwordChecker(password)) {
      return res
        .status(400)
        .json(
          new ApiError(400, null, "Superadmin email or password is invalid!")
        );
    }

    // Check if the superadmin exists in the database
    const superAdmin = await Admin.findOne({ email, role: "superadmin" });
    if (!superAdmin) {
      return res
        .status(400)
        .json(new ApiError(400, null, "Superadmin does not exist!"));
    }

    // Check if the password matches
    const isMatch = await compareCheckPassword(password, superAdmin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiError(401, null, "Invalid credentials!"));
    }

    // Generate an access token
    const token = await generateToken({
      email: superAdmin.email,
      id: superAdmin._id,
    });

    // Set the token in a cookie and send the response
    res
      .status(200)
      .cookie("Token", token, { httpOnly: false, secure: false })
      .json(
        new ApiResponse(
          200,
          { token: `Bearer ${token}` },
          "Superadmin logged in successfully"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in superadmin: " + error.message });
  }
};

// logout  superadmin
const logoutSuperAdmin = async (req, res) => {
  try {
    // Clear the token cookie to log out the super admin
    res
      .status(200)
      .clearCookie("Token")
      .json(new ApiResponse(200, null, "Superadmin logged out successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(
          500,
          null,
          `Error logging out superadmin: ${error.message}`
        )
      );
  }
};

// Create Subadmin
const createSubadmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json(new ApiError(400, null, "admin Credential Missing !!"));
    }

    const hasspassword = await generateBrcypt(password);
    const subadmin = new Admin({
      name,
      email,
      password: hasspassword,
      role: "admin",
      permissions: req.user?._id,
    });

    await subadmin.save();

    res
      .status(201)
      .json(new ApiResponse(200, subadmin, "Subadmin created successfully"));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating subadmin " + error.message });
  }
};

// Update Subadmin
const updateSubadmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Check if password is being updated
    if (updates.password) {
      updates.password = await generateBrcypt(updates.password);
    }
    // Find and update the subadmin by ID
    const subadmin = await Admin.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate({
      path: "permissions",
      select: "-permissions -password",
    });

    // If subadmin not found, return error
    if (!subadmin) {
      return res
        .status(404)
        .json(new ApiError(404, null, "Subadmin not found"));
    }

    // Return the updated subadmin using ApiResponse
    res
      .status(200)
      .json(new ApiResponse(200, subadmin, "Subadmin updated successfully"));
  } catch (error) {
    // Handle any errors
    res
      .status(500)
      .json(
        new ApiError(500, null, `Error updating subadmin: ${error.message}`)
      );
  }
};
// Delte  Subadmin
const deleteSubadmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the subadmin
    const subadmin = await Admin.findByIdAndDelete(id);

    // If subadmin not found, return error
    if (!subadmin) {
      return res
        .status(404)
        .json(new ApiError(404, null, "Subadmin not found"));
    }

    // Return success response
    res
      .status(200)
      .json(new ApiResponse(200, subadmin, "Subadmin deleted successfully"));
  } catch (error) {
    // Handle any errors
    res
      .status(500)
      .json(
        new ApiError(500, null, `Error deleting subadmin: ${error.message}`)
      );
  }
};

// Get all  subadmin
const getAllsubAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate({
      path: "permissions",
      select: "-password -permissions",
    });

    if (admins.length === 0) {
      return res.status(404).json(new ApiError(404, null, "No admins found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, admins, "Admins fetched successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, "Error fetching admins"));
  }
};

// Get a single subadmin by ID
const getSubSingleSubadmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Find subadmin by ID
    const admin = await Admin.findById(id).populate({
      path: "permissions",
      select: "-password -permissions",
    });

    // If subadmin not found, return error
    if (!admin) {
      return res.status(404).json(new ApiError(404, null, "Admin not found"));
    }

    // Return the found subadmin
    res
      .status(200)
      .json(new ApiResponse(200, admin, "Admin fetched successfully"));
  } catch (error) {
    // Handle any errors
    res
      .status(500)
      .json(new ApiError(500, null, `Error fetching admin: ${error.message}`));
  }
};

// subadmin  login controller
const loginSubAdmin = async (req, res) => {
  try {
    const { nameoremail, password } = req.body;
    if (!nameoremail || !password) {
      return res.status(404).json(new ApiError(404, null, "Admin Credential "));
    }
    const adminInfo = await Admin.findOne({
      $or: [{ name: nameoremail }, { email: nameoremail }],
    });

    if (adminInfo) {
      const isCorrectHashPassword = await compareCheckPassword(
        password,
        adminInfo.password
      );

      if (isCorrectHashPassword) {
        // generate a access token with the helps of id and email
        const token = await generateToken({
          email: adminInfo.email,
          id: adminInfo._id,
        });

        return res
          .status(201)
          .cookie("Token", token, { httpOnly: false, secure: false })
          .json(
            new ApiResponse(
              200,
              { token: `Bearer ${token}`, subadmin: adminInfo },
              "Admin log in successfully"
            )
          );
      }
    }
    return res
      .status(404)
      .json(
        new ApiError(
          404,
          null,
          "Admin Not found plase Check Your NameorEmail and password Correctly "
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, null, `Error login admin: ${error.message}`));
  }
};
// logout the admin
const logoutSubAdmin = async (req, res) => {
  try {
    // Clear the token cookie to effectively log the admin out
    res
      .status(200)
      .clearCookie("Token")
      .json(new ApiResponse(200, null, "Admin logged out successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, null, `Error logging out admin: ${error.message}`)
      );
  }
};

module.exports = {
  deleteSubadmin,
  updateSubadmin,
  createSubadmin,
  createSuperAdmin,
  getAllsubAdmins,
  getSubSingleSubadmin,
  loginSubAdmin,
  logoutSubAdmin,
  logoutSuperAdmin,
  loginSuperAdmin,
};
