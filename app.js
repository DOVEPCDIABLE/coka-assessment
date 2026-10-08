"use strict";
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  mobileNav.hidden = true;
}
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
  mobileNav.hidden = isOpen;
});
mobileNav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const filters = document.querySelectorAll("[data-filter]");
filters.forEach((button) =>
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    let count = 0;
    document.querySelectorAll("[data-category]").forEach((card) => {
      card.hidden = selected !== "all" && card.dataset.category !== selected;
      if (!card.hidden) count++;
    });
    document.querySelector("#filter-status").textContent =
      `${count} initiatives shown.`;
  }),
);

const dialog = document.querySelector("#detail-dialog");
const dialogContent = document.querySelector("#dialog-content");
const linkedin = "https://ng.linkedin.com/in/crystal-kizor";
let dialogTrigger;
function openDialog(content, trigger) {
  dialogTrigger = trigger;
  dialogContent.innerHTML = content;
  dialog.showModal();
  document.body.classList.add("modal-open");
  dialog.scrollTop = 0;
}
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (dialogTrigger) dialogTrigger.focus();
});
const initiatives = {
  elevated: {
    category: "SPACES & OBJECTS",
    title: "Everyday, elevated.",
    description:
      "ELEvated is a contemporary furniture and product design brand. It brings African context, materials and ideas into functional, considered objects for everyday life.",
    next: "Interested in the brand, a product or a design collaboration? Connect with Crystal to find out more.",
    subject: "ELEvated enquiry",
  },
  tea: {
    category: "IDEAS & LEARNING",
    title: "Build a better practice.",
    description:
      "The Effective Architect (TEA) is an architecture education and media platform helping architects and built-environment professionals learn, grow and build better careers.",
    next: "Connect with Crystal to ask about the platform, learning opportunities or contributing to the conversation.",
    subject: "The Effective Architect enquiry",
  },
  ako: {
    category: "PEOPLE & POSSIBILITY",
    title: "Opportunity opens doors.",
    description:
      "AKO Alliance focuses on expanding access to education and creating opportunities for children and young people.",
    next: "If you are interested in supporting the mission or exploring a partnership, start a conversation with Crystal.",
    subject: "AKO Alliance partnership",
  },
  alive: {
    category: "PEOPLE & POSSIBILITY",
    title: "A life of purpose.",
    description:
      "Alive and Free is a Christian youth movement helping young people walk in truth, healing, freedom, identity, purpose and life in Christ.",
    next: "Connect with Crystal to learn more about the movement, gatherings and ways to get involved.",
    subject: "Alive and Free enquiry",
  },
};
document.querySelectorAll("[data-initiative]").forEach((button) =>
  button.addEventListener("click", () => {
    const item = initiatives[button.dataset.initiative];
    openDialog(
      `<p class="eyebrow">${item.category}</p><h2 id="dialog-title">${item.title}</h2><p>${item.description}</p><p>${item.next}</p><button class="button button-dark" id="initiative-contact">Connect with Crystal <span aria-hidden="true">↗</span></button>`,
      button,
    );
    document
      .querySelector("#initiative-contact")
      .addEventListener("click", () => showContact(item.subject, button));
  }),
);
const projects = {
  nature: {
    title: "Nature Home",
    category: "ARCHITECTURE & INTERIORS · ENUGU, NIGERIA",
    image: "nature-home",
    alt: "A tree shading the Nature Home courtyard",
    text: "A home shaped around its relationship with nature. The planting, shaded outdoor spaces and considered openings place everyday comfort at the centre of the design.",
    note: "Project photography supplied for this assessment.",
  },
  community: {
    title: "Community Centre",
    category: "COMMUNITY & CULTURE · DESIGN CONCEPT",
    image: "community-centre",
    alt: "Community Centre concept with a central tree and timber canopy",
    text: "A shared place for learning, gathering and connection. The supplied concept imagery explores generous communal spaces, natural materials and a close relationship with the landscape.",
    note: "Concept visualisation supplied for this assessment; shown as a design proposal, not a completed building.",
  },
  naturetwo: {
    title: "Nature Home 2",
    category: "CLIMATE-RESPONSIVE DESIGN · DESIGN CONCEPT",
    image: "nature-home-two",
    alt: "Nature Home 2 concept with earthy walls and generous roof shade",
    text: "An exploration of nature-led living, with earthy textures, sheltered spaces and a strong connection between indoors and outdoors.",
    note: "Concept visualisation supplied for this assessment; shown as a design proposal, not a completed building.",
  },
};
document.querySelectorAll("[data-project]").forEach((button) =>
  button.addEventListener("click", () => {
    const item = projects[button.dataset.project];
    openDialog(
      `<p class="eyebrow">${item.category}</p><h2 id="dialog-title">${item.title}</h2><img class="dialog-image" src="assets/${item.image}.webp" alt="${item.alt}"><p>${item.text}</p><p class="dialog-note">${item.note}</p><a class="button button-dark" href="https://studiocoka.com" target="_blank" rel="noopener noreferrer">Explore Studio COKA <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`,
      button,
    );
  }),
);
function showContact(subject, trigger) {
  const draft = `Hello Crystal,\n\nI’m reaching out about ${subject.toLowerCase()}.\n\nA little about what I have in mind:\n\n`;
  openDialog(
    `<p class="eyebrow">LET’S START A CONVERSATION</p><h2 id="dialog-title">${subject}</h2><p>Introduce yourself and share what you have in mind. Copy your note, then send it to Crystal on LinkedIn.</p><label for="contact-message">Your message</label><textarea id="contact-message" maxlength="3000"></textarea><p class="dialog-note">This page doesn’t collect or send your information. You’ll send your message directly on LinkedIn.</p><div class="contact-actions"><button class="button button-dark" id="copy-message">Copy message <span aria-hidden="true">↗</span></button><a class="button button-outline" href="${linkedin}" target="_blank" rel="noopener noreferrer">Open LinkedIn <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a></div>`,
    trigger,
  );
  const field = document.querySelector("#contact-message");
  field.value = draft;
  document
    .querySelector("#copy-message")
    .addEventListener("click", async () => {
      if (!field.value.trim()) {
        field.focus();
        return;
      }
      try {
        await navigator.clipboard.writeText(field.value);
        showToast("Message copied. Ready to paste on LinkedIn.");
      } catch {
        field.focus();
        field.select();
        showToast("Select and copy your message, then open LinkedIn.");
      }
    });
}
document
  .querySelectorAll("[data-contact]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      showContact(button.dataset.contact, button),
    ),
  );
let toastTimer;
function showToast(message) {
  const toast = document.querySelector(".toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 4000);
}
document.querySelector("#year").textContent = new Date().getFullYear();
