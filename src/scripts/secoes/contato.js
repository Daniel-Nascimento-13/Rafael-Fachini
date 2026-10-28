/* =======================
   CONTATO
   ======================= */

import { reduzirMovimento } from '../utils/movimento.js';
import { revelar } from '../utils/revelar.js';

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

  campos.forEach((campo) => {
    const texto = textoDaAjuda(campo);
    if (texto) texto.dataset.normal = texto.textContent;
  });

  campos.forEach((campo) => {
    /* SÓ VALIDA NO BLUR SE ALGO FOI PREENCHIDO */
    campo.addEventListener('blur', () => {
      if (campo.value || campo.validity.badInput) validar(campo);
    });

    /* SAI DO ERRO ASSIM QUE FICA VÁLIDO (SELECT DISPARA CHANGE) */
    ['input', 'change'].forEach((evento) => campo.addEventListener(evento, () => {
      if (campo.getAttribute('aria-invalid') === 'true' && valido(campo)) marcar(campo, true);
    }));
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const invalidos = campos.filter((campo) => !validar(campo));
    if (invalidos.length) {
      invalidos[0].focus();
      return;
    }

    const mensagem = montarMensagem(formulario, campos);
    window.open(`https://wa.me/${formulario.dataset.whatsapp}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
  });
}

/* === REGRAS === */
/* CONVIDADOS: INTEIRO ≥ MIN; DATA ≥ HOJE; DEMAIS: PREENCHIDOS */
function valido(campo) {
  const valor = campo.value.trim();
  if (campo.type === 'number') return !campo.validity.badInput && /^\d+$/.test(valor) && Number(valor) >= Number(campo.min);
  if (campo.type === 'date') return valor !== '' && valor >= campo.min;
  return valor !== '';
}

function validar(campo) {
  const ok = valido(campo);
  marcar(campo, ok);
  return ok;
}

/* === ESTADO DE ERRO === */
/* ARIA-INVALID COM SETATTRIBUTE (TOGGLEATTRIBUTE GRAVA "" = VÁLIDO) + DICA TROCADA PELO DATA-ERRO */
function marcar(campo, ok) {
  if (ok) campo.removeAttribute('aria-invalid');
  else campo.setAttribute('aria-invalid', 'true');

  const ajuda = document.getElementById(campo.getAttribute('aria-describedby'));
  const texto = textoDaAjuda(campo);
  if (!ajuda || !texto) return;
  texto.textContent = ok ? texto.dataset.normal : ajuda.dataset.erro;
  ajuda.classList.toggle('contato-ajuda-erro', !ok);
}

/* O TEXTO FICA NUM SPAN: O <P> DA DICA TAMBÉM GUARDA O ÍCONE DE ALERTA */
function textoDaAjuda(campo) {
  const ajuda = document.getElementById(campo.getAttribute('aria-describedby'));
  return ajuda?.querySelector('.contato-ajuda-texto') ?? null;
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
