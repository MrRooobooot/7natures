/* SVN shared enhancements: nav, hero reel, reveal, scroll spy, timecode */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.remove("no-js");

  var toPersianDigits = function (s) {
    return String(s).replace(/[0-9]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; });
  };
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = toPersianDigits(new Date().getFullYear());
  });

  /* ---- Mobile navigation ---- */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("site-nav");
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    doc.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
    });
    doc.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760 && toggle.getAttribute("aria-expanded") === "true") setMenu(false);
    });
  }

  /* ---- Hero pause (stops reel, zoom and timecode) ---- */
  var heroMedia = doc.querySelector(".hero-media");
  var pauseBtn = doc.querySelector(".hero-pause");
  var heroPaused = false;
  var heroReel = null;
  var onPauseChange = [];

  function setHeroPaused(paused) {
    heroPaused = paused;
    if (heroMedia) heroMedia.classList.toggle("is-paused", paused);
    if (pauseBtn) pauseBtn.setAttribute("aria-pressed", String(paused));
    if (heroReel) heroReel(paused);
    onPauseChange.forEach(function (fn) { fn(paused); });
  }
  if (pauseBtn) {
    if (reduceMotion) pauseBtn.hidden = true;
    pauseBtn.addEventListener("click", function () { setHeroPaused(!heroPaused); });
  }

  /* ---- Hero reel: crossfade between single-shot clips ----
     Config: <div class="hero-media" data-clips-wide="a.mp4,b.mp4" data-clips-narrow="a-s.mp4,b-s.mp4"> */
  var heroVids = doc.querySelectorAll("[data-hero-video]");
  if (heroMedia && heroVids.length === 2 && heroMedia.dataset.clipsWide) {
    var isWide = window.matchMedia("(min-width: 900px)").matches;
    var list = (isWide ? heroMedia.dataset.clipsWide : heroMedia.dataset.clipsNarrow || heroMedia.dataset.clipsWide).split(",");
    var saveData = navigator.connection && navigator.connection.saveData;
    var canPlay = !saveData && !reduceMotion && typeof heroVids[0].play === "function";

    if (canPlay) {
      var active = 0;
      var loadClip = function (el, i) { el.dataset.clip = i; el.src = list[i]; el.load(); };

      var swapClip = function () {
        if (heroPaused) return;
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
          loadClip(from, (Number(to.dataset.clip) + 1) % list.length);
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

      var heroStarted = false;
      var startHeroReel = function () {
        if (heroStarted || heroPaused) return;
        heroStarted = true;
        loadClip(heroVids[0], 0);
        heroVids[0].classList.add("is-active");
        heroVids[0].addEventListener("playing", function once() {
          heroVids[0].removeEventListener("playing", once);
          if (list.length > 1) loadClip(heroVids[1], 1);
        });
        var p = heroVids[0].play();
        if (p && typeof p.catch === "function") p.catch(function () {});
      };

      heroReel = function (paused) {
        if (paused) { heroVids.forEach(function (v) { v.pause(); }); return; }
        if (!heroStarted) { startHeroReel(); return; }
        var cur = heroVids[active];
        if (cur.ended) { swapClip(); return; }
        var p = cur.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
      };

      if (doc.readyState === "complete") setTimeout(startHeroReel, 600);
      else window.addEventListener("load", function () { setTimeout(startHeroReel, 600); });
    }
  }

  /* ---- Viewfinder timecode (decorative) ---- */
  var tc = doc.querySelector("[data-timecode]");
  if (tc && !reduceMotion) {
    var FPS = 30000 / 1001;
    var t0 = performance.now();
    var elapsed = 0;
    var running = true;
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    onPauseChange.push(function (paused) {
      running = !paused;
      if (running) t0 = performance.now() - elapsed;
    });
    var tick = function (now) {
      if (running && !doc.hidden) {
        elapsed = now - t0;
        var frames = Math.floor(elapsed / 1000 * FPS);
        var f = frames % 30;
        var s = Math.floor(frames / 30) % 60;
        var m = Math.floor(frames / 1800) % 60;
        var h = Math.floor(frames / 108000);
        tc.textContent = pad(h) + ":" + pad(m) + ":" + pad(s) + ":" + pad(f);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---- Header state + back to top ---- */
  var header = doc.querySelector(".site-header");
  var toTop = doc.querySelector(".to-top");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll (staggered) ---- */
  var revealEls = doc.querySelectorAll(".reveal");
  doc.querySelectorAll(".hero .reveal").forEach(function (el) { el.classList.add("is-visible"); });
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    revealEls.forEach(function (el, i) { el.style.setProperty("--delay", (i % 4) * 90 + "ms"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Active section in the nav ---- */
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
