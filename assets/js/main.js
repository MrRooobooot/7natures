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

  /* ---- Hero reel: crossfade between single-shot clips ---- */
  // Desktop gets the 1920px clips, phones and small screens get the 960px clips (about a third of the bytes)
  var isWide = window.matchMedia("(min-width: 900px)").matches;
  var heroClips = isWide ? [
    "assets/img/hero-1-aerial-1920.mp4",
    "assets/img/hero-2-river-1920.mp4",
    "assets/img/hero-3-pine-1920.mp4"
  ] : [
    "assets/img/hero-1-aerial-960.mp4",
    "assets/img/hero-2-river-960.mp4",
    "assets/img/hero-3-pine-960.mp4"
  ];
  var heroVids = doc.querySelectorAll("[data-hero-video]");
  var saveData = navigator.connection && navigator.connection.saveData;
  var canPlay = heroVids.length === 2 && !saveData &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    typeof heroVids[0].play === "function";

  if (canPlay) {
    var active = 0;

    var loadClip = function (el, i) {
      el.dataset.clip = i;
      el.src = heroClips[i];
      el.load();
    };

    // Swap to the other element a little before the clip ends, so the crossfade covers the cut
    var swapClip = function () {
      var from = heroVids[active];
      var to = heroVids[1 - active];
      if (from.dataset.switching === "1") return;
      from.dataset.switching = "1";
      to.currentTime = 0;
      var p = to.play();
      var done = function () {
        to.classList.add("is-active");
        from.classList.remove("is-active");
        active = 1 - active;
        from.dataset.switching = "0";
        loadClip(from, (Number(to.dataset.clip) + 1) % heroClips.length);
      };
      if (p && typeof p.then === "function") p.then(done, function () { from.dataset.switching = "0"; });
      else done();
    };

    heroVids.forEach(function (v) {
      v.addEventListener("timeupdate", function () {
        if (v !== heroVids[active] || !v.duration) return;
        if (v.duration - v.currentTime < 1.2) swapClip();
      });
      v.addEventListener("ended", function () { if (v === heroVids[active]) swapClip(); });
    });

    var startHeroReel = function () {
      loadClip(heroVids[0], 0);
      heroVids[0].classList.add("is-active");
      // Only the first clip is fetched up front; the next one loads once the first is playing
      heroVids[0].addEventListener("playing", function once() {
        heroVids[0].removeEventListener("playing", once);
        loadClip(heroVids[1], 1);
      });
      var p = heroVids[0].play();
      if (p && typeof p.catch === "function") p.catch(function () { /* autoplay blocked: keep the poster */ });
    };
    // Start after the page has loaded so the clips do not compete with the first paint
    if (doc.readyState === "complete") setTimeout(startHeroReel, 800);
    else window.addEventListener("load", function () { setTimeout(startHeroReel, 800); });
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
