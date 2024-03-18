// ------- Header
const header = document.querySelector("header");

function getHeaderHeight() {
  const h = header.getBoundingClientRect().height;
  header.style.marginBottom = `-${h}px`;
}

window.addEventListener("load", () => {
  getHeaderHeight();
});
window.addEventListener("resize", () => {
  getHeaderHeight();
});

// ------- Countdown
// Function to calculate and update the countdown
function updateCountdown() {
  // Target date and time (May 25, 2024, at 15:00)
  const targetDate = new Date("May 25, 2024 15:00:00").getTime();

  // Current date and time
  const currentDate = new Date().getTime();

  // Calculate the time remaining
  const timeRemaining = targetDate - currentDate;

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  // Display the countdown
  const countdownElement = document.querySelector(".countdown-container").children[0];
  countdownElement.innerHTML = `${days}<span>d</span> ${hours}<span>h</span> ${minutes}<span>m</span> ${seconds}<span>s</span>`;
}

// Update the countdown every second
setInterval(updateCountdown, 1000);

// Initial update
updateCountdown();

// --------- Observer
// Function to handle the intersection
function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.hasAttribute("data-reveal") && entry.target.classList.contains("countdown-container")) {
        // Add your animation class or logic here
        entry.target.classList.add("--reveal--countdown");
      } else if (entry.target.hasAttribute("data-reveal")) {
        entry.target.classList.add("--reveal--section");
      }
      // Unobserve the element after it's revealed (if needed)
      observer.unobserve(entry.target);
    }
  });
}

// Set up the IntersectionObserver
const observer = new IntersectionObserver(handleIntersection, {
  root: null, // Use the viewport as the root
  rootMargin: window.matchMedia("(max-width: 780px)").matches ? "35px 0px" : "15px 0px",
  threshold: 0.1, // Adjust as needed
});

// Select elements to observe
const elementsToObserve = document.querySelectorAll("[data-reveal]");

// Observe each element
elementsToObserve.forEach((element) => {
  observer.observe(element);
});

// -------- Navbar controller
const navContainer = document.querySelector(".nav-container");
const navSelector = document.querySelector(".nav-toggler");
const navList = document.querySelector(".nav-list");
const body = document.querySelector("body");
const navLinks = document.querySelectorAll(".nav-link");

function toggleNavbarMobile() {
  if (window.innerWidth <= 768) {
    const isOpen = navList.getAttribute("data-open");
    isOpen ? navList.removeAttribute("data-open") : navList.setAttribute("data-open", true);
  
    const height = isOpen ? "0px" : "100vh";
    body.style.overflow = isOpen ? "auto" : "hidden";
    navList.style.setProperty("--height", height);
  
    navContainer.lastElementChild.style.transform = "none";
  }
}

function resetNavList() {
  navList.style.setProperty("--height", "0px");
  navList.removeAttribute("data-open");
  navList.style.transform = "translateX(0px)";
  navSelector.checked = false;
}

function navHorizontalController() {
  if (window.innerWidth <= 768) {
    navContainer.lastElementChild.style.transform = "none";
    navList.style.transform = `translateX(-${navContainer.getBoundingClientRect().x}px)`;
  } else {
    resetNavList();
  }
}

function navVerticalController() {
  const isOpen = navList.getAttribute("data-open");
  const isScroll = navContainer.getAttribute("data-scroll");
  const transformStyle = "translateY(-700%)";

  navContainer.parentElement.style.transform = isScroll ? transformStyle : "translateY(0%)";
}

function isViewportAtTop() {
  if (window.scrollY > 10) {
    navContainer.parentElement.classList.add("--header-on-scroll");
  } else {
    navContainer.parentElement.classList.remove("--header-on-scroll");
  }
}

function scrollToSection(link) {
  // Get the data-anchor attribute of the clicked link
  const anchor = link.getAttribute('data-anchor');

  // Find the element with the corresponding ID
  const section = document.getElementById(anchor);

  // Scroll to the section
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

let scrolling = false;
window.addEventListener("scroll", () => {
  if (!scrolling) {
    navContainer.setAttribute("data-scroll", true);
    // navVerticalController();
    scrolling = true;
  }
  // Update navbar background
  isViewportAtTop();

  // Clear previous timeout (if any)
  clearTimeout(window.handleScrollTimeout);

  // Set a timeout to reset scrolling after a delay
  window.handleScrollTimeout = setTimeout(() => {
    navContainer.removeAttribute("data-scroll");
    // navVerticalController();
    scrolling = false;
  }, 200); // Adjust the delay as needed
});

window.addEventListener("load", () => {
  navContainer.removeAttribute("data-scroll");
  //   navVerticalController();
  navHorizontalController();
});
window.addEventListener("resize", () => {
  navHorizontalController();
});
navSelector.addEventListener("click", () => {
  toggleNavbarMobile();
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection(link);
      toggleNavbarMobile();
  });
});
