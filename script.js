const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const page = document.body;

function syncHeader() {
  header.classList.toggle('scrolled', window.scrollY > 24);
}

function closeMenu() {
  nav.classList.remove('open');
  page.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';

  if (open) {
    closeMenu();
    return;
  }

  nav.classList.add('open');
  page.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Fechar menu');
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

reveals.forEach((item) => {
  const delay = Number(item.dataset.delay || 0);
  item.style.setProperty('--delay', `${delay}ms`);
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -4% 0px' });

  reveals.forEach((item) => observer.observe(item));
}

const heroImage = document.querySelector('.hero-media img');

if (!reduceMotion && heroImage) {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking || window.scrollY > window.innerHeight * 1.2) return;

    ticking = true;
    requestAnimationFrame(() => {
      heroImage.style.transform = `scale(1.02) translateY(${window.scrollY * 0.055}px)`;
      ticking = false;
    });
  }, { passive: true });
}

const form = document.querySelector('#quick-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const problem = document.querySelector('#problem-type').value;
  const location = document.querySelector('#location').value.trim();

  const parts = [
    'Olá, vim pelo site da CHP e gostaria de solicitar uma avaliação.',
    name ? `Meu nome é ${name}.` : '',
    `O problema é relacionado a ${problem}.`,
    location ? `Está acontecendo em: ${location}.` : '',
    'Posso enviar fotos ou vídeos para vocês analisarem?'
  ].filter(Boolean);

  const message = encodeURIComponent(parts.join(' '));
  window.open(`https://wa.me/5543991887222?text=${message}`, '_blank', 'noopener');
});