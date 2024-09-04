const facultyModel = require("../models/facultyModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../config/email");

const handleFacultyRegistration = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  if (name && email && password && confirm_password) {
    const user = await facultyModel.findOne({ email: email });
    if (user) {
      return res.render("facultyRegister", {
        message: "Email already exists!",
      });
    } else {
      if (password === confirm_password) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          await facultyModel.create({
            name: name,
            email: email,
            password: hashedPassword,
          });
          const saved_user = await facultyModel.findOne({ email: email });
          const token = jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.cookie("uid", token, { maxAge: 900000, httpOnly: true });
          return res.redirect("/faculty/home");
        } catch (error) {
          //console.log(error);
          return res.render("facultyRegister", {
            message: "Unable to register",
          });
        }
      } else {
        return res.render("facultyRegister", {
          message: "Password and confirm password doesn't match",
        });
      }
    }
  } else {
    return res.render("facultyRegister", {
      message: "All fields are required!",
    });
  }
};

const handleFacultyLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await facultyModel.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (email === user.email && isMatch) {
        const token = jwt.sign(
          { userID: user._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "5d" }
        );
        res.cookie("uid", token, { maxAge: 900000, httpOnly: true });
        return res.redirect("/faculty/home");
      } else {
        return res.render("facultyLogin", {
          message: "Invalid email or password!",
        });
      }
    } else {
      return res.render("facultyLogin", { message: "Email not registered!" });
    }
  } else {
    return res.render("facultyLogin", { message: "All fields are required!" });
  }
};

const handleFacultyChangePassword = async (req, res) => {
  const { password, new_password, confirm_new_password } = req.body;
  if (password && new_password && confirm_new_password) {
    if (new_password === confirm_new_password) {
      const user = await facultyModel.findById(req.user._id);
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        if (password === new_password) {
          return res.render("changepassword", {
            message: "Current password and New password cannot be same!",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedNewPassword = await bcrypt.hash(new_password, salt);
          await facultyModel.findOneAndUpdate(
            { email: user.email },
            { password: hashedNewPassword }
          );
          res.clearCookie("uid");
          return res.render("facultyChangePassword", {
            message: "Password updated successfully!",
          });
        }
      } else {
        return res.render("facultyChangePassword", {
          message: "Incorrect current password!",
        });
      }
    } else {
      return res.render("facultyChangePassword", {
        message: "New password and confirm new password doesn't match!",
      });
    }
  } else {
    return res.render("facultyChangePassword", {
      message: "All fields are required!",
    });
  }
};

const handleFacultySendResetPassEmail = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await facultyModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "15m",
      });
      const link = `http://localhost:3000/faculty/forgetpassword/${user._id}/${token}`;

      const info = await transporter.sendMail({
        from: `"ProfProgress" <${process.env.EMAIL_FROM}>`, // sender address
        to: user.email, // list of receivers
        subject: "Password Reset Link",
        html: `<a href= ${link} >Click Here</a> to reset your password. <br> Note: This link is valid only for 15minutes.`,
      });

      return res.render("facultysendresetpassemail", {
        message: "Password reset email sent... Please check your email",
      });
    } else {
      return res.render("facultysendresetpassemail", {
        message: "Email not found!",
      });
    }
  } else {
    return res.render("facultysendresetpassemail", {
      message: "Email is required!",
    });
  }
};

module.exports = {
  handleFacultyRegistration,
  handleFacultyLogin,
  handleFacultySendResetPassEmail,
  handleFacultyChangePassword,
};
