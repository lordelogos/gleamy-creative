import { Menu } from "./js/classes";
import { initPageTransitions } from "./js/transitions";

// initialize the menu
const navigation = new Menu(
  document.querySelector(".navMenu"),
  document.querySelector(".navToggle")
);

// initialize page transitions
initPageTransitions(navigation);
