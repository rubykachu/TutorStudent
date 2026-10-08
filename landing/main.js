// Language toggle (EN/VI), the mobile menu and the demo-code copy button. No other behaviour.
const STORAGE_KEY = "lang";
const TITLES = {
  en: "toktiktak | Owl Yeah, the self-study app for grade 6",
  vi: "toktiktak | Owl Yeah, ứng dụng tự học cho học sinh lớp 6",
};
const COPIED = { en: "Code copied", vi: "Đã sao chép mã" };

const root = document.documentElement;
const currentLang = () => (root.lang === "vi" ? "vi" : "en");

function applyLang(lang) {
  root.lang = lang;
  document.title = TITLES[lang];
  for (const button of document.querySelectorAll("[data-set-lang]")) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.setLang === lang),
    );
  }
  for (const el of document.querySelectorAll("[data-aria-en]")) {
    el.setAttribute(
      "aria-label",
      el.dataset[lang === "vi" ? "ariaVi" : "ariaEn"],
    );
  }
}

for (const button of document.querySelectorAll("[data-set-lang]")) {
  button.addEventListener("click", () => {
    const lang = button.dataset.setLang;
    applyLang(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage blocked (private mode): the choice lasts for this page view only.
    }
  });
}

applyLang(currentLang());

const copyButton = document.getElementById("copy-btn");
const code = document.getElementById("demo-code");
const status = document.getElementById("copy-status");
let resetTimer;

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API unavailable (insecure context, old browser): select the code so the user can copy it.
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return document.execCommand?.("copy") ?? false;
  }
}

copyButton.addEventListener("click", async () => {
  if (!(await copyText(code.textContent.trim()))) return;
  copyButton.classList.add("is-copied");
  status.textContent = COPIED[currentLang()];
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    copyButton.classList.remove("is-copied");
    status.textContent = "";
  }, 2000);
});

// Mobile menu: the nav is hidden below 1024px and this button reveals it.
const menuButton = document.getElementById("menu-btn");
const nav = document.getElementById("site-nav");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
}

menuButton.addEventListener("click", () =>
  setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
);
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key !== "Escape" ||
    menuButton.getAttribute("aria-expanded") !== "true"
  )
    return;
  setMenu(false);
  menuButton.focus();
});
