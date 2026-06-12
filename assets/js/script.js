'use strict';

import { marked } from 'https://esm.sh/marked@12';




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

// level-up timeline nodes
const expNodes = document.querySelectorAll(".lvl-node");

function animateExpNodes() {
  expNodes.forEach((node, i) => {
    node.classList.remove("lvl-enter");
    node.offsetHeight;
    node.style.animationDelay = (i * 140) + "ms";
    node.classList.add("lvl-enter");
  });
}

function resetExpNodes() {
  expNodes.forEach(node => {
    node.classList.remove("lvl-enter");
    node.style.animationDelay = "";
  });
}

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

// ── effect 10: static noise wipe ──
const canvas = document.createElement("canvas");
canvas.id = "pixel-wipe";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
const TILE = 14;
const NOISE_COLORS = ["#0a0a14", "#e8eef8", "#0e78c2"];
let isWiping = false;

function resizeNoise() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeNoise();
window.addEventListener("resize", resizeNoise);

function drawNoise(density) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cols = Math.ceil(canvas.width / TILE);
  const rows = Math.ceil(canvas.height / TILE);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < density) {
        ctx.fillStyle = NOISE_COLORS[Math.floor(Math.random() * NOISE_COLORS.length)];
        ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
      }
    }
  }
}

const PHASE_MS = 320;
let callbackFired = false;

function pixelWipeTransition(callback) {
  if (isWiping) return;
  isWiping = true;
  callbackFired = false;
  canvas.style.display = "block";
  const t0 = performance.now();

  function step(now) {
    const t = now - t0;
    if (t < PHASE_MS) {
      drawNoise(t / PHASE_MS);
      requestAnimationFrame(step);
    } else {
      if (!callbackFired) { drawNoise(1); callback(); callbackFired = true; }
      const t2 = t - PHASE_MS;
      if (t2 < PHASE_MS) {
        drawNoise(Math.max(0, 1 - t2 / PHASE_MS));
        requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
        isWiping = false;
      }
    }
  }

  requestAnimationFrame(step);
}

// ── effect 8: scroll reveals on about page ──
const revealEls = document.querySelectorAll(".about-text p, .service-item, .about-chat-fake-input");
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
      if (pages[i].dataset.page === "experience") requestAnimationFrame(() => requestAnimationFrame(animateExpNodes));
      if (pages[i].dataset.page === "skills")    requestAnimationFrame(() => requestAnimationFrame(animateSkillBars));
      if (pages[i].dataset.page === "projects")  requestAnimationFrame(() => requestAnimationFrame(animateProjectCards));
      if (pages[i].dataset.page === "contact")   requestAnimationFrame(() => requestAnimationFrame(animateContactCards));
    } else {
      pages[i].classList.remove("active");
      navigationLinks[i].classList.remove("active");
      if (pages[i].dataset.page === "experience") resetExpNodes();
      if (pages[i].dataset.page === "skills")     resetSkillBars();
      if (pages[i].dataset.page === "projects")   resetProjectCards();
      if (pages[i].dataset.page === "contact")    resetContactCards();
    }
  }
}

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    pixelWipeTransition(() => switchPage(this.innerHTML.toLowerCase()));
  });
}



// ── Chat Modal ──
const chatModal     = document.getElementById("chatModal");
const chatModalClose = document.getElementById("chatModalClose");
const sidebarChatBtn = document.getElementById("sidebarChatBtn");
const aboutChatTrigger = document.getElementById("aboutChatTrigger");

function openChatModal() {
  chatModal.classList.add("active");
  document.getElementById("chatInput").focus();
}

function closeChatModal() {
  chatModal.classList.remove("active");
}

sidebarChatBtn.addEventListener("click", openChatModal);
aboutChatTrigger.addEventListener("click", openChatModal);
chatModalClose.addEventListener("click", closeChatModal);
chatModal.addEventListener("click", e => { if (e.target === chatModal) closeChatModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeChatModal(); });

// ── Chat Widget ──
const CHAT_WORKER_URL = "https://portfolio-chat.anonyman637.workers.dev";

(function initChat() {
  const messagesEl = document.getElementById("chatMessages");
  const inputEl    = document.getElementById("chatInput");
  const sendBtn    = document.getElementById("chatSend");
  if (!messagesEl || !inputEl || !sendBtn) return;

  const MAX_USER_MSGS  = 20;
  const CONTEXT_WINDOW = 8;
  const SESSION_KEY    = "noman_chat_count";

  let chatHistory = [];
  let isStreaming  = false;

  function getCount()  { return parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10); }
  function bumpCount() { const n = getCount() + 1; sessionStorage.setItem(SESSION_KEY, n); return n; }

  function lockChat() {
    inputEl.disabled    = true;
    sendBtn.disabled    = true;
    inputEl.placeholder = "> session limit reached";
  }

  // restore locked state if user re-opens modal in same session
  if (getCount() >= MAX_USER_MSGS) lockChat();

  inputEl.addEventListener("input", () => {
    sendBtn.disabled = inputEl.value.trim() === "" || isStreaming;
  });

  inputEl.addEventListener("keydown", e => {
    if (e.key === "Enter" && !sendBtn.disabled) handleSend();
  });

  sendBtn.addEventListener("click", handleSend);

  function appendMsg(role, html) {
    const wrap  = document.createElement("div");
    wrap.className = `msg msg-${role}`;
    const inner = document.createElement("div");
    inner.className = "msg-content";
    inner.innerHTML = html;
    wrap.appendChild(inner);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return inner;
  }

  async function handleSend() {
    const text = inputEl.value.trim();
    if (!text || isStreaming) return;

    inputEl.value = "";
    sendBtn.disabled = true;
    isStreaming = true;

    const count = bumpCount();

    chatHistory.push({ role: "user", content: text });
    appendMsg("user", marked.parse(text));

    const contentEl = appendMsg("assistant", "");
    contentEl.classList.add("streaming");

    let full = "";
    try {
      const res = await fetch(CHAT_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory.slice(-CONTEXT_WINDOW) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
            if (delta) {
              full += delta;
              contentEl.innerHTML = marked.parse(full);
              messagesEl.scrollTop = messagesEl.scrollHeight;
            }
          } catch {}
        }
      }
    } catch {
      full = "_Looks like my chat backend ghosted us. Classic infrastructure — works until it doesn't. Try again in a moment._";
      contentEl.innerHTML = marked.parse(full);
    }

    contentEl.classList.remove("streaming");
    chatHistory.push({ role: "assistant", content: full });
    isStreaming = false;

    if (count >= MAX_USER_MSGS) {
      appendMsg("assistant", marked.parse("Alright, 20 questions — I think you know enough about me now. If you want more, my email is right there on this page. Seriously though, it was fun. Come back anytime... well, next session anytime."));
      lockChat();
    } else {
      sendBtn.disabled = inputEl.value.trim() === "";
    }
  }
})();