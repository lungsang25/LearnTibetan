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
