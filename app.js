const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongooseConnect = require("./util/mongoose");
const session = require("express-session");
const MongoSession = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const loginRoutes = require("./routes/login");

const store = new MongoSession({
  uri: "mongodb://127.0.0.1:27017/todaymongoose",
  collection: "session",
});
const csurfToken = csurf();
const flashM = flash();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "mysecretisveryverylong",
    saveUninitialized: false,
    resave: false,
    store: store,
  })
);
app.use(csurfToken);
app.use(flash);

app.use((req, res, next) => {
  User.findById(req.session.user?._id)
    .then((user) => {
      req.user = user;
      // console.log(req.user);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);

app.use(errorController.get404);

mongooseConnect((client) => {
  // console.log(client);
  // const id = ObjectId("6529588b1dc50435fe73c9fd");
})
  // .then(() => {
  //   return User.findOne({ _id: "65295c9a230d4fb3965d3b71" });
  // })
  // .then((user) => {
  //   // console.log(user);
  //   if (!user) {
  //     const test = new User({
  //       email: "test@test.com",
  //       fname: "qudus",
  //       password: "ajagbeejo",
  //     });
  //     return test.save();
  //   }
  //   return user;
  // })
  .then(() => {
    const port = 3000;
    app.listen(port, () => {
      console.log(`application listens on port:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
