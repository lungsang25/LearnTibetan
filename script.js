// Scroll-reveal
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e, i) {
      e.style.transitionDelay = (i % 3) * 70 + 'ms';
      io.observe(e);
    });
  }

  // Store badges are placeholders until the app is published.
  // When live, replace href and remove aria-disabled / the "Soon" tag.
  document.querySelectorAll('.store[aria-disabled="true"]').forEach(function (a) {
    a.addEventListener('click', function (ev) { ev.preventDefault(); });
  });

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();

// Mobile: carousel dots + sticky CTA
(function () {
  var shots = document.getElementById('shots');
  var dots = document.getElementById('dots');
  if (shots && dots) {
    var figs = shots.querySelectorAll('figure');
    figs.forEach(function () { dots.appendChild(document.createElement('i')); });
    var set = function () {
      var c = shots.scrollLeft + shots.clientWidth / 2, best = 0, bd = 1e9;
      figs.forEach(function (f, i) {
        if (!f.offsetWidth) return;
        var d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - c);
        if (d < bd) { bd = d; best = i; }
      });
      dots.querySelectorAll('i').forEach(function (d, i) { d.classList.toggle('on', i === best); });
    };
    shots.addEventListener('scroll', function () { requestAnimationFrame(set); }, { passive: true });
    window.addEventListener('resize', set);
    set();
  }

  var sticky = document.getElementById('sticky');
  var hero = document.querySelector('.hero');
  var dl = document.getElementById('download');
  if (sticky && hero && dl && 'IntersectionObserver' in window) {
    var heroOut = false, dlIn = false;
    var upd = function () {
      var on = heroOut && !dlIn;
      sticky.classList.toggle('show', on);
      sticky.setAttribute('aria-hidden', on ? 'false' : 'true');
      sticky.tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(function (e) { heroOut = !e[0].isIntersecting; upd(); }, { threshold: 0, rootMargin: '-120px 0px 0px 0px' }).observe(hero);
    new IntersectionObserver(function (e) { dlIn = e[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(dl);
  }
})();
