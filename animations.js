(function () {
  var clickable = document.querySelectorAll('.quick-nav a, .preview a, .pill, .tech-chip, .bubble, .modal-close, .project-more, .project-link, .copy-btn, .hero-btn, .quick-toggle, .back-to-top');
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
            if (event && event.preventDefault) {
              event.preventDefault();
            }
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            target.classList.remove('nav-focus');
            void target.offsetWidth;
            target.classList.add('nav-focus');
            setTimeout(function () {
              target.classList.remove('nav-focus');
            }, 1000);
          }
        }

        quickNav.classList.remove('is-open');
        quickToggle.setAttribute('aria-expanded', 'false');
        quickToggle.classList.remove('is-open');
      });
    }
  }

  var backTop = document.querySelector('.back-to-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 260) {
        if (backTop.className.indexOf('is-visible') === -1) {
          backTop.className += ' is-visible';
        }
      } else {
        backTop.className = backTop.className.replace(' is-visible', '').replace('is-visible', '');
      }
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
