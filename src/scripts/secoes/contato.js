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
  const campos = [...formulario.querySelectorAll('input, select')];
  const tipo = formulario.elements.tipo;
  const nome = formulario.elements.nome;
  const empresa = formulario.elements.empresa;

  const data = formulario.elements.data;
  if (data) data.min = hojeIso();

  prepararCampos(campos);

  /* SEM TIPO, A OPÇÃO "ESCOLHA" TRAZ O RÓTULO PADRÃO; NA CARGA, VALE O TIPO QUE O NAVEGADOR RESTAUROU */
  if (tipo && nome) {
    tipo.addEventListener('change', () => ajustarTipo(tipo, nome, empresa));
    ajustarTipo(tipo, nome, empresa);
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!validarCampos(campos)) return;

    const mensagem = montarMensagem(lerDados(formulario));
    window.open(`https://wa.me/${formulario.dataset.whatsapp}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
  });
}

/* FUSO LOCAL: O TOISOSTRING USA UTC */
function hojeIso() {
  const hoje = new Date();
  return [hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
}

/* === CAMPOS POR TIPO DE EVENTO (RÓTULO, EXEMPLO E ERRO DO NOME E A EMPRESA VÊM DA OPÇÃO ESCOLHIDA) === */
function ajustarTipo(tipo, nome, empresa) {
  const opcao = tipo.selectedOptions[0];
  const ajuda = document.getElementById(nome.getAttribute('aria-describedby'));

  nome.labels[0].textContent = opcao.dataset.rotuloNome;
  nome.placeholder = opcao.dataset.exemploNome;
  ajuda.dataset.erro = opcao.dataset.erroNome;

  /* JÁ EM ERRO: O TEXTO TROCA NA HORA (O ARIA-LIVE ANUNCIA) */
  if (nome.getAttribute('aria-invalid') === 'true') ajuda.querySelector('.contato-ajuda-texto').textContent = ajuda.dataset.erro;

  if (empresa) empresa.closest('.contato-campo').hidden = !('empresa' in opcao.dataset);
}

/* === MENSAGEM WHATSAPP === */
/* TEXTOS NO HTML: ABERTURA NA OPÇÃO DO TIPO, O RESTO NO FORM (DATA-PLURAL NA OPÇÃO ESCOLHE AS VERSÕES -PLURAL) */
function lerDados(formulario) {
  const textos = formulario.dataset;
  const opcao = formulario.elements.tipo.selectedOptions[0];
  const plural = 'plural' in opcao.dataset;
  const empresa = formulario.elements.empresa;

  /* EMPRESA ESCONDIDA (OUTRO TIPO) NÃO ENTRA, MESMO SE FOI PREENCHIDA ANTES */
  const fraseEmpresa = empresa && !empresa.closest('[hidden]') ? formatar(empresa) : '';

  return {
    saudacao: textos.saudacao,
    abertura: opcao.dataset.abertura.replace('{nome}', formulario.elements.nome.value.trim()).replace('{empresa}', fraseEmpresa),
    apresentacao: plural ? textos.apresentacaoPlural : textos.apresentacao,
    linhas: textos.linhas.split(' ').map((nome) => {
      const campo = formulario.elements[nome];
      return { rotulo: campo.dataset.rotuloMensagem, valor: formatar(campo) };
    }),
    despedida: plural ? textos.despedidaPlural : textos.despedida,
    agradecimento: plural ? textos.agradecimentoPlural : textos.agradecimento,
  };
}

/* CAMPO VAZIO NÃO GERA LINHA; RÓTULO EM *NEGRITO* (WHATSAPP) */
function montarMensagem({ saudacao, abertura, apresentacao, linhas, despedida, agradecimento }) {
  const itens = linhas.filter(({ valor }) => valor).map(({ rotulo, valor }) => `• *${rotulo}:* ${maiuscula(valor)}`);
  return [`${saudacao} ${abertura}`, apresentacao, '', ...itens, '', despedida, agradecimento].join('\n');
}

/* SÓ A PRIMEIRA LETRA: O RESTO FICA COMO FOI DIGITADO ("CTC") */
const maiuscula = (texto) => texto.charAt(0).toLocaleUpperCase('pt-BR') + texto.slice(1);

/* DATA → "SEXTA-FEIRA, 30/10/2026" (MEIO-DIA: NENHUM FUSO MUDA O DIA); COM DATA-FRASE, O {VALOR} ENTRA NELA; VAZIO → "" */
const DIA_DA_SEMANA = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });

function formatar(campo) {
  const valor = campo.value.trim();
  if (!valor) return '';
  if (campo.type === 'date') return `${DIA_DA_SEMANA.format(new Date(`${valor}T12:00:00`))}, ${valor.split('-').reverse().join('/')}`;
  return campo.dataset.frase ? campo.dataset.frase.replace('{valor}', valor) : valor;
}
