"use strict";

// const delet = (btn) => {
//   //   const delBtn = document.getElementsByClassName("del");
//   console.log("clicked");
//   //   console.log(delBtn);
//   const cardA = btn.closest(".card__actions");
//   const productId = cardA.querySelector("[name=productId]").value;
//   const csrfToken = cardA.querySelector("[name=_csrf]").value;
//   console.log("prodid", productId, "csrf token", csrfToken);
//   console.log(btn);
//   console.log("clicked");
//   const article = btn.closest("article");

//   fetch(`/admin/product/${productId}`, {
//     method: "DELETE",
//     headers: {
//       "csrf-token": csrfToken,
//     },
//   })
//     .then((data) => {
//       console.log("data here we", data);
//       return data.json();
//     })
//     .then((result) => {
//       console.log("delete sport", result);
//       // article.remove();
//       article.parentNode.removeChild(article);
//     })
//     .catch((err) => {
//       // console.log(err);
//     });
// };

const delBtn = document.querySelector(".del");
const cb = () => {
  const cardA = delBtn.closest(".card__actions");
  const productId = cardA.querySelector("[name=productId]").value;
  const csrfToken = cardA.querySelector("[name=_csrf]").value;
  console.log(productId, csrfToken);
  const article = delBtn.closest("article");

  fetch(`/admin/products/${productId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((result) => {
      article.remove();
      //   article.parentNode.removeChild(article);
    })
    .catch((err) => {
      res.status(500).json({ message: "deletion failed" });
    });
};

delBtn.addEventListener("click", cb);
