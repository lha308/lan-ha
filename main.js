/* header */
// grab header and desktop header
// insert the contents of header into the desktop one
// using the library https://github.com/camwiegert/in-view

const header = document.querySelector(".header");
const desktopHeader = document.querySelector(".header-desktop");
desktopHeader.innerHTML = header.innerHTML;

// 1. when the header enters the viewport hide the desktop header (by removing class)
// 2. when the header leaves, show it (by adding visible class)
// one line function - no need curly bracket
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
// get all images to fade in
// add the visible class which toggles the opacity
inView(".fade")
  .on("enter", (img) => img.classList.add("visible"))
  .on("exit", (img) => img.classList.remove("visible"));

/* fields */
// click the .register-button, run a function
// grab the .front element and add a class of .slide-up
// const registerButton = document.querySelector(".register-button");
// registerButton.addEventListener("click", (event) => {
//   // stop any default actions from happening
//   event.preventDefault();
//   const frontEl = document.querySelector(".front");
//   frontEl.classList.add("slide-up");
// });

/* stripe */
// create a stripe client
const stripe = Stripe("pk_test_cucWEL0zZ0Ttl8sDgYcAdeD6");

// create an instance of elements
var elements = stripe.elements();

// custom styling can be passed to options when creating an element
// note that this demo uses a wider style of styles than the guide below
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

// create an instance of the card element
const card = elements.create("card", { style: style });

// add an instance of the card element into 'card-element' <div>
card.mount("#card-element");

// handle real-time validation errors from the card element
card.addEventListener("change", function (event) {
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = "";
  }
});

// handle form submission
const form = document.getElementById("payment-form");
const errorElement = document.getElementById("card-errors");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  //here we lock the form
  form.classList.add("processing");
  stripe.createToken(card).then(function (result) {
    if (result.error) {
      // here we unlock the form again if there's an error
      form.classList.remove("processing");
      // set the error text to the the error message
      errorElement.textContent = result.error.message;
    } else {
      // now we take over to handle sending the token to our server
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token) {
  // here we handle and make our actual payment
  // 1. make a variable for our token, name and email
  // const stripe_token = token.id
  const nameEl = document.querySelector("#name");
  const emailEl = document.querySelector("#email");
  // 2. we are going to grab form action url from the form
  const backendUrl = form.getAttribute("action");
  // 3. send the data off to the url using fetch
  // we use fetch to POST to our url vs GET
  fetch(backendUrl, {
    method: "POST",
    // tell it we send across json data
    headers: {
      "Content-Type": "application/json",
    },
    // here we send the data across
    // 4. need to make sure the data is ready/secure to be sent over
    body: JSON.stringify({
      order: {
        stripe_token: token.id,
        // grab the value from the name and email element
        name: nameEl.value,
        email: emailEl.value,
      },
    }),
  })
    // with fetch we get back our response which we turn into json
    .then((response) => response.json())
    // then we get it back as data to do stuff with
    .then((data) => {
      // here we check we actually get an order back then do something with it
      if (data.order) {
        const order = data.order;
        // ${order.name}
        // $(order.email)
        // tell the users the payment is successful
        form.querySelector(".form-title").textContent = "Payment successful!";
        form.querySelector(
          ".form-fields"
        ).textContent = `Thank you ${order.name}, 
            your payment was successful and we have sent an email to ${order.email} `;
        form.classList.remove("processing");
      }
    })
    // if there is an error, we can do something as well
    .catch((error) => {
      form.classList.remove("processing");
      // tell users there was an error
      errorElement.textContent = `There was an error with payment
        , please try again or contact us at`;
    });
}

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
