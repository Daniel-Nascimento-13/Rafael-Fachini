/* =======================
   CONTATO
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar } from '../utils/revelar.js';
import { prepararCampos, validarCampos } from '../utils/campos.js';

/* DETALHES DO EVENTO → MENSAGEM PRONTA NO WHATSAPP */
export function iniciarContato(secao) {
  const formulario = secao.querySelector('.contato-form');
  if (formulario) iniciarFormulario(formulario);

  if (reduzirMovimento) return;
  revelar(secao.querySelectorAll('.contato-texto, .contato-form'));
}

/* === FORMULÁRIO === */
function iniciarFormulario(formulario) {
  const campos = [...formulario.querySelectorAll('[data-mensagem]')];

  const data = formulario.querySelector('input[type="date"]');
  if (data) data.min = hojeIso();

  prepararCampos(campos);

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!validarCampos(campos)) return;

    const mensagem = montarMensagem(formulario, campos);
    window.open(`https://wa.me/${formulario.dataset.whatsapp}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
  });
}

/* FUSO LOCAL: O TOISOSTRING USA UTC */
function hojeIso() {
  const hoje = new Date();
  return [hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
}

/* === MENSAGEM === */
/* CADA CAMPO TROCA O SEU {MARCADOR} NA FRASE DO DATA-MENSAGEM */
function montarMensagem(formulario, campos) {
  return campos.reduce((mensagem, campo) => mensagem.replace(campo.dataset.mensagem, formatar(campo)), formulario.dataset.mensagem);
}

/* DATA → "SÁBADO, 05/12/2026" EM MINÚSCULAS (FUSO LOCAL); SELECT → DATA-FRASE DA OPÇÃO */
const DIA_DA_SEMANA = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });

function formatar(campo) {
  const valor = campo.value.trim();
  if (campo.tagName === 'SELECT') return campo.selectedOptions[0].dataset.frase ?? valor;
  if (campo.type !== 'date') return valor;

  const [ano, mes, dia] = valor.split('-').map(Number);
  const semana = DIA_DA_SEMANA.format(new Date(ano, mes - 1, dia)).toLocaleLowerCase('pt-BR');
  return `${semana}, ${valor.split('-').reverse().join('/')}`;
}
