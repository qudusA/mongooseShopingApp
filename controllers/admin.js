const fs = require("fs");
const path = require("path");
const deleteFilePath = require("../data/delete");

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    auth: req.session.login,
    csrfToken: req.csrfToken(),
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imagE = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!imagE) {
    return res.status(422).redirect("/admin/add-product");
  }

  const image = imagE.path.replace("\\", "/");

  const product = new Product({
    title,
    imageUrl: `/${image}`,
    price,
    description,
    userId: req.user._id,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        auth: req.session.login,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then((product) => {
      if (req.session.user._id.toString() !== product.userId.toString())
        return res.redirect("/admin/products");

      product.title = updatedTitle;
      product.price = updatedPrice;
      if (image) {
        product.imageUrl = `/${req.file.path.replace("\\", "/")}`;
      }
      product.description = updatedDesc;
      product.save().then((prod) => {
        console.log("UPDATED PRODUCT!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        auth: req.session.login,
        csrfToken: req.csrfToken(),
        userId: req.session.user?._id,
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  // console.log(productId);
  Product.findById(productId)
    // Product.deleteOne({ _id: prodId })
    .then((product) => {
      if (req.session.user._id.toString() !== product.userId.toString())
        return res.redirect("/admin/products");

      deleteFilePath(product.imageUrl);

      product.deleteOne().then(() => {
        console.log("DESTROYED PRODUCT");
        // res.redirect("/admin/products");
        res.status(200).json({ message: "deletion successful" });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "deletion failed" });
    });
};
