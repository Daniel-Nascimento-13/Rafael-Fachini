/* =======================
   HERO
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';

/* A ENTRADA DO TEXTO É CSS (HERO.CSS): O MÓDULO CARREGA COM DEFER E O TEXTO PISCARIA ANTES DO GSAP */
export function iniciarHero(hero) {
  /* ECONOMIA DE DADOS CONTA COMO MOVIMENTO REDUZIDO: VÍDEO PARADO NO POSTER */
  const parado = reduzirMovimento || navigator.connection?.saveData === true;

  const video = hero.querySelector('.hero-video');
  if (video && !parado) tocarSoNaTela(hero, video);
}

/* === VÍDEO SÓ NA TELA === */
function tocarSoNaTela(hero, video) {
  new IntersectionObserver(([entrada]) => {
    if (entrada.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }).observe(hero);
}
