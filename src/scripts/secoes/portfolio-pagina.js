/* =======================
   PÁGINA /PORTFÓLIO/
   ======================= */

import { gsap, ScrollTrigger, rolarPara } from '../core/rolagem.js';
import { reduzirMovimento } from '../utils/movimento.js';
import { revelarEmSequencia } from '../utils/revelar.js';

/* SEM JS, TODOS OS GRUPOS APARECEM (O FILTRO SÓ ESCONDE); CADA GRUPO TEM ID = TIPO (#CASAMENTO...) */
export function iniciarPortfolioPagina(pagina) {
  const filtro = document.querySelector('.portfolio-pagina-filtro');
  if (filtro) iniciarFiltro(filtro, pagina);

  if (reduzirMovimento) return;

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
  /* SEM "TODOS": O 1º TIPO (CASAMENTO) É O PADRÃO E FICA SEM HASH; OS OUTROS VÃO PARA #TIPO */
  /* INICIAL: SEM ANÚNCIO E SEM ANIMAR; SÓ ROLA SE O NAVEGADOR JÁ TINHA SALTADO PARA UM #TIPO VÁLIDO */
  const aplicar = (tipo, { inicial = false, rolar = true } = {}) => {
    const item = itens.find((opcao) => opcao.dataset.filtro === tipo) ?? itens[0];
    const padrao = item === itens[0];

    itens.forEach((opcao) => opcao.setAttribute('aria-pressed', String(opcao === item)));
    atual.textContent = item.querySelector('.portfolio-filtro-nome').textContent;
    contagem.textContent = item.querySelector('.portfolio-filtro-contagem').textContent;

    const visiveis = grupos.filter((grupo) => grupo.id === item.dataset.filtro);
    grupos.forEach((grupo) => { grupo.hidden = !visiveis.includes(grupo); });
    alternarFundos(visiveis);

    history.replaceState(null, '', padrao ? location.pathname + location.search : `#${item.dataset.filtro}`);
    if (!inicial) {
      anuncio.textContent = item.dataset.anuncio;
      if (!reduzirMovimento) reanimar(visiveis);
    }

    ScrollTrigger.refresh();
    if (rolar) rolarPara(pagina, { imediato: inicial });
  };

  itens.forEach((item) => item.addEventListener('click', () => {
    aplicar(item.dataset.filtro);
    fechar(true);
  }));

  const tipoDaUrl = decodeURIComponent(location.hash.slice(1));
  const hashValido = itens.some((item) => item.dataset.filtro === tipoDaUrl);
  aplicar(tipoDaUrl, { inicial: true, rolar: hashValido });
}

/* === FUNDOS PELA ORDEM VISÍVEL (O 1º EVENTO É BASE: A FAIXA DO FILTRO JÁ SEPARA DA ABERTURA) === */
/* A CHAMADA FINAL FICA COM O TOM CONTRÁRIO AO DO ÚLTIMO EVENTO (COM CONTAGEM PAR, CONTINUA BASE) */
function alternarFundos(grupos) {
  const eventos = grupos.flatMap((grupo) => [...grupo.querySelectorAll('.portfolio-evento')]);
  eventos.forEach((evento, indice) => {
    evento.classList.toggle('fundo-base', indice % 2 === 0);
    evento.classList.toggle('fundo-superficie', indice % 2 === 1);
  });

  const chamada = document.querySelector('.portfolio-pagina-cta');
  if (!chamada || !eventos.length) return;
  const ultimoBase = eventos.length % 2 === 1;
  chamada.classList.toggle('fundo-superficie', ultimoBase);
  chamada.classList.toggle('fundo-base', !ultimoBase);
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
