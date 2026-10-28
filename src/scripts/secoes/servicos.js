/* =======================
   SERVIÇOS
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar, revelarEmSequencia } from '../utils/revelar.js';

export function iniciarServicos(secao) {
  if (reduzirMovimento) return;

  revelar(secao.querySelectorAll('.secao-topo .rotulo, .secao-topo h2, .secao-topo-texto'));
  revelarEmSequencia(secao.querySelectorAll('.servicos-item'), secao.querySelector('.servicos-lista'));
}
