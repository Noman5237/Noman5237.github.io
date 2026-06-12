'use strict';




// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// skill bar animation
const skillBars = document.querySelectorAll(".skill-progress-fill");

function animateSkillBars() {
  skillBars.forEach(bar => { bar.style.width = bar.dataset.width + "%"; });
}

function resetSkillBars() {
  skillBars.forEach(bar => {
    bar.style.transition = "none";
    bar.style.width = "0%";
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = ""; }));
  });
}

// project cards + tag pop (effect 9)
const projectCards = document.querySelectorAll(".project-detail-card");

function animateProjectCards() {
  projectCards.forEach((card, i) => {
    const cardDelay = i * 80;
    card.classList.remove("card-enter");
    card.offsetHeight;
    card.style.animationDelay = cardDelay + "ms";
    card.classList.add("card-enter");

    card.querySelectorAll(".project-detail-tools span").forEach((tag, j) => {
      tag.classList.remove("tag-pop");
      tag.style.animationDelay = (cardDelay + 180 + j * 28) + "ms";
      tag.classList.add("tag-pop");
    });
  });
}

function resetProjectCards() {
  projectCards.forEach(card => {
    card.classList.remove("card-enter");
    card.style.animationDelay = "";
    card.querySelectorAll(".project-detail-tools span").forEach(tag => {
      tag.classList.remove("tag-pop");
      tag.style.animationDelay = "";
    });
  });
}

// contact cards slide-in
const contactItems = document.querySelectorAll(".contact-social-item");

function animateContactCards() {
  contactItems.forEach((item, i) => {
    item.classList.remove("card-enter");
    item.offsetHeight;
    item.style.animationDelay = (i * 100) + "ms";
    item.classList.add("card-enter");
  });
}

function resetContactCards() {
  contactItems.forEach(item => {
    item.classList.remove("card-enter");
    item.style.animationDelay = "";
  });
}

// ── effect 10: pixel wipe ──
const PW_COLS = 8, PW_ROWS = 5, PW_STAGGER = 22;
const wipeEl = document.createElement("div");
wipeEl.id = "pixel-wipe";
document.body.appendChild(wipeEl);
for (let r = 0; r < PW_ROWS; r++) {
  for (let c = 0; c < PW_COLS; c++) {
    const b = document.createElement("div");
    b.className = "pw-block";
    b.dataset.d = r + c;
    wipeEl.appendChild(b);
  }
}
const pwBlocks = wipeEl.querySelectorAll(".pw-block");
const pwMaxD = (PW_ROWS - 1) + (PW_COLS - 1);
const pwDuration = pwMaxD * PW_STAGGER + 50;
let isWiping = false;

function pixelWipeTransition(callback) {
  if (isWiping) return;
  isWiping = true;
  pwBlocks.forEach(b => {
    b.style.transitionDelay = (parseInt(b.dataset.d) * PW_STAGGER) + "ms";
    b.classList.add("pw-in");
  });
  setTimeout(() => {
    callback();
    pwBlocks.forEach(b => {
      b.style.transitionDelay = ((pwMaxD - parseInt(b.dataset.d)) * PW_STAGGER) + "ms";
      b.classList.remove("pw-in");
    });
    setTimeout(() => { isWiping = false; }, pwDuration);
  }, pwDuration);
}

// ── effect 8: scroll reveals on about page ──
const revealEls = document.querySelectorAll(".about-text p, .service-item");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i * 80) + "ms";
  revealObserver.observe(el);
});

// nav: extracted page switch + wipe wrapper
function switchPage(targetPage) {
  for (let i = 0; i < pages.length; i++) {
    if (targetPage === pages[i].dataset.page) {
      pages[i].classList.add("active");
      navigationLinks[i].classList.add("active");
      window.scrollTo(0, 0);
      if (pages[i].dataset.page === "skills")   requestAnimationFrame(() => requestAnimationFrame(animateSkillBars));
      if (pages[i].dataset.page === "projects") requestAnimationFrame(() => requestAnimationFrame(animateProjectCards));
      if (pages[i].dataset.page === "contact")  requestAnimationFrame(() => requestAnimationFrame(animateContactCards));
    } else {
      pages[i].classList.remove("active");
      navigationLinks[i].classList.remove("active");
      if (pages[i].dataset.page === "skills")   resetSkillBars();
      if (pages[i].dataset.page === "projects") resetProjectCards();
      if (pages[i].dataset.page === "contact")  resetContactCards();
    }
  }
}

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    pixelWipeTransition(() => switchPage(this.innerHTML.toLowerCase()));
  });
}