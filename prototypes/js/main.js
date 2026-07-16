/* Prototype interactions: nav, theme, filters, form */

(function () {
  const doc = document.documentElement;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const themeBtn = document.querySelector("[data-theme-toggle]");
  const form = document.querySelector("[data-contact-form]");
  const filterChips = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-tags]");

  // Restore theme
  const saved = localStorage.getItem("site-theme");
  if (saved === "light" || saved === "dark") {
    doc.setAttribute("data-theme", saved);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    doc.setAttribute("data-theme", "light");
  }

  function updateThemeIcon() {
    if (!themeBtn) return;
    const isLight = doc.getAttribute("data-theme") === "light";
    themeBtn.setAttribute("aria-label", isLight ? "切换深色主题" : "切换浅色主题");
    themeBtn.innerHTML = isLight
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  }
  updateThemeIcon();

  themeBtn?.addEventListener("click", () => {
    const next = doc.getAttribute("data-theme") === "light" ? "dark" : "light";
    doc.setAttribute("data-theme", next);
    localStorage.setItem("site-theme", next);
    updateThemeIcon();
  });

  // Sticky header style
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  menuToggle?.addEventListener("click", () => {
    const open = mobileNav?.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Project filters
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const key = chip.getAttribute("data-filter");
      projectCards.forEach((card) => {
        const tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        const show = key === "all" || tags.includes(key);
        card.style.display = show ? "" : "none";
      });
    });
  });

  // Contact form mock
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = form.querySelector(".form-success");
    success?.classList.add("is-visible");
    form.reset();
  });
})();
