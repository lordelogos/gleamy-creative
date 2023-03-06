import { Menu } from "./js/classes";
import { gsap } from "gsap";
import barba from "@barba/core";
// initialize the menu
const navigation = new Menu(
  document.querySelector(".navMenu"),
  document.querySelector(".navToggle")
);

// page transitions
function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

function pageTransitionIn() {
  return gsap.fromTo(
    ".preloader",
    { y: "100%", duration: 0 },
    { y: "0%", duration: 0.5 }
  );
}

function contentLoaded(data) {
  const tl = new gsap.timeline();
  tl.to(".preloader", { y: "-100%", duration: 0.5 });
  tl.from(data.next.container, { opacity: 0 }, "-=0.5");
}

// page transitions
barba.init({
  sync: true,

  transitions: [
    {
      name: "default-transition",

      async leave(data) {
        document.body.dataset.namespace =
          data.next.url.path === "/" ? "home" : "other";

        if (document.body.dataset.nav === "true") {
          navigation.toggleNav();
        }

        const done = this.async();
        pageTransitionIn();
        await delay(1000);
        done();
      },

      async enter(data) {
        contentLoaded(data);
      },

      async once(data) {
        const done = this.async();
        await delay(1000);
        contentLoaded(data);
        done();
      },
    },
  ],
});
