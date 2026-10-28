/* =======================
   PORTFÓLIO
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar, revelarEmSequencia } from '../utils/revelar.js';

export function iniciarPortfolio(secao) {
  if (reduzirMovimento) return;

  revelar(secao.querySelectorAll('.secao-topo .rotulo, .secao-topo h2'));
  revelarEmSequencia(secao.querySelectorAll('.portfolio-item, .portfolio-mais'), secao.querySelector('.portfolio-grade'));
}
