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

  var lifeMain = document.querySelector('.life-main-photo');
  var lifeMainImg = lifeMain ? lifeMain.querySelector('img') : null;
  if (lifeMain && lifeMainImg) {
    var kidModals = document.querySelectorAll('.modal[id^="modal-kid"]');
    var slides = [];
    for (var n = 0; n < kidModals.length; n++) {
      var modalImg = kidModals[n].querySelector('img');
      if (modalImg && modalImg.getAttribute('src')) {
        slides.push({
          src: modalImg.getAttribute('src'),
          alt: modalImg.getAttribute('alt') || 'Childhood photo',
          href: '#' + kidModals[n].getAttribute('id')
        });
      }
    }

    if (slides.length > 1) {
      var slideIndex = 0;
      var slideTimer = null;
      lifeMainImg.style.transition = 'opacity 260ms ease';

      function setSlide(index) {
        var safeIndex = index % slides.length;
        lifeMainImg.style.opacity = '0.2';
        window.setTimeout(function () {
          lifeMainImg.setAttribute('src', slides[safeIndex].src);
          lifeMainImg.setAttribute('alt', slides[safeIndex].alt);
          lifeMain.setAttribute('href', slides[safeIndex].href);
          lifeMainImg.style.opacity = '1';
        }, 120);
      }

      function startCarousel() {
        if (slideTimer) return;
        slideTimer = window.setInterval(function () {
          slideIndex = (slideIndex + 1) % slides.length;
          setSlide(slideIndex);
        }, 3200);
      }

      function stopCarousel() {
        if (slideTimer) {
          window.clearInterval(slideTimer);
          slideTimer = null;
        }
      }

      startCarousel();
      lifeMain.addEventListener('mouseenter', stopCarousel);
      lifeMain.addEventListener('mouseleave', startCarousel);
    }
  }

  var funFactText = document.querySelector('.fun-fact-text');
  if (funFactText) {
    var rawFacts = funFactText.getAttribute('data-facts') || '';
    var facts = rawFacts.split('||');
    var cleanFacts = [];
    for (var q = 0; q < facts.length; q++) {
      var item = facts[q].replace(/^\s+|\s+$/g, '');
      if (item) {
        cleanFacts.push(item);
      }
    }

    if (cleanFacts.length > 1) {
      var factIndex = 0;
      window.setInterval(function () {
        factIndex = (factIndex + 1) % cleanFacts.length;
        funFactText.style.opacity = '0.2';
        window.setTimeout(function () {
          funFactText.textContent = cleanFacts[factIndex];
          funFactText.style.opacity = '1';
        }, 130);
      }, 3300);
    }
  }
})();
