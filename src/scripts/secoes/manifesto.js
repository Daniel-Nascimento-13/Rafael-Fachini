/* =======================
   MANIFESTO
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelarEmSequencia } from '../utils/revelar.js';

/* RÓTULO, TEXTO E APOIO EM SEQUÊNCIA (SEM DIVISÃO POR LINHA) */
export function iniciarManifesto(secao) {
  if (reduzirMovimento) return;
  const conteudo = secao.querySelector('.manifesto-conteudo');
  revelarEmSequencia(conteudo.querySelectorAll('.rotulo, .manifesto-texto, .manifesto-apoio'), conteudo);
}
