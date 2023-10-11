/* header */
// grab header and desktop header
// insert the contents of header into the desktop one
// using the library https://github.com/camwiegert/in-view

const header = document.querySelector(".header");
const desktopHeader = document.querySelector(".header-desktop");
desktopHeader.innerHTML = header.innerHTML;

inView(".header")
  .on("enter", (el) => desktopHeader.classList.remove("visible"))
  .on("exit", (el) => desktopHeader.classList.add("visible"));

/* parallax tilt image */
VanillaTilt.init(document.querySelectorAll(".image"), {
  max: 25,
  speed: 400,
  easing: "cubic-bezier(.03,.98,.52,.99)",
  glare: true,
});

/* fading images in on scroll */
inView(".fade")
  .on("enter", (img) => img.classList.add("visible"))
  .on("exit", (img) => img.classList.remove("visible"));

// custom styling can be passed to options when creating an element
const style = {
  base: {
    color: "#32325d",
    lineHeight: "18px",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#895a4a",
    },
  },
  invalid: {
    color: "#895a4a",
    iconColor: "#895a4a",
  },
};

/* smoothing scrolling */
const anchors = document.querySelectorAll("a");

// loop over them
anchors.forEach((anchor) => {
  // listen for clicks on each one
  anchor.addEventListener("click", (event) => {
    // grab the hred attribute
    const href = anchor.getAttribute("href");
    // if the href starts with a #
    if (href.charAt(0) === "#") {
      // stop the default action
      event.preventDefault();
      // find the element the href points to and scroll it into view
      document.querySelector(href).scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});
