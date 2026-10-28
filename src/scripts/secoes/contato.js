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
  /* AS OPÇÕES DO TIPO TAMBÉM TÊM DATA-MENSAGEM (A FRASE DE CADA TIPO); CAMPO É SÓ INPUT/SELECT */
  const campos = [...formulario.querySelectorAll('[data-mensagem]:not(option)')];
  const tipo = formulario.querySelector('select[name="tipo"]');
  const nome = formulario.querySelector('input[name="nome"]');

  const data = formulario.querySelector('input[type="date"]');
  if (data) data.min = hojeIso();

  prepararCampos(campos);

  /* SEM TIPO, A OPÇÃO "ESCOLHA" TRAZ O RÓTULO PADRÃO; NA CARGA, VALE O TIPO QUE O NAVEGADOR RESTAUROU */
  if (tipo && nome) {
    tipo.addEventListener('change', () => ajustarNome(tipo, nome));
    ajustarNome(tipo, nome);
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!validarCampos(campos)) return;

    const mensagem = montarMensagem(tipo?.selectedOptions[0]?.dataset.mensagem ?? formulario.dataset.mensagem, campos);
    window.open(`https://wa.me/${formulario.dataset.whatsapp}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
  });
}

/* FUSO LOCAL: O TOISOSTRING USA UTC */
function hojeIso() {
  const hoje = new Date();
  return [hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
}

/* === NOME POR TIPO DE EVENTO (RÓTULO, EXEMPLO E ERRO VÊM DA OPÇÃO ESCOLHIDA) === */
function ajustarNome(tipo, nome) {
  const opcao = tipo.selectedOptions[0];
  const ajuda = document.getElementById(nome.getAttribute('aria-describedby'));

  nome.labels[0].textContent = opcao.dataset.rotuloNome;
  nome.placeholder = opcao.dataset.exemploNome;
  ajuda.dataset.erro = opcao.dataset.erroNome;

  /* JÁ EM ERRO: O TEXTO TROCA NA HORA (O ARIA-LIVE ANUNCIA) */
  if (nome.getAttribute('aria-invalid') === 'true') ajuda.querySelector('.contato-ajuda-texto').textContent = ajuda.dataset.erro;
}

/* === MENSAGEM === */
/* FRASE DO TIPO ESCOLHIDO (O DATA-MENSAGEM DO FORM É A RESERVA); CADA CAMPO TROCA O SEU {MARCADOR} */
/* OPCIONAL SEM FRASE VIRA "": COLAPSA O ESPAÇO DUPLO QUE SOBRA */
function montarMensagem(modelo, campos) {
  return campos
    .reduce((mensagem, campo) => mensagem.replace(campo.dataset.mensagem, formatar(campo)), modelo)
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/* DATA → "SÁBADO, 05/12/2026" EM MINÚSCULAS (FUSO LOCAL); SELECT → DATA-FRASE DA OPÇÃO */
/* CAMPO OPCIONAL → DATA-FRASE DO CAMPO COM O {VALOR} (NO SELECT, A DATA-FRASE DA OPÇÃO) OU, VAZIO, A DATA-FRASE-VAZIA (SEM ELA, "") */
const DIA_DA_SEMANA = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });

function formatar(campo) {
  const valor = campo.value.trim();
  const texto = campo.tagName === 'SELECT' ? campo.selectedOptions[0].dataset.frase ?? valor : valor;
  if (campo.dataset.frase) return valor ? campo.dataset.frase.replace('{valor}', texto) : campo.dataset.fraseVazia ?? '';
  if (campo.tagName === 'SELECT') return texto;
  if (campo.type !== 'date') return valor;

  const [ano, mes, dia] = valor.split('-').map(Number);
  const semana = DIA_DA_SEMANA.format(new Date(ano, mes - 1, dia)).toLocaleLowerCase('pt-BR');
  return `${semana}, ${valor.split('-').reverse().join('/')}`;
}
