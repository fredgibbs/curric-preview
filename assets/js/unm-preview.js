document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.unm-nav-toggle');
  var menu = document.getElementById('unm-site-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open', !expanded);
    });
  }

  var tocList = document.getElementById('unm-document-toc-list');
  var documentRoot = document.querySelector('.unm-document');

  if (tocList && documentRoot) {
    var headings = Array.prototype.slice.call(documentRoot.querySelectorAll('h2'));

    headings.forEach(function (heading, index) {
      if (!heading.id) {
        heading.id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'section-' + index;
      }

      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      link.addEventListener('click', function (event) {
        event.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', '#' + heading.id);
      });
      item.appendChild(link);
      tocList.appendChild(item);
    });

    var tocLinks = Array.prototype.slice.call(tocList.querySelectorAll('a'));

    function updateDocumentToc() {
      var current = headings[0];
      var offset = window.scrollY + 120;

      headings.forEach(function (heading) {
        if (heading.offsetTop <= offset) {
          current = heading;
        }
      });

      tocLinks.forEach(function (link) {
        link.classList.toggle('is-active', current && link.getAttribute('href') === '#' + current.id);
      });
    }

    window.addEventListener('scroll', function () {
      window.requestAnimationFrame(updateDocumentToc);
    });
    updateDocumentToc();
  }

  var carousel = document.querySelector('[data-unm-carousel]');
  if (!carousel) return;

  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.unm-spotlight__slide'));
  var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide]'));
  var controls = carousel.querySelectorAll('[data-direction]');
  var current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
      dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  controls.forEach(function (control) {
    control.addEventListener('click', function () {
      showSlide(current + Number(control.dataset.direction));
    });
  });
});
