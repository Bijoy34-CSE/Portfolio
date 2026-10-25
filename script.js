/* ==========================================================
   Content data: edit this section to update the site
   ========================================================== */
const SKILLS = {
  Frontend: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js",
  ],
  "Backend & Database": [
    "Node.js",
    "Express.js",
    "MongoDB",
  ],
  "Programming & Academic": [
    "C/C++",
    "Python fundamentals",
    "Machine Learning fundamentals",
  ],
  Tools: [
    "Git",
    "GitHub",
    "VS Code",
  ],
};

const PROJECTS = [
  {
    id: "project-1",
    name: "InterviewMate",
    image: "images/interviewmate.jpeg",
    summary: "An AI-assisted viva and interview preparation platform concept.",
    description:
      "A system designed to help users practise job interviews, course vivas, internships, scholarship and admission interviews, and certification questions. It aims to support adaptive practice with text and voice-based interaction.",
    stack: ["MERN (planned; final stack to confirm)"],
    challenges: [],
    future: [
      "Improve feedback quality.",
      "Add more practice modes.",
      "Refine session analytics.",
    ],
  },
  {
    id: "project-2",
    name: "Narail Students Forum (NSF)",
    image: "images/nsf-forum.jpg",
    summary: "A student association website concept for Khulna University.",
    description:
      "A planned dynamic website for Narail Students Forum (NSF), Khulna University, with public information and an admin panel for managing site content.",
    stack: ["MERN (planned; implementation to confirm)"],
    challenges: [],
    future: [
      "Complete content management.",
      "Improve mobile usability.",
      "Add member and event features if needed.",
    ],
  },
  {
    id: "project-3",
    name: "Human Activity Recognition (HAR)",
    image: "images/har-research.svg",
    summary: "Academic machine-learning research on human activity recognition from video.",
    description:
      "An academic project exploring human activity recognition from video sequences using CNN-based frame features and a recurrent model for temporal information.",
    stack: ["Python", "PyTorch", "Pretrained CNN", "Bi-directional Residual GRU (draft)"],
    challenges: [],
    future: [
      "Evaluate on additional data.",
      "Improve model efficiency.",
      "Explore deployment on a low-resource device.",
    ],
  },
];

/* ==========================================================
   Helpers
   ========================================================== */
const $ = (selector) => document.querySelector(selector);
const listItems = (items) => items.map((item) => `<li>${item}</li>`).join("");

/* ==========================================================
   Theme (light / dark)
   ========================================================== */
const root = document.documentElement;
const themeToggle = $("#theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
  );
}

applyTheme(root.getAttribute("data-theme") || "light");

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
});

/* ==========================================================
   Mobile menu
   ========================================================== */
const menuToggle = $("#menu-toggle");
const nav = $("#site-nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ==========================================================
   Render: skills and projects
   ========================================================== */
$("#skills-grid").innerHTML = Object.entries(SKILLS)
  .map(
    ([category, items]) => `
    <div class="card skill-card">
      <h3>${category}</h3>
      <ul class="tags">${listItems(items)}</ul>
    </div>`
  )
  .join("");

$("#projects-grid").innerHTML = PROJECTS.map(
  (p) => `
  <article class="card project-card">
    <img src="${p.image}" alt="Illustration for ${p.name}" loading="lazy" width="1200" height="750">
    <div class="project-body">
      <h3>${p.name}</h3>
      <p>${p.summary}</p>
      <ul class="tags">${listItems(p.stack.slice(0, 3))}</ul>
      <a class="btn btn-outline" href="#${p.id}">View Details</a>
    </div>
  </article>`
).join("");

/* ==========================================================
   Highlight the current section in the navigation
   ========================================================== */
const navLinks = [...nav.querySelectorAll("a")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) =>
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id)
        );
      }
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("#main-view section[id]").forEach((s) => sectionObserver.observe(s));
}

/* ==========================================================
   Simple hash router: #project-N shows the project detail page
   ========================================================== */
const mainView = $("#main-view");
const projectView = $("#project-view");
const detail = $("#project-detail");
const BASE_TITLE = document.title;

function renderProject(p) {
  detail.innerHTML = `
    <a class="back-link" href="#projects">
      <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg> Back to projects
    </a>
    <article class="detail">
      <h1>${p.name}</h1>
      <img class="cover" src="${p.image}" alt="Illustration for ${p.name}" width="1200" height="750">

      <h2>Technology stack</h2>
      <ul class="tags">${listItems(p.stack)}</ul>

      <h2>Overview</h2>
      <p>${p.description}</p>

      ${p.challenges.length ? `
      <h2>Challenges faced</h2>
      <ul class="list">${listItems(p.challenges)}</ul>` : ""}

      <h2>Future improvements</h2>
      <ul class="list">${listItems(p.future)}</ul>

      ${p.live || p.github ? `<div class="btn-row">
        ${p.live ? `<a class="btn btn-primary" href="${p.live}" target="_blank" rel="noopener">Live project</a>` : ""}
        ${p.github ? `<a class="btn btn-outline" href="${p.github}" target="_blank" rel="noopener">GitHub repository</a>` : ""}
      </div>` : ""}
    </article>`;
}

function route() {
  const hash = decodeURIComponent(location.hash.slice(1));
  const project = PROJECTS.find((p) => p.id === hash);

  if (project) {
    renderProject(project);
    mainView.hidden = true;
    projectView.hidden = false;
    document.title = `${project.name} | Bijoy Kumar Paul`;
    window.scrollTo(0, 0);
    return;
  }

  const wasHidden = mainView.hidden;
  projectView.hidden = true;
  mainView.hidden = false;
  document.title = BASE_TITLE;

  // After returning from a project page, jump to the requested section
  if (wasHidden) {
    const target = hash && document.getElementById(hash);
    requestAnimationFrame(() => (target ? target.scrollIntoView() : window.scrollTo(0, 0)));
  }
}

window.addEventListener("hashchange", route);
route();

$("#year").textContent = new Date().getFullYear();
