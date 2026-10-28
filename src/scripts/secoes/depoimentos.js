/* =======================
   DEPOIMENTOS
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar } from '../utils/revelar.js';
import { prepararCampos, validarCampos } from '../utils/campos.js';
import { iniciarCarrossel } from '../utils/carrossel.js';

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
