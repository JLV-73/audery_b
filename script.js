const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealItems = document.querySelectorAll('.reveal');
const counterItems = document.querySelectorAll('[data-counter]');
const hero = document.querySelector('.hero');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal sections and cards as they enter the viewport.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Animate headline figures once to add a subtle premium rhythm.
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.counter);
      const duration = 1100;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = String(Math.round(target * eased));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = String(target);
        }
      };

      requestAnimationFrame(updateCounter);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.6 }
);

counterItems.forEach((counter) => counterObserver.observe(counter));

// A small parallax shift keeps the hero alive without becoming noisy.
if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const orbs = hero.querySelectorAll('.hero-orb');

  hero.addEventListener('pointermove', (event) => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const offsetX = (event.clientX - left - width / 2) / width;
    const offsetY = (event.clientY - top - height / 2) / height;

    orbs.forEach((orb, index) => {
      const factor = index === 0 ? 18 : -14;
      orb.style.transform = `translate(${offsetX * factor}px, ${offsetY * factor}px)`;
    });
  });

  hero.addEventListener('pointerleave', () => {
    orbs.forEach((orb) => {
      orb.style.transform = 'translate(0, 0)';
    });
  });
}
