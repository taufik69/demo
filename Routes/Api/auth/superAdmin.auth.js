const express = require("express");
const _ = express.Router();
const {
  protect,
  authorizeSuperAdmin,
} = require("../../../Middleware/authMiddleware.middleware");
const {
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
} = require("../../../Controller/auth/superadmin.controller");
_.route("/auth/superadmin").post(createSuperAdmin);
_.route("/auth/superadmin-logout").get(logoutSuperAdmin);
_.route("/auth/superadmin-login").post(loginSuperAdmin);
// Subadmin routes (Protected by superadmin access)
_.route("/auth/create-subadmin").post(
  protect,
  authorizeSuperAdmin,
  createSubadmin
);
_.route("/auth/update-subadmin/:id").patch(
  protect,
  authorizeSuperAdmin,
  updateSubadmin
);

_.route("/auth/delete-subadmin/:id").delete(
  protect,
  authorizeSuperAdmin,
  deleteSubadmin
);
_.route("/auth/single-subadmin/:id").get(
  protect,
  authorizeSuperAdmin,
  getSubSingleSubadmin
);
_.route("/auth/getallSubadmin").get(getAllsubAdmins);
// login admin
_.route("/auth/login-subadmin").post(loginSubAdmin);
_.route("/auth/logout-subadmin").get(logoutSubAdmin);
module.exports = _;
