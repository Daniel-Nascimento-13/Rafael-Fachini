/* =======================
   DEPOIMENTOS
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar } from '../utils/revelar.js';
import { prepararCampos, validarCampos } from '../utils/campos.js';

/* A MESMA ENTRADA SERVE AO CARROSSEL E AO FORMULÁRIO (CADA SEÇÃO CHAMA COM O SEU ELEMENTO) */
export function iniciarDepoimentos(secao) {
  const carrossel = secao.querySelector('.depoimentos-carrossel');
  if (carrossel) iniciarCarrossel(carrossel);

  const formulario = secao.querySelector('.depoimentos-form');
  if (formulario) iniciarFormulario(formulario);

  if (reduzirMovimento) return;
  revelar(secao.querySelectorAll('.depoimentos-carrossel, .depoimentos-envio-texto, .depoimentos-envio-caixa'));
}

/* =======================
   CARROSSEL
   ======================= */

/* SCROLL-SNAP NATIVO; O JS SÓ LIGA AS SETAS E O INDICADOR */
function iniciarCarrossel(carrossel) {
  const trilho = carrossel.querySelector('.depoimentos-trilho');
  const cards = trilho.querySelectorAll('.depoimentos-item');
  const [anterior, proxima] = carrossel.querySelectorAll('.depoimentos-seta');
  const atual = carrossel.querySelector('[data-atual]');

  carrossel.querySelector('[data-total]').textContent = cards.length;

  const passo = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : trilho.clientWidth);

  const atualizar = () => {
    const noFim = trilho.scrollLeft >= trilho.scrollWidth - trilho.clientWidth - 1;
    anterior.disabled = trilho.scrollLeft <= 1;
    proxima.disabled = noFim;
    atual.textContent = noFim ? cards.length : Math.round(trilho.scrollLeft / passo()) + 1;
  };

  [anterior, proxima].forEach((seta) => seta.addEventListener('click', () => {
    trilho.scrollBy({ left: passo() * Number(seta.dataset.direcao), behavior: reduzirMovimento ? 'auto' : 'smooth' });
  }));

  trilho.addEventListener('scroll', atualizar, { passive: true });
  window.addEventListener('resize', atualizar);
  atualizar();
}

/* =======================
   FORMULÁRIO DE ENVIO
   ======================= */

function iniciarFormulario(formulario) {
  const campos = [...formulario.querySelectorAll('[required]')];
  const texto = formulario.querySelector('textarea');
  const contagem = formulario.querySelector('[data-contagem]');
  const botao = formulario.querySelector('[type="submit"]');
  const erro = formulario.querySelector('.depoimentos-erro');
  const recebido = formulario.parentElement.querySelector('.depoimentos-recebido');
  const mensagemErro = erro.textContent;

  prepararCampos(campos);

  /* CONTADOR EM CODE POINTS (O MESMO TAMANHO QUE O SERVIDOR CONFERE) */
  const contar = () => { contagem.textContent = [...texto.value].length; };
  texto.addEventListener('input', contar);
  contar();

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    erro.hidden = true;

    if (!validarCampos(campos)) return;

    botao.disabled = true;
    botao.textContent = botao.dataset.enviando;

    const status = await enviar(formulario);

    if (status >= 200 && status < 300) {
      formulario.hidden = true;
      recebido.hidden = false;
      recebido.focus();
      return;
    }

    erro.textContent = status === 429 ? erro.dataset.limite : mensagemErro;
    erro.hidden = false;
    botao.disabled = false;
    botao.textContent = botao.dataset.tentar;
  });
}

/* DEVOLVE O STATUS HTTP (0 = SEM REDE). DATA-DEMO: NÃO CHAMA A API */
async function enviar(formulario) {
  if (formulario.hasAttribute('data-demo')) return 200;

  const dados = Object.fromEntries(new FormData(formulario));
  dados.autorizado = formulario.elements.autorizado.checked;

  try {
    const resposta = await fetch(formulario.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    return resposta.status;
  } catch {
    return 0;
  }
}
