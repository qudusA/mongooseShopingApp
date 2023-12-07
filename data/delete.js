const fs = require("fs");

module.exports = (imagePath) => {
  const pt = imagePath.split("").splice(1).join("");
  fs.unlink(pt, (err) => {
    console.log(err);
  });
};
