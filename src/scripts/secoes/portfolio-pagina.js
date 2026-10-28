/* =======================
   PÁGINA /PORTFÓLIO/
   ======================= */

import { gsap, ScrollTrigger, rolarPara } from '../core/rolagem.js';
import { reduzirMovimento } from '../utils/movimento.js';
import { revelar, revelarEmSequencia } from '../utils/revelar.js';

/* SEM JS, TODOS OS GRUPOS APARECEM (O FILTRO SÓ ESCONDE); CADA GRUPO TEM ID = TIPO (#CASAMENTO...) */
export function iniciarPortfolioPagina(pagina) {
  const filtro = document.querySelector('.portfolio-pagina-filtro');
  if (filtro) iniciarFiltro(filtro, pagina);

  if (reduzirMovimento) return;

  revelar(pagina.querySelectorAll('.portfolio-pagina-grupo-topo'));
  pagina.querySelectorAll('.portfolio-evento').forEach(revelarEvento);
}

/* CADA EVENTO EM SEQUÊNCIA: META + H3, AS 3 FOTOS, O TEXTO */
const PARTES_DO_EVENTO = '.portfolio-evento-topo, .portfolio-item, .portfolio-evento-texto';

function revelarEvento(evento) {
  revelarEmSequencia(evento.querySelectorAll(PARTES_DO_EVENTO), evento);
}

/* =======================
   FILTRO POR TIPO
   ======================= */

function iniciarFiltro(filtro, pagina) {
  const botao = filtro.querySelector('.portfolio-filtro-botao');
  const lista = filtro.querySelector('.portfolio-filtro-lista');
  const itens = [...lista.querySelectorAll('[data-filtro]')];
  const grupos = [...pagina.querySelectorAll('.portfolio-pagina-grupo')];
  const atual = botao.querySelector('[data-filtro-atual]');
  const contagem = botao.querySelector('[data-filtro-contagem]');
  const anuncio = filtro.querySelector('[data-filtro-anuncio]');

  /* === ABRIR / FECHAR (DISCLOSURE) === */
  const aberto = () => botao.getAttribute('aria-expanded') === 'true';

  const abrir = () => {
    botao.setAttribute('aria-expanded', 'true');
    lista.hidden = false;
    itens.find((item) => item.getAttribute('aria-pressed') === 'true')?.focus();
  };

  const fechar = (devolverFoco) => {
    botao.setAttribute('aria-expanded', 'false');
    lista.hidden = true;
    if (devolverFoco) botao.focus();
  };

  botao.addEventListener('click', () => (aberto() ? fechar(false) : abrir()));

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && aberto()) fechar(true);
  });

  /* CLIQUE FORA OU FOCO SAINDO DA FAIXA (TAB DEPOIS DO ÚLTIMO ITEM) TAMBÉM FECHAM */
  document.addEventListener('click', (evento) => {
    if (aberto() && !filtro.contains(evento.target)) fechar(false);
  });

  filtro.addEventListener('focusout', (evento) => {
    if (aberto() && evento.relatedTarget && !filtro.contains(evento.relatedTarget)) fechar(false);
  });

  /* === ESCOLHER === */
  /* INICIAL: VEIO DE /PORTFÓLIO/#TIPO (SEM ANÚNCIO, SEM ANIMAR; SÓ CORRIGE A ROLAGEM DO NAVEGADOR) */
  const aplicar = (tipo, inicial = false) => {
    const item = itens.find((opcao) => opcao.dataset.filtro === tipo) ?? itens[0];
    const todos = item.dataset.filtro === 'todos';

    itens.forEach((opcao) => opcao.setAttribute('aria-pressed', String(opcao === item)));
    atual.textContent = item.querySelector('.portfolio-filtro-nome').textContent;
    contagem.textContent = item.querySelector('.portfolio-filtro-contagem').textContent;
    pagina.dataset.filtro = item.dataset.filtro;

    const visiveis = grupos.filter((grupo) => todos || grupo.id === item.dataset.filtro);
    grupos.forEach((grupo) => { grupo.hidden = !visiveis.includes(grupo); });

    history.replaceState(null, '', todos ? location.pathname + location.search : `#${item.dataset.filtro}`);
    if (!inicial) {
      anuncio.textContent = item.dataset.anuncio;
      if (!reduzirMovimento) reanimar(visiveis);
    }

    ScrollTrigger.refresh();
    rolarPara(pagina, { imediato: inicial });
  };

  itens.forEach((item) => item.addEventListener('click', () => {
    aplicar(item.dataset.filtro);
    fechar(true);
  }));

  const tipoDaUrl = decodeURIComponent(location.hash.slice(1));
  if (itens.some((item) => item.dataset.filtro === tipoDaUrl && tipoDaUrl !== 'todos')) aplicar(tipoDaUrl, true);
}

/* === REVELAR DE NOVO OS EVENTOS QUE APARECERAM === */
/* MATA A ENTRADA ANTIGA (PODE ESTAR PENDENTE, COM A PARTE INVISÍVEL) E RECOMEÇA DO ESTADO NATURAL */
function reanimar(grupos) {
  grupos.forEach((grupo) => grupo.querySelectorAll('.portfolio-evento').forEach((evento) => {
    const partes = evento.querySelectorAll(PARTES_DO_EVENTO);
    gsap.killTweensOf(partes);
    gsap.set(partes, { clearProps: 'transform,opacity,visibility' });
    revelarEvento(evento);
  }));
}
