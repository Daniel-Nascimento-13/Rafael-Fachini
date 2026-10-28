/* =======================
   ENTRADA
   ======================= */

/* === FONTES (SELF-HOSTED, SÓ LATIN E OS PESOS USADOS) === */
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/jetbrains-mono/latin-400.css';

import './estilos/main.css';
import { iniciarRolagem } from './scripts/core/rolagem.js';
import { carregarAoAproximar } from './scripts/core/carregador.js';
import { detectarTeclado } from './scripts/utils/teclado.js';
import { iniciarCabecalho } from './scripts/secoes/cabecalho.js';
import { iniciarHero } from './scripts/secoes/hero.js';

/* === ROLAGEM SUAVE === */
const lenis = iniciarRolagem();

/* === TECLADO × PONTEIRO === */
detectarTeclado();

/* === ACIMA DA DOBRA === */
const cabecalho = document.querySelector('.cabecalho');
if (cabecalho) iniciarCabecalho(cabecalho, lenis);

const hero = document.querySelector('.hero');
if (hero) iniciarHero(hero);

/* === ABAIXO DA DOBRA (CARREGADAS SOB DEMANDA) === */
/* CADA SEÇÃO ENTRA AQUI QUANDO O SEU MÓDULO EXISTIR, NA ORDEM DA HOME */
const secoesSobDemanda = [
  { seletor: '.manifesto', carregar: () => import('./scripts/secoes/manifesto.js').then((m) => m.iniciarManifesto) },
  /* ETAPA 5: { seletor: '.servicos', carregar: () => import('./scripts/secoes/servicos.js').then((m) => m.iniciarServicos) }, */
  /* ETAPA 5: { seletor: '.portfolio', carregar: () => import('./scripts/secoes/portfolio.js').then((m) => m.iniciarPortfolio) }, */
  /* ETAPA 5: { seletor: '.processo', carregar: () => import('./scripts/secoes/processo.js').then((m) => m.iniciarProcesso) }, */
  /* ETAPA 9: { seletor: '.depoimentos', carregar: () => import('./scripts/secoes/depoimentos.js').then((m) => m.iniciarDepoimentos) }, */
  /* ETAPA 6: { seletor: '.contato', carregar: () => import('./scripts/secoes/contato.js').then((m) => m.iniciarContato) }, */
  /* ETAPA 6: { seletor: '.rodape', carregar: () => import('./scripts/secoes/rodape.js').then((m) => m.iniciarRodape) }, */
];

secoesSobDemanda.forEach(({ seletor, carregar }) => carregarAoAproximar(seletor, carregar));
