import "./style.scss";

// getting the elements affected by the header menu clicking
const drawerMenu = document.querySelector(".drawer-menu");
const menuButton = document.querySelector(".menu-button");
const closeButton = document.querySelector(".close-button");

function OpenDrawerMenu() {
  drawerMenu.style.transform = "translateY(0%)";
}
function closeDrawerMenu() {
  drawerMenu.style.transform = "translateY(-100%)";
}

menuButton.addEventListener("click", OpenDrawerMenu);
closeButton.addEventListener("click", closeDrawerMenu);

const the_animation_left = document.querySelectorAll(".animation-left");
const the_animation_right = document.querySelectorAll(".animation-right");

export const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("scroll-animation");
      } else {
        entry.target.classList.remove("scroll-animation");
      }
    });
  },
  { threshold: 0.2 }
);

for (let i = 0; i < the_animation_left.length; i++) {
  const elements = the_animation_left[i];

  observer.observe(elements);
}

for (let i = 0; i < the_animation_right.length; i++) {
  const elements = the_animation_right[i];

  observer.observe(elements);
}
