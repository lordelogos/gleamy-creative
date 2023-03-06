import { gsap } from "gsap";
import { closestEdge } from "./utils";

export class MenuItem {
  constructor(el) {
    // .menu__item element
    this.DOM = { el: el };
    // .menu__item-link element
    this.DOM.link = this.DOM.el.querySelector(".navMenu ul li a");
    // .marqee element
    this.DOM.marqee = this.DOM.el.querySelector(".nav__marqee");
    // .marqee__inner-wrap element
    this.DOM.marqeeInner = this.DOM.marqee.querySelector(
      ".nav__marqee-inner-wrap"
    );
    // some default options for the animation's speed and easing
    this.animationDefaults = { duration: 0.6, ease: "expo" };
    // events initialization
    this.initEvents();
  }
  initEvents() {
    this.onMouseEnterFn = (ev) => this.mouseEnter(ev);
    this.DOM.link.addEventListener("mouseenter", this.onMouseEnterFn);
    this.onMouseLeaveFn = (ev) => this.mouseLeave(ev);
    this.DOM.link.addEventListener("mouseleave", this.onMouseLeaveFn);
  }
  mouseEnter(ev) {
    // find closest side to the mouse
    const edge = this.findClosestEdge(ev);

    // set the initial y position for both the marqee and marqeeInner elements
    // for the reveal effect to happen, both start at opposite positions
    // the directions are different depending on the direction the cursor enters the element (bottom or top)
    gsap
      .timeline({ defaults: this.animationDefaults })
      .set(this.DOM.marqee, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(this.DOM.marqeeInner, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([this.DOM.marqee, this.DOM.marqeeInner], { y: "0%" }, 0);
  }
  mouseLeave(ev) {
    // find closest side to the mouse
    const edge = this.findClosestEdge(ev);

    gsap
      .timeline({ defaults: this.animationDefaults })
      .to(this.DOM.marqee, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(this.DOM.marqeeInner, { y: edge === "top" ? "101%" : "-101%" }, 0);
  }
  // find closest side to the mouse when entering/leaving
  findClosestEdge(ev) {
    const x = ev.pageX - this.DOM.el.offsetLeft;
    const y = ev.pageY - this.DOM.el.offsetTop;
    return closestEdge(x, y, this.DOM.el.clientWidth, this.DOM.el.clientHeight);
  }
}

export class Menu {
  constructor(el, menuToggle) {
    // .menu element
    this.DOM = { el: el };
    // menu toggle
    this.menuToggle = { el: menuToggle };
    this.menuToggleText = this.menuToggle.el.querySelector(".navToggle span");
    // the menu items
    this.DOM.menuItems = this.DOM.el.querySelectorAll(".navMenu ul li");
    // array of MenuItem
    this.menuItems = [];
    this.DOM.menuItems.forEach((menuItem) =>
      this.menuItems.push(new MenuItem(menuItem))
    );
    this.initEvents();
  }

  initEvents() {
    this.onClickFn = (ev) => this.toggleNav(ev);
    this.menuToggle.el.addEventListener("click", this.onClickFn);
  }

  toggleNav() {
    if (document.body.dataset.nav === "true") {
      document.body.dataset.nav = "false";
      this.menuToggleText.textContent = "Menu";
    } else {
      document.body.dataset.nav = "true";
      this.menuToggleText.textContent = "Close";
    }
  }
}

export class ProjectHover {
  DOM = {
    el: null,
    bottom: null,
    top: null,
  };
  constructor(DOM_el) {
    this.DOM.el = DOM_el;
    this.layout();
  }
  layout() {
    /*
        this
        <div class="double" style="background-image:[url]"></div>

        becomes
        <div class="double">
            <div class="double__img" style="background-image:[url]"></div>
            <div class="double__img" style="background-image:[url]"></div>
        </div>
        */

    // get element background-image url
    const url = getComputedStyle(this.DOM.el).backgroundImage.match(
      /url\(["']?([^"']*)["']?\)/
    )[1];
    gsap.set(this.DOM.el, { backgroundImage: "none" });

    const iterations = 2;
    let innerHTML = "";
    for (let i = 0; i < iterations; ++i) {
      innerHTML += `<div class="double__img" style="background-image:url(${url})"></div>`;
    }
    this.DOM.el.innerHTML = innerHTML;

    this.DOM.bottom = this.DOM.el.querySelector(".double__img:first-child");
    this.DOM.top = this.DOM.el.querySelector(".double__img:last-child");

    /*
        gsap.set(this.DOM.bottom, {
            scale: 1.4
        });
        */
  }
  mouseenter() {
    if (this.leaveTimeout) {
      this.leaveTimeout.kill();
    }

    this.enterTimeout = gsap
      .timeline({
        defaults: {
          duration: 0.9,
          ease: "expo",
        },
      })
      .set(this.DOM.bottom, { willChange: "filter" })
      .set(this.DOM.top, { willChange: "clip-path" })
      .fromTo(
        this.DOM.top,
        {
          clipPath: "circle(70.7% at 50% 50%)",
        },
        {
          clipPath: "circle(0% at 50% 50%)",
        },
        0
      )

      .fromTo(
        this.DOM.bottom,
        {
          scale: 1,
          filter: "brightness(80%) contrast(200%) hue-rotate(-90deg)",
        },
        {
          scale: 1.3,
          filter: "brightness(100%) contrast(100%) hue-rotate(0deg)",
        },
        0
      );
  }
  mouseleave() {
    if (this.enterTimeout) {
      this.enterTimeout.kill();
    }

    this.leaveTimeout = gsap
      .timeline({
        defaults: {
          duration: 0.5,
          ease: "power2.inOut",
        },
      })
      .set(this.DOM.bottom, { willChange: "filter" })
      .set(this.DOM.top, { willChange: "clip-path" })
      .to(
        this.DOM.top,
        {
          clipPath: "circle(70.7% at 50% 50%)",
        },
        0
      )

      .to(
        this.DOM.bottom,
        {
          filter: "brightness(0%) contrast(400%)",
          scale: 3.3,
        },
        0
      );
  }
}

export class DoubleImageEffect {
  DOM = {
    el: null,
  };

  constructor(DOM_el) {
    this.DOM.el = DOM_el;
    this.effect = new ProjectHover(this.DOM.el);
    this.initEvents();
  }

  initEvents() {
    this.DOM.el.addEventListener("mouseenter", () => {
      this.effect.mouseenter();
    });

    this.DOM.el.addEventListener("mouseleave", () => {
      this.effect.mouseleave();
    });
  }
}
