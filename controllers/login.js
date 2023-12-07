const User = require("../models/user");
const bcrypt = require("bcryptjs");
// const mailjet = require("node-mailjet");
const { validationResult, ExpressValidator } = require("express-validator");

exports.getLogin = (req, res, next) => {
  // console.log(req.flash("err")[0] === "invalid email or password");
  res.render("shop/login", {
    path: "/login",
    pageTitle: "login",
    auth: false,
    csrfToken: req.csrfToken(),
    errMsg: req.flash("err"),
    // orders: orders,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const { password } = req.body;
  // console.log(email, password);
  // res.setHeader("set-cookie", "login=true");
  let userInstance;
  User.findOne({ email: email })
    .then((user) => {
      userInstance = user;
      if (!user) {
        req.flash("err", "invalid email or password");
        console.log("wrong email");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (!doMatch) {
          console.log("wrong password");
          req.flash("err", "invalid password or email");
          return res.redirect("/login");
        }
        req.session.login = "true";
        req.session.user = userInstance;

        res.redirect("/");
      });
    })
    // .then((doMatch) => {
    //   if (!doMatch) {
    //     console.log("wrong password");
    //     req.flash("err", "invalid password or email");
    //     res.redirect("/");
    //   } else {
    //     req.session.login = "true";
    //     req.session.user = userInstance;

    //     res.redirect("/");
    //   }
    // })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignUp = (req, res, next) => {
  res.render("shop/signup", {
    path: "/signup",
    pageTitle: "sign up",
    auth: false,
    csrfToken: req.csrfToken(),
    msg: req.flash("msg"),
    userInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    // orders: orders,
  });
};

exports.postSignUp = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  const { confirmPassword } = req.body;
  const err = validationResult(req);
  // console.log([err.array()[0].msg][0]);
  if (!err.isEmpty()) {
    return res.render("shop/signup", {
      path: "/signup",
      pageTitle: "sign up",
      auth: false,
      csrfToken: req.csrfToken(),
      msg: [err.array()[0].msg],
      userInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      // orders: orders,
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
      });

      return user.save();
    })
    .then((result) => {
      // console.log(result.body);
      req.flash("msg", " account creation succesful");
      res.redirect("/signup");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
