/* =======================
   CAMPOS (VALIDAÇÃO DOS FORMULÁRIOS)
   ======================= */

/* === LIGAR OS CAMPOS === */
export function prepararCampos(campos) {
  campos.forEach((campo) => {
    const texto = textoDaAjuda(campo);
    if (texto) texto.dataset.normal = texto.textContent;

    /* SÓ VALIDA NO BLUR SE ALGO FOI PREENCHIDO (O CHECKBOX SÓ NO ENVIO: O VALUE DELE NUNCA FICA VAZIO) */
    campo.addEventListener('blur', () => {
      if (campo.type !== 'checkbox' && (campo.value || campo.validity.badInput)) validar(campo);
    });

    /* SAI DO ERRO ASSIM QUE FICA VÁLIDO (SELECT E CHECKBOX DISPARAM CHANGE) */
    ['input', 'change'].forEach((evento) => campo.addEventListener(evento, () => {
      if (campo.getAttribute('aria-invalid') === 'true' && valido(campo)) marcar(campo, true);
    }));
  });
}

/* VALIDA TODOS E FOCA O PRIMEIRO INVÁLIDO */
export function validarCampos(campos) {
  const invalidos = campos.filter((campo) => !validar(campo));
  invalidos[0]?.focus();
  return invalidos.length === 0;
}

/* === REGRAS === */
/* NUMBER: INTEIRO ≥ MIN; DATE: ≥ MIN; CHECKBOX: MARCADO; DEMAIS: MINLENGTH/MAXLENGTH EM CODE POINTS (IGUAL AO SERVIDOR) */
function valido(campo) {
  if (campo.type === 'checkbox') return campo.checked;

  /* OPCIONAL (SEM REQUIRED) E VAZIO: VÁLIDO; PREENCHIDO SEGUE AS REGRAS ABAIXO */
  const valor = campo.value.trim();
  if (!campo.required && valor === '') return true;
  if (campo.type === 'number') return !campo.validity.badInput && /^\d+$/.test(valor) && Number(valor) >= Number(campo.min);
  if (campo.type === 'date') return valor !== '' && valor >= campo.min;

  /* SELECT NÃO TEM MINLENGTH/MAXLENGTH (UNDEFINED); SEM O ATRIBUTO, O INPUT DEVOLVE -1 */
  const tamanho = [...valor].length;
  const minimo = campo.minLength > 0 ? campo.minLength : 1;
  const maximo = campo.maxLength > 0 ? campo.maxLength : Infinity;
  return tamanho >= minimo && tamanho <= maximo;
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
