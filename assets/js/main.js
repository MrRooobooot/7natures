/* 7 Natures — small progressive enhancements */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;

  /* ---- Config: set your real YouTube channel URL here (single place) ---- */
  var YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@SeveNatures";

  root.classList.remove("no-js");

  /* ---- Fill every YouTube link from the single config above ---- */
  doc.querySelectorAll("[data-youtube-link]").forEach(function (el) {
    el.setAttribute("href", YOUTUBE_CHANNEL_URL);
  });

  /* ---- Footer year ---- */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Mobile navigation ---- */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("site-nav");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "بستن منو" : "باز کردن منو");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setMenu(false); toggle.focus(); }
    });

    doc.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }

  /* ---- Hero loop: play only when motion is allowed and the tab is visible ---- */
  var heroVideo = doc.querySelector("[data-hero-video]");
  var saveData = navigator.connection && navigator.connection.saveData;
  if (heroVideo && !saveData && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && typeof heroVideo.play === "function") {
    var showVideo = function () { heroVideo.classList.add("is-playing"); };
    heroVideo.addEventListener("playing", showVideo);
    // Start after the page has loaded so the 1.5 MB clip does not compete with the first paint
    var startHeroVideo = function () {
      heroVideo.load();
      var p = heroVideo.play();
      if (p && typeof p.catch === "function") p.catch(function () { /* autoplay blocked: keep the poster */ });
    };
    if (doc.readyState === "complete") setTimeout(startHeroVideo, 800);
    else window.addEventListener("load", function () { setTimeout(startHeroVideo, 800); });
  }

  /* ---- Header background once the page scrolls ---- */
  var header = doc.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll (staggered) ---- */
  var revealEls = doc.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero content is above the fold on load: show it straight away instead of waiting for the observer
  doc.querySelectorAll(".hero .reveal").forEach(function (el) { el.classList.add("is-visible"); });

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--delay", (i % 4) * 90 + "ms");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Active section highlight in the nav ---- */
  if ("IntersectionObserver" in window && nav) {
    var links = nav.querySelectorAll('a[href^="#"]:not(.btn)');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(map).forEach(function (id) {
      var sec = doc.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }
})();
