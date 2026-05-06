// ─── NAV: scroll effect ───
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── FADE-IN: intersection observer ───
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

const variedadModal = document.getElementById('variedad-modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTipo = document.getElementById('modal-tipo');
const modalAltitud = document.getElementById('modal-altitud');
const modalRegion = document.getElementById('modal-region');
const modalProceso = document.getElementById('modal-proceso');
const modalSabores = document.getElementById('modal-sabores');

const saborTemplate = (texto) => {
  const span = document.createElement('span');
  span.className = 'modal-flavor-pill';
  span.textContent = texto;
  return span;
};

const openModal = (card) => {
  modalTitle.textContent = card.dataset.name;
  modalDescription.textContent = card.dataset.desc;
  modalTipo.textContent = card.dataset.tipo;
  modalAltitud.textContent = card.dataset.altitud;
  modalRegion.textContent = card.dataset.region;
  modalProceso.textContent = card.dataset.proceso;
  modalSabores.innerHTML = '';
  card.dataset.sabores.split(',').forEach(sabor => {
    modalSabores.appendChild(saborTemplate(sabor.trim()));
  });
  variedadModal.classList.add('active');
  variedadModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  variedadModal.classList.remove('active');
  variedadModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

document.querySelectorAll('.variedad-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

modalClose.addEventListener('click', closeModal);
variedadModal.addEventListener('click', (event) => {
  if (event.target === variedadModal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && variedadModal.classList.contains('active')) {
    closeModal();
  }
});
