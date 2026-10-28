/* =======================
   PÁGINA /PORTFÓLIO/
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar, revelarEmSequencia } from '../utils/revelar.js';

/* SEM FILTRO EM JS: CADA TIPO É UMA SEÇÃO COM ÂNCORA (SEO E SIMPLICIDADE) */
export function iniciarPortfolioPagina(pagina) {
  if (reduzirMovimento) return;

  revelar(pagina.querySelectorAll('.portfolio-pagina-titulo'));
  pagina.querySelectorAll('.portfolio-pagina-grade').forEach((grade) => {
    revelarEmSequencia(grade.querySelectorAll('.portfolio-pagina-item'), grade);
  });
}
