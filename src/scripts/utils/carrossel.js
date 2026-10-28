/* =======================
   CARROSSEL (DEPOIMENTOS, EQUIPE)
   ======================= */

import { reduzirMovimento } from './movimento.js';

/* SCROLL-SNAP NATIVO; O JS SÓ LIGA AS SETAS E O INDICADOR */
export function iniciarCarrossel(carrossel) {
  const trilho = carrossel.querySelector('.carrossel-trilho');
  const cards = trilho.querySelectorAll('.carrossel-item');
  const [anterior, proxima] = carrossel.querySelectorAll('.carrossel-seta');
  const atual = carrossel.querySelector('[data-atual]');

  carrossel.querySelector('[data-total]').textContent = cards.length;

  const passo = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : trilho.clientWidth);

  const atualizar = () => {
    const noFim = trilho.scrollLeft >= trilho.scrollWidth - trilho.clientWidth - 1;
    anterior.disabled = trilho.scrollLeft <= 1;
    proxima.disabled = noFim;
    atual.textContent = noFim ? cards.length : Math.round(trilho.scrollLeft / passo()) + 1;
  };

  [anterior, proxima].forEach((seta) => seta.addEventListener('click', () => {
    trilho.scrollBy({ left: passo() * Number(seta.dataset.direcao), behavior: reduzirMovimento ? 'auto' : 'smooth' });
  }));

  trilho.addEventListener('scroll', atualizar, { passive: true });
  window.addEventListener('resize', atualizar);
  atualizar();
}
