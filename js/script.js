// vanilla JS enhancement script
// Combines theme toggle, print, nav, reveal, skills, smooth scroll, and responsive behavior

(function () {
  "use strict";

  const body = document.body;
  const themeBtn = document.getElementById("theme-toggle");
  const printBtn = document.getElementById("print-btn");
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("main-nav");
  const anchors = document.querySelectorAll('a[href^="#"]');
  const revealEls = document.querySelectorAll(".reveal");
  const skillBars = document.querySelectorAll(".skill-bar");

  // debounce helper
  function debounce(fn, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, arguments), delay);
    };
  }

  // theme switcher
  function toggleTheme() {
    const next = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", next);
  }

  // hamburger navigation
  function toggleMenu() {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    mainNav.classList.toggle("open");
  }

  function closeMenu() {
    if (window.innerWidth < 769 && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  }

  // smooth scroll handler
  function handleAnchorClick(e) {
    const href = this.getAttribute("href");
    if (!href.startsWith("#")) return;
    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    e.preventDefault();
    const headerHeight = document.querySelector(".header").offsetHeight || 0;
    const dest = Math.max(0, targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10);

    window.scrollTo({ top: dest, behavior: "smooth" });

    if (history.pushState) {
      history.pushState(null, null, href);
    } else {
      window.location.hash = href;
    }

    closeMenu();
  }

  // Intersection observers
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const pct = el.getAttribute("data-percent") || "60";
          el.querySelector("span").style.width = pct + "%";
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.addEventListener("DOMContentLoaded", () => {    // fade in body
    document.body.classList.add("loaded");

    // cursor trail effect - sparkle particles follow mouse
    const trailContainer = document.getElementById("cursor-trail");
    let frameCount = 0;
    document.addEventListener("mousemove", (e) => {
      frameCount++;
      // create particle every 3 frames to avoid too many
      if (frameCount % 3 === 0) {
        const particle = document.createElement("div");
        particle.className = "cursor-particle";
        particle.style.left = e.clientX + "px";
        particle.style.top = e.clientY + "px";
        particle.style.transform = `translate(-50%, -50%)`;
        trailContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
      }
    });

    themeBtn.addEventListener("click", toggleTheme);
    printBtn.addEventListener("click", () => window.print());
    hamburger.addEventListener("click", toggleMenu);
    anchors.forEach(a => a.addEventListener("click", handleAnchorClick));

    revealEls.forEach(el => revealObserver.observe(el));
    skillBars.forEach(el => skillObserver.observe(el));

    window.addEventListener("resize", debounce(() => {
      if (window.innerWidth > 768) {
        mainNav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    }, 120));

    // scroll-to-top button handling
    const scrollBtn = document.getElementById("scroll-top");
    function updateScrollBtn() {
      const trigger = window.innerHeight;
      const closeToBottom = window.pageYOffset + window.innerHeight >= document.body.scrollHeight - 100;
      if (window.pageYOffset > trigger && !closeToBottom) {
        scrollBtn.classList.add("visible");
      } else {
        scrollBtn.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", debounce(updateScrollBtn, 100));
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    // run once
    updateScrollBtn();

    // Certification tooltip preview - now handled by CSS :hover
    const certLinks = document.querySelectorAll(".cert-link");
    certLinks.forEach(link => {
      const title = link.getAttribute("data-cert-title");
      const issuer = link.getAttribute("data-cert-issuer");
      const date = link.getAttribute("data-cert-date");
      
      const tooltip = document.createElement("div");
      tooltip.className = "cert-tooltip";
      tooltip.innerHTML = `
        <span class="cert-tooltip-title">${title}</span>
        <span class="cert-tooltip-issuer">${issuer} • ${date}</span>
      `;
      link.appendChild(tooltip);
    });
  });
})();
