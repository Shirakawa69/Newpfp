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

  var backTop = document.querySelector('.back-to-top');
  if (backTop) {
    function syncBackToTopVisibility() {
      var y = window.scrollY;
      if (typeof y !== 'number') {
        y = window.pageYOffset || document.documentElement.scrollTop || 0;
      }
      if (y > 140) {
        if (backTop.className.indexOf('is-visible') === -1) {
          backTop.className += ' is-visible';
        }
      } else {
        backTop.className = backTop.className.replace(' is-visible', '').replace('is-visible', '');
      }
    }

    window.addEventListener('scroll', syncBackToTopVisibility);
    window.addEventListener('hashchange', syncBackToTopVisibility);
    window.addEventListener('resize', syncBackToTopVisibility);
    syncBackToTopVisibility();

    backTop.addEventListener('click', function () {
      backTop.className = backTop.className.replace(' is-visible', '').replace('is-visible', '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();


