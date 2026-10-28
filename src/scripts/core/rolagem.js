/* =======================
   ROLAGEM
   ======================= */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { reduzirMovimento } from '../utils/movimento.js';

/* === PLUGINS (ÚNICO REGISTRO DO PROJETO) === */
gsap.registerPlugin(ScrollTrigger);

/* === LENIS + SCROLLTRIGGER === */
/* NO MÓDULO: AS SEÇÕES ROLAM PELO ROLARPARA (SEM RECEBER O LENIS) */
let lenis = null;

export function iniciarRolagem() {
  /* RECALCULA OS GATILHOS DEPOIS DO SWAP DAS FONTES */
  document.fonts.ready.then(() => ScrollTrigger.refresh());

  /* [DATA-TOPO]: SOBE SEM RECARREGAR; SEM LENIS (MOVIMENTO REDUZIDO), DIRETO */
  document.addEventListener('click', (evento) => {
    if (!evento.target.closest('a[data-topo]')) return;
    evento.preventDefault();

    /* O FOCO VOLTA AO INÍCIO DA ORDEM DE TAB (SKIP LINK), SEM ROLAR */
    const topo = document.querySelector('.pular-conteudo') ?? document.getElementById('conteudo');
    const focarTopo = () => topo && focar(topo);

    if (lenis) lenis.scrollTo(0, { duration: 1.4, onComplete: focarTopo });
    else {
      window.scrollTo(0, 0);
      focarTopo();
    }
  });

  if (reduzirMovimento) return null;

  lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ÂNCORAS DA PÁGINA ATUAL (#ID OU /#ID): SEM OFFSET, O LENIS JÁ DESCONTA O SCROLL-PADDING-TOP */
  document.addEventListener('click', (evento) => {
    const link = evento.target.closest('a[href*="#"]');
    if (!link || !link.hash || link.origin !== location.origin || link.pathname !== location.pathname) return;

    /* GETELEMENTBYID: ID COM NÚMERO OU ACENTO QUEBRARIA O QUERYSELECTOR */
    const destino = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!destino) return;

    evento.preventDefault();
    history.pushState(null, '', link.hash);
    lenis.scrollTo(destino, { duration: 1.4, onComplete: () => focar(destino) });
  });

  return lenis;
}

/* === ROLAR ATÉ UM ELEMENTO (AMBOS DESCONTAM O SCROLL-PADDING-TOP) === */
/* IMEDIATO VAI PELO NATIVO: LOGO DEPOIS DE UM SALTO DO NAVEGADOR (#ÂNCORA), O LENIS AINDA TEM A POSIÇÃO ANTIGA E NÃO ROLA */
export function rolarPara(alvo, { imediato = false } = {}) {
  if (lenis && !imediato) lenis.scrollTo(alvo, { duration: 1.4 });
  else alvo.scrollIntoView({ block: 'start' });
}

/* === FOCO NO DESTINO (LEITOR DE TELA E TAB CONTINUAM DALI) === */
function focar(elemento) {
  if (elemento.tabIndex < 0) elemento.setAttribute('tabindex', '-1');
  elemento.focus({ preventScroll: true });
}

export { gsap, ScrollTrigger };
