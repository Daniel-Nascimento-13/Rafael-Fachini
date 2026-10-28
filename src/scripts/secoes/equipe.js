/* =======================
   EQUIPE
   ======================= */

import { ScrollTrigger } from '../core/rolagem.js';
import { reduzirMovimento } from '../utils/movimento.js';
import { revelar, revelarEmSequencia } from '../utils/revelar.js';
import { iniciarCarrossel } from '../utils/carrossel.js';

export function iniciarEquipe(secao) {
  const carrossel = secao.querySelector('.equipe-carrossel');
  if (carrossel) iniciarCarrossel(carrossel);

  if (reduzirMovimento) return;

  revelar(secao.querySelectorAll('.secao-topo .rotulo, .secao-topo h2, .secao-topo-texto'));
  if (!carrossel) return;
  revelarEmSequencia(carrossel.querySelectorAll('.carrossel-item, .carrossel-controles'), carrossel);
  empurrar(carrossel);
}

/* === EMPURRÃOZINHO (O CSS SÓ ANIMA ATÉ 599) === */
/* UMA VEZ, QUANDO O CARROSSEL ENTRA NA TELA; A 1ª INTERAÇÃO CANCELA (E IMPEDE QUE COMECE DEPOIS) */
function empurrar(carrossel) {
  let interagiu = false;
  const parar = () => {
    interagiu = true;
    carrossel.classList.remove('equipe-empurrar');
  };

  ['pointerdown', 'keydown', 'wheel'].forEach((evento) => carrossel.addEventListener(evento, parar, { once: true, passive: true }));
  carrossel.querySelector('.carrossel-trilho').addEventListener('scroll', parar, { once: true, passive: true });

  ScrollTrigger.create({
    trigger: carrossel,
    start: 'top 70%',
    once: true,
    onEnter: () => { if (!interagiu) carrossel.classList.add('equipe-empurrar'); },
  });
}
