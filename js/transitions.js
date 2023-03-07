import gsap from "gsap";
import barba from "@barba/core";
import { delay } from "./utils";
import { DoubleImageEffect } from "./classes";

const pageTransitionIn = () => {
  return gsap.fromTo(
    ".preloader",
    { y: "100%", duration: 0 },
    { y: "0%", duration: 0.5 }
  );
};

const contentLoaded = (data) => {
  const tl = new gsap.timeline();
  tl.to(".preloader", { y: "-100%", duration: 0.5 });
  tl.from(data.next.container, { opacity: 0 }, "-=0.5");
  tl.fromTo(
    ".fade-in",
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1 },
    "-=0.5"
  );
  tl.fromTo(".opacity-in", { opacity: 0 }, { opacity: 1, stagger: 0.1 });
};

const initPageTransitions = (navigation) => {
  return barba.init({
    sync: true,

    transitions: [
      {
        name: "default-transition",

        async leave(data) {
          if (document.body.dataset.nav === "true") {
            navigation.toggleNav();
          }

          const done = this.async();
          pageTransitionIn();
          await delay(1000);

          document.body.dataset.namespace =
            data.next.url.path === "/" ? "home" : "other";

          done();
        },

        async beforeEnter(data) {
          if (data.next.url.path === "/portfolio.html") {
            [...document.querySelectorAll(".project__img")].forEach(
              (el) => new DoubleImageEffect(el)
            );
          }
        },

        async enter(data) {
          contentLoaded(data);
        },

        async once(data) {
          const done = this.async();

          if (data.next.url.path === "/portfolio.html") {
            [...document.querySelectorAll(".project__img")].forEach(
              (el) => new DoubleImageEffect(el)
            );
          }

          await delay(1000);
          contentLoaded(data);
          done();
        },
      },
    ],
  });
};

export { pageTransitionIn, contentLoaded, initPageTransitions };
