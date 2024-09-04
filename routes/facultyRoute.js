const express = require("express");
const router = express.Router();
const { checkFacultyAuth } = require("../middlewares/auth");
const {
  handleFacultyLogin,
  handleFacultyRegistration,
  handleFacultySendResetPassEmail,
  handleFacultyChangePassword,
} = require("../controllers/facultyController");

//router level middleware
router.use("/home", checkFacultyAuth);

//public routes
router.get("/login", (req, res) => {
  if (req.cookies.uid) res.clearCookie("uid");
  return res.render("facultyLogin");
});
router.get("/register", (req, res) => {
  if (req.cookies.uid) res.clearCookie("uid");
  return res.render("facultyRegister");
});
router.get("/sendresetpassemail", (req, res) => {
  return res.render("facultysendresetpassemail");
});

router.post("/login", handleFacultyLogin);
router.post("/register", handleFacultyRegistration);
router.post("/sendresetpassemail", handleFacultySendResetPassEmail);

//private routes
router.get("/home", (req, res) => {
  return res.render("facultyHome");
});
router.get("/home/changepassword", (req, res) => {
  return res.render("facultyChangePassword");
});
router.post("/home/changepassword", handleFacultyChangePassword);

module.exports = router;
