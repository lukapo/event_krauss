(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  var header = document.querySelector('.site-header');
  var nav = document.querySelector('.site-nav');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelectorAll('.site-nav__link[href^="#"]');
  var sections = document.querySelectorAll('section[id]');

  function setNavOpen(isOpen) {
    if (nav) {
      nav.classList.toggle('is-open', isOpen);
    }
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Zatvori izbornik' : 'Otvori izbornik');
    }
  }

  function closeNav() {
    setNavOpen(false);
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('is-open'));
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      closeNav();
      navToggle?.focus();
    }
  });

  document.querySelector('.skip-link')?.addEventListener('click', function () {
    document.getElementById('main-content')?.focus({ preventScroll: true });
  });

  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var currentId = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      link.classList.toggle('is-active', href === '#' + currentId);
    });
  }

  window.addEventListener('scroll', function () {
    updateHeader();
    updateActiveNav();
  }, { passive: true });

  updateHeader();
  updateActiveNav();

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    if (anchor.classList.contains('skip-link')) return;

    anchor.addEventListener('click', function (event) {
      var hash = anchor.hash;
      if (!hash || hash === '#') return;

      var target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      closeNav();

      if (prefersReducedMotion()) {
        target.scrollIntoView();
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }

      if (history.pushState) {
        history.pushState(null, '', hash);
      }

      if (anchor.classList.contains('site-nav__link')) {
        navLinks.forEach(function (l) { l.classList.remove('is-active'); });
        anchor.classList.add('is-active');
      }
    });
  });

  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.gallery-grid .gallery-item',
      touchNavigation: true,
      loop: true,
      openEffect: 'fade',
      closeEffect: 'fade'
    });
  }
})();
