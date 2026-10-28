/* =======================
   PROCESSO
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar, revelarEmSequencia } from '../utils/revelar.js';

export function iniciarProcesso(secao) {
  if (reduzirMovimento) return;

  revelar(secao.querySelectorAll('.secao-topo .rotulo, .secao-topo h2'));
  revelarEmSequencia(secao.querySelectorAll('.processo-passo'), secao.querySelector('.processo-lista'));
}
