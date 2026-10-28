/* =======================
   MANIFESTO
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar } from '../utils/revelar.js';

/* SÓ O BLOCO INTEIRO REVELA (SEM DIVISÃO POR LINHA) */
export function iniciarManifesto(secao) {
  if (reduzirMovimento) return;
  revelar(secao.querySelector('.manifesto-conteudo'));
}
