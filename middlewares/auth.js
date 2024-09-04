const jwt = require("jsonwebtoken");
const facultyModel = require("../models/facultyModel");
const instituteModel = require("../models/instituteModel");

const checkFacultyAuth = async (req, res, next) => {
  const token = req.cookies.uid;
  if (token) {
    try {
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await facultyModel.findById(userID).select("-password");
      //if (!user) return res.redirect("/user/login");
      req.user = user;
      next();
    } catch {
      return res.redirect("/faculty/login");
    }
  } else {
    return res.redirect("/faculty/login");
  }
};
const checkInstituteAuth = async (req, res, next) => {
  const token = req.cookies.uid;
  if (token) {
    try {
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await instituteModel.findById(userID).select("-password");
      //if (!user) return res.redirect("/user/login");
      req.user = user;
      next();
    } catch {
      return res.redirect("/institute/login");
    }
  } else {
    return res.redirect("/institute/login");
  }
};

module.exports = {
  checkFacultyAuth,
  checkInstituteAuth,
};
