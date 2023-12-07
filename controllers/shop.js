const Product = require("../models/product");
const User = require("../models/user");
const PDFdoc = require("pdfkit");

const fs = require("fs");
const path = require("path");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        auth: req.session.login,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        auth: req.session.login,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => console.log(err));
};

try {
  exports.getIndex = async (req, res, next) => {
    const { page } = req.query;
    const itemsPerPage = 2;
    const start = (page - 1) * itemsPerPage;
    console.log("query", page);

    const products = await Product.find();
    const roundVal = Math.ceil(products.length / itemsPerPage);
    const arr = Array.from({ length: roundVal }, (cur, ind) => ind + 1);

    const limitProducts = await Product.find().limit(itemsPerPage).skip(start);
    res.render("shop/index", {
      prods: limitProducts,
      pageTitle: "Shop",
      path: "/",
      auth: req.session.login,
      csrfToken: req.csrfToken(),
      arr: arr,
    });
  };
} catch (err) {
  console.log(err);
}

exports.getCart = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((products) => {
      // console.log(products);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products.carts,
        auth: req.session.login,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      // copy carts items into a new array
      const [...cart] = req.user.carts;
      // find the index of intended product id in the carts
      const foundIndx = cart.findIndex((cur, idx) => {
        return cur.productId.toString() === product._id.toString();
      });
      // if exist update
      if (foundIndx >= 0) {
        const obj = cart.slice(foundIndx, foundIndx + 1)[0];
        obj.quantity = obj.quantity + 1;
        const mapedCart = cart.map((cur, idx, arr) => {
          if (cur._id.toString() === product._id.toString()) {
            return obj;
          }
          return cur;
        });
        // replace the oldcart with the newcart in the database
        req.user.carts = mapedCart;
        return req.user.save();
      }
      // else add new
      if (foundIndx === -1) {
        req.user.carts.push({
          title: product.title,
          quantity: 1,
          productId: product._id,
        });

        return req.user.save();
      }
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  const [...cartItem] = req.user.carts;
  const indx = cartItem.findIndex((cur, indx, arr) => {
    return prodId.toString() === cur._id.toString();
  });

  cartItem.splice(indx, 1);
  req.user.carts = cartItem;

  return (
    req.user
      .save()
      // req.user
      //   .deleteItemFromCart(prodId)
      .then((result) => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err))
  );
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        auth: req.session.login,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => console.log(err));
};

exports.getPdf = (req, res, next) => {
  const productId = req.params.prodId;
  Product.findById("652bacc140308aae0c7fc941").then((prod) => {
    const pt = prod.imageUrl.split("").slice(1).join("");

    const p = path.join(pt);
    // fs.readFile(p, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.send(data);
    // });

    // const file = fs.createReadStream(p);
    // res.setHeader("Content-Type", "application/pdf");

    // file.pipe(res);

    const ppt = productId + ".pdf";
    console.log(ppt);
    const pf = path.join("images", ppt);
    console.log(pf);

    res.setHeader("Content-Type", "application/pdf");
    const pdfdoc = new PDFdoc();
    pdfdoc.pipe(fs.createWriteStream(pf));
    pdfdoc.pipe(res);

    pdfdoc.text("hello world");
    pdfdoc.end();
  });
};
