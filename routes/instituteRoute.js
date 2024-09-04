const express = require("express");
const router = express.Router();
const { checkInstituteAuth } = require("../middlewares/auth");
const {
  handleInstituteLogin,
  handleInstituteRegistration,
  handleInstituteChangePassword,
  handleInstituteSendResetPassEmail,
} = require("../controllers/instituteController");

//router level middleware
router.use("/home", checkInstituteAuth);

//public routes
router.get("/login", (req, res) => {
  if (req.cookies.uid) res.clearCookie("uid");
  return res.render("instituteLogin");
});
router.get("/register", (req, res) => {
  if (req.cookies.uid) res.clearCookie("uid");
  return res.render("instituteRegister");
});
router.get("/sendresetpassemail", (req, res) => {
  return res.render("institutesendresetpassemail");
});
router.post("/login", handleInstituteLogin);
router.post("/register", handleInstituteRegistration);
router.post("/sendresetpassemail", handleInstituteSendResetPassEmail);

//private routes
router.get("/home", (req, res) => {
  return res.render("instituteHome");
});
router.get("/home/changepassword", (req, res) => {
  return res.render("instituteChangePassword");
});
router.post("/home/changepassword", handleInstituteChangePassword);

module.exports = router;
