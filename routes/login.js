const express = require("express");
const loginController = require("../controllers/login");
const { check } = require("express-validator");

const User = require("../models/user");

const router = express.Router();

router.get("/login", loginController.getLogin);

router.post("/loginForm", [], loginController.postLogin);

router.get("/signup", loginController.getSignUp);

router.post(
  "/signupForm",
  [
    check("email")
      .isEmail()
      .withMessage("invalid Email address")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("user already exist");
            // req.flash("err", "user already exist");
            // return res.redirect("/login");
          }
        });
      })
      .normalizeEmail(),
    check(
      "password",
      "password must be at least 8 character long including at least a number"
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),

    check("confirmPassword").custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      }
      throw new Error("password do not match");
    }),
  ],
  loginController.postSignUp
);

router.post("/logoutForm", loginController.postLogout);

module.exports = router;
