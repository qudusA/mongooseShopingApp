const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");

const btn = document.querySelector(".div");

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);

// const btn1 = btn.querySelector(".btn1");
// btn.addEventListener("click", function (e) {
//   console.log(e.target.closest(".div"));
//   console.log(this);
//   console.log(e.currentTarget);
// });
