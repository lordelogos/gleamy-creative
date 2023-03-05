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
