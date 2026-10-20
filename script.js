const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const body = document.body;

function syncHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

function closeMenu() {
  nav.classList.remove('open');
  body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
    return;
  }

  nav.classList.add('open');
  body.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Fechar menu');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

revealItems.forEach((item) => {
  const delay = Number(item.dataset.delay || 0);
  item.style.setProperty('--delay', `${delay}ms`);
});

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -30px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const counters = document.querySelectorAll('[data-counter]');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach((element) => {
    const target = Number(element.dataset.counter);
    if (reduceMotion) {
      element.textContent = target;
      return;
    }

    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

const trustRow = document.querySelector('.trust-row');
if ('IntersectionObserver' in window && trustRow) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    animateCounters();
    observer.disconnect();
  }, { threshold: 0.4 });
  counterObserver.observe(trustRow);
} else {
  animateCounters();
}

const billRange = document.querySelector('#bill-range');
const billOutput = document.querySelector('#bill-output');
const monthlySaving = document.querySelector('#monthly-saving');
const annualSaving = document.querySelector('#annual-saving');
const longSaving = document.querySelector('#long-saving');
const simWhatsapp = document.querySelector('#sim-whatsapp');
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function updateSimulation() {
  const bill = Number(billRange.value);
  const estimatedRate = 0.85;
  const monthly = bill * estimatedRate;
  const annual = monthly * 12;
  const longTerm = annual * 25;

  billOutput.textContent = currency.format(bill);
  monthlySaving.textContent = currency.format(monthly);
  annualSaving.textContent = currency.format(annual);
  longSaving.textContent = currency.format(longTerm);

  const percent = ((bill - Number(billRange.min)) / (Number(billRange.max) - Number(billRange.min))) * 100;
  billRange.style.background = `linear-gradient(90deg, #c9ff63 ${percent}%, rgba(255,255,255,.16) ${percent}%)`;

  const message = `Olá, vim pelo site da Dalbene. Minha conta média é de aproximadamente ${currency.format(bill)} por mês e quero uma análise real para saber se energia solar faz sentido para mim.`;
  simWhatsapp.href = `https://wa.me/5519981212923?text=${encodeURIComponent(message)}`;
}

billRange.addEventListener('input', updateSimulation);
updateSimulation();

const leadForm = document.querySelector('#lead-form');
leadForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#lead-name').value.trim();
  const city = document.querySelector('#lead-city').value.trim();
  const bill = document.querySelector('#lead-bill').value.trim();
  const message = `Olá! Meu nome é ${name}. Moro em ${city} e minha conta média de energia é ${bill}. Vim pelo site da Dalbene e gostaria de receber uma análise inicial para energia solar.`;
  const url = `https://wa.me/5519981212923?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank', 'noopener,noreferrer');
});

const tiltTarget = document.querySelector('[data-tilt]');
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (tiltTarget && finePointer && !reduceMotion) {
  tiltTarget.addEventListener('pointermove', (event) => {
    const rect = tiltTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltTarget.style.transform = `perspective(1100px) rotateY(${x * 3.2}deg) rotateX(${y * -2.4}deg) translateY(-2px)`;
  });

  tiltTarget.addEventListener('pointerleave', () => {
    tiltTarget.style.transform = 'perspective(1100px) rotateY(-2deg) rotateX(0deg)';
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
