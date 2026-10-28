/* =======================
   PORTFÓLIO
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar, revelarEmSequencia } from '../utils/revelar.js';

export function iniciarPortfolio(secao) {
  /* TABINDEX SÓ NO TRILHO (ATÉ 599PX); NA GRADE NÃO HÁ O QUE ROLAR. O HTML JÁ VEM COM TABINDEX (SEM JS) */
  const trilho = secao.querySelector('.portfolio-grade');
  const grade = window.matchMedia('(min-width: 600px)');
  const sincronizar = () => (grade.matches ? trilho.removeAttribute('tabindex') : trilho.setAttribute('tabindex', '0'));
  grade.addEventListener('change', sincronizar);
  sincronizar();

  if (reduzirMovimento) return;

  revelar(secao.querySelectorAll('.secao-topo .rotulo, .secao-topo h2, .secao-topo .link-secao'));
  revelarEmSequencia(secao.querySelectorAll('.portfolio-item'), trilho);
}
