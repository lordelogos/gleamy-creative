import gsap from "gsap";
import { Menu } from "./js/classes";
import { initPageTransitions } from "./js/transitions";

// initialize the menu
const navigation = new Menu(
  document.querySelector(".navMenu"),
  document.querySelector(".navToggle")
);

// initialize page transitions
initPageTransitions(navigation);

// setting up portfolio slider
// initialize project animations

// // pass false to prevent automatic styles injection
// var galleryTop = new Swiper(".gallery-top", {
//   // spaceBetween: 10,
//   loop: true,
//   loopedSlides: 3,
// });

// var galleryThumbs = new Swiper(".gallery-thumbs", {
//   spaceBetween: 30,
//   navigation: {
//     nextEl: ".swiper-button-next",
//     prevEl: ".swiper-button-prev",
//   },
//   centeredSlides: true,
//   slidesPerView: "auto",
//   touchRatio: 0.2,
//   slideToClickedSlide: true,
//   loop: true,
//   loopedSlides: 3,
// });

// galleryThumbs.controller.control = galleryTop;
// galleryTop.controller.control = galleryThumbs;
