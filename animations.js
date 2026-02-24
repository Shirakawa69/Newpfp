(function () {
  var clickable = document.querySelectorAll('.quick-nav a, .preview a, .life-photo, .life-main-photo, .pill, .tech-chip, .bubble, .modal-close, .project-more, .project-link, .copy-btn, .hero-btn, .quick-toggle, .back-to-top');
  for (var i = 0; i < clickable.length; i++) {
    clickable[i].addEventListener('click', function () {
      var el = this;
      el.classList.remove('is-clicked');
      void el.offsetWidth;
      el.classList.add('is-clicked');
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', 'readonly');
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        temp.setSelectionRange(0, temp.value.length);
        var ok = document.execCommand('copy');
        document.body.removeChild(temp);
        if (ok) {
          resolve();
        } else {
          reject(new Error('copy command failed'));
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  var copyButtons = document.querySelectorAll('.copy-btn');
  for (var k = 0; k < copyButtons.length; k++) {
    copyButtons[k].addEventListener('click', function () {
      var text = this.getAttribute('data-copy') || '';
      var status = this.nextElementSibling;
      if (!text) return;

      copyText(text).then(function () {
        if (status && status.className.indexOf('copy-status') !== -1) {
          status.textContent = 'Copied';
          setTimeout(function () {
            status.textContent = '';
          }, 1200);
        }
      }).catch(function () {
        try {
          window.prompt('Copy this value:', text);
          if (status && status.className.indexOf('copy-status') !== -1) {
            status.textContent = 'Use Ctrl+C';
            setTimeout(function () {
              status.textContent = '';
            }, 1500);
          }
        } catch (err) {
          if (status && status.className.indexOf('copy-status') !== -1) {
            status.textContent = 'Failed';
            setTimeout(function () {
              status.textContent = '';
            }, 1200);
          }
        }
      });
    });
  }

  var quickNav = document.querySelector('.quick-nav');
  var quickToggle = document.querySelector('.quick-toggle');
  var mobileForceBackTop = false;

  function isMobileViewport() {
    return window.matchMedia ? window.matchMedia('(max-width: 700px)').matches : (window.innerWidth <= 700);
  }
  if (quickNav && quickToggle) {
    quickToggle.addEventListener('click', function () {
      var open = quickNav.classList.toggle('is-open');
      quickToggle.classList.toggle('is-open', open);
      quickToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    var sectionLinks = quickNav.querySelectorAll('.quick-links a');
    for (var m = 0; m < sectionLinks.length; m++) {
      sectionLinks[m].addEventListener('click', function (event) {
        var href = this.getAttribute('href');
        var forceBackTopTargets = {
          '#current-goal': true,
          '#skills': true,
          '#education': true,
          '#contact': true,
          '#socials': true
        };

        if (href && forceBackTopTargets[href] && isMobileViewport()) {
          mobileForceBackTop = true;
          try {
            window.dispatchEvent(new Event('scroll'));
          } catch (errDispatch) {
          }
        }

        if (href && href.charAt(0) === '#') {
          var target = document.querySelector(href);
          if (target) {
            if (target.classList && target.classList.contains('modal')) {
              if (event && event.preventDefault) {
                event.preventDefault();
              }
              
              window.location.hash = href;
            } else {
              if (event && event.preventDefault) {
                event.preventDefault();
              }
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });

              // Add glow to section
              target.classList.remove('section-glow');
              void target.offsetWidth;
              target.classList.add('section-glow');
              setTimeout(function () {
                target.classList.remove('section-glow');
              }, 1800);
            }
          }
        }

        quickNav.classList.remove('is-open');
        quickToggle.setAttribute('aria-expanded', 'false');
        quickToggle.classList.remove('is-open');
      });
    }
  }

  var themeToggle = document.querySelector('.theme-toggle');

  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
    if (themeToggle) {
      themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
      themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
  }

  var savedTheme = null;
  try {
    savedTheme = window.localStorage.getItem('site-theme');
  } catch (errTheme) {
    savedTheme = null;
  }
  applyTheme(savedTheme === 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function (event) {
      var isDark = !document.body.classList.contains('theme-dark');
      applyTheme(isDark);
      try {
        window.localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
      } catch (errSetTheme) {
      }
    });
  }

  var personalHearts = document.querySelectorAll('#info-personal .personal-heart-particle');
  var personalHeartTimer = null;

  function randomBetween(min, max) {
    return min + (Math.random() * (max - min));
  }

  function randomizePersonalHearts() {
    for (var p = 0; p < personalHearts.length; p++) {
      var particle = personalHearts[p];
      var left = randomBetween(6, 94).toFixed(2) + '%';
      var drift = randomBetween(-90, 90).toFixed(0) + 'px';
      var size = randomBetween(8, 15).toFixed(1) + 'px';
      var duration = randomBetween(2.2, 4.6).toFixed(2) + 's';
      var delay = randomBetween(0, 1.8).toFixed(2) + 's';
      var scaleStart = randomBetween(0.42, 0.78).toFixed(2);
      var scaleEnd = randomBetween(0.84, 1.36).toFixed(2);

      particle.style.setProperty('--heart-left', left);
      particle.style.setProperty('--heart-drift-x', drift);
      particle.style.setProperty('--heart-size', size);
      particle.style.setProperty('--heart-duration', duration);
      particle.style.setProperty('--heart-delay', delay);
      particle.style.setProperty('--heart-scale-start', scaleStart);
      particle.style.setProperty('--heart-scale-end', scaleEnd);
    }
  }

  function syncPersonalHeartMotion() {
    if (!personalHearts.length) {
      return;
    }

    var isOpen = window.location.hash === '#info-personal';
    if (isOpen) {
      randomizePersonalHearts();
      if (!personalHeartTimer) {
        personalHeartTimer = window.setInterval(randomizePersonalHearts, 1500);
      }
    } else if (personalHeartTimer) {
      window.clearInterval(personalHeartTimer);
      personalHeartTimer = null;
    }
  }

  window.addEventListener('hashchange', syncPersonalHeartMotion);
  syncPersonalHeartMotion();

  var backTop = document.querySelector('.back-to-top');
  if (backTop) {
    function syncBackToTopVisibility() {
      var y = window.scrollY;
      if (typeof y !== 'number') {
        y = window.pageYOffset || document.documentElement.scrollTop || 0;
      }
      var isMobile = isMobileViewport();
      var threshold = isMobile ? 40 : 140;
      if (y > threshold || (mobileForceBackTop && isMobile)) {
        if (backTop.className.indexOf('is-visible') === -1) {
          backTop.className += ' is-visible';
        }
      } else {
        backTop.className = backTop.className.replace(' is-visible', '').replace('is-visible', '');
      }
    }

    window.addEventListener('scroll', syncBackToTopVisibility);
    window.addEventListener('touchmove', syncBackToTopVisibility, { passive: true });
    window.addEventListener('hashchange', syncBackToTopVisibility);
    window.addEventListener('resize', syncBackToTopVisibility);
    syncBackToTopVisibility();

    backTop.addEventListener('click', function () {
      mobileForceBackTop = false;
      backTop.className = backTop.className.replace(' is-visible', '').replace('is-visible', '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile accordion cards for personal section
  var personalCards = document.querySelectorAll('.personal-card');
  for (var ac = 0; ac < personalCards.length; ac++) {
    personalCards[ac].addEventListener('click', function(e) {
      // Don't trigger if clicking on a link inside the card
      if (e.target.closest('a')) return;
      
      this.classList.toggle('is-open');
    });
  }

})();
