const mongoose = require("mongoose");

const mongooseConnect = (cb) => {
  return mongoose
    .connect("mongodb://127.0.0.1:27017/todaymongoose")
    .then((client) => {
      // console.log(client);
      cb(client);
    })
    .catch((err) => {
      console.log(err);
    });

  // mongoose.connection
  //   .once("open", () => {
  //     console.log("connected");
  //   })
  //   .on("err", (err) => {
  //     console.warn("warning", err);
  //   });
};

module.exports = mongooseConnect;
