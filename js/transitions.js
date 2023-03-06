import gsap from "gsap";
import barba from "@barba/core";
import { delay } from "./utils";

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
};

export { pageTransitionIn, contentLoaded, initPageTransitions };
