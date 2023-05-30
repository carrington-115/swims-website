import "./style.scss";

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
