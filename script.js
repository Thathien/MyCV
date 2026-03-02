// index.js
// Pure jQuery implementation

(function ($) {
  "use strict";

  /* ==========================
     CONFIG
  ========================== */

  const CONFIG = {
    animationDuration: 800,
    easing: "easeOutExpo",
    debounceTime: 120,
    revealOffset: 150,
    skillOffset: 200,
  };

  /* ==========================
     UTILITIES
  ========================== */

  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  // Custom easing
  $.easing.easeOutExpo = function (x, t, b, c, d) {
    return t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  };

  /* ==========================
     MODULE
  ========================== */

  const CVApp = (function () {
    /* ===== Cache selectors ===== */

    const $window = $(window);
    const $body = $("body");
    const $themeBtn = $("#theme-toggle");
    const $printBtn = $("#print-btn");
    const $hamburger = $("#hamburger");
    const $mainNav = $("#main-nav");
    const $reveal = $(".reveal");
    const $skillBars = $(".skill-bar");
    const $anchors = $('a[href^="#"]');
    const $toggleExpand = $(".toggle-expand");

    /* ==========================
       THEME TOGGLE
    ========================== */

    function initTheme() {
      $themeBtn.on("click keypress", function (e) {
        if (e.type === "keypress" && e.key !== "Enter") return;

        const current = $body.attr("data-theme");
        $body.attr("data-theme", current === "dark" ? "light" : "dark");
      });
    }

    /* ==========================
       PRINT
    ========================== */

    function initPrint() {
      $printBtn.on("click keypress", function (e) {
        if (e.type === "keypress" && e.key !== "Enter") return;
        window.print();
      });
    }

    /* ==========================
       HAMBURGER MENU
    ========================== */

    function initMenu() {
      $hamburger.on("click keypress", function (e) {
        if (e.type === "keypress" && e.key !== "Enter") return;

        const expanded = $hamburger.attr("aria-expanded") === "true";

        $hamburger.attr("aria-expanded", !expanded);
        $mainNav.stop().slideToggle(250);
      });
    }

    /* ==========================
       REVEAL ON SCROLL
    ========================== */

    function revealOnScroll() {
      const scrollTop = $window.scrollTop();
      const windowHeight = $window.height();

      $reveal.each(function () {
        const $el = $(this);

        if ($el.hasClass("visible")) return;

        const elementTop = $el.offset().top;

        if (scrollTop + windowHeight - CONFIG.revealOffset > elementTop) {
          $el.addClass("visible");
        }
      });
    }

    /* ==========================
       SKILL ANIMATION
    ========================== */

    function animateSkills() {
      const scrollTop = $window.scrollTop();
      const windowHeight = $window.height();

      $skillBars.each(function () {
        const $bar = $(this);

        if ($bar.data("animated")) return;

        const elementTop = $bar.offset().top;

        if (scrollTop + windowHeight - CONFIG.skillOffset > elementTop) {
          const percent = $bar.data("percent") || 60;

          $bar
            .find("span")
            .animate(
              { width: percent + "%" },
              CONFIG.animationDuration,
              CONFIG.easing,
            );

          $bar.data("animated", true);
        }
      });
    }

    /* ==========================
       SMOOTH SCROLL
    ========================== */

    function initSmoothScroll() {
      $anchors.on("click", function (e) {
        const target = $(this).attr("href");
        if (!target.startsWith("#")) return;

        const $target = $(target);
        if (!$target.length) return;

        e.preventDefault();

        $("html, body").animate(
          { scrollTop: $target.offset().top - 60 },
          600,
          CONFIG.easing,
        );
      });
    }

    /* ==========================
       SCROLL BIND
    ========================== */

    function bindScroll() {
      $window.on(
        "scroll",
        debounce(function () {
          revealOnScroll();
          animateSkills();
        }, CONFIG.debounceTime),
      );
    }

    /* ==========================
       INIT
    ========================== */

    function init() {
      initTheme();
      initPrint();
      initMenu();
      initSmoothScroll();
      initShowMore();
      bindScroll();

      // run once on load
      revealOnScroll();
      animateSkills();
    }

    return {
      init: init,
    };
  })();

  /* ==========================
     DOCUMENT READY
  ========================== */

  $(document).ready(function () {
    CVApp.init();
  });
})(jQuery);
