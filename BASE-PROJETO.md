# PROMPT-BASE — LANDING PAGE VITE MULTIPÁGINA + DEPOIMENTOS MODERADOS

Você vai criar este projeto seguindo exatamente a arquitetura abaixo.
Leia tudo antes de começar. Implemente UMA ETAPA POR VEZ (ver "11. ORDEM DE EXECUÇÃO")
e PARE ao final de cada etapa esperando a minha confirmação.

---

## 0. CONTEXTO DO PROJETO (PREENCHER)

```
NOME_DO_PROJETO ........ [NOME_DO_PROJETO]
SLUG (package.json) .... [slug-do-projeto]
DOMINIO ................ [DOMINIO]                (ex.: exemplo.com.br, sem https e sem barra)
DESCRICAO_CURTA ........ [DESCRICAO_CURTA]        (1 frase sobre o negócio)
CIDADE / REGIAO ........ [CIDADE] / [REGIAO]
WHATSAPP (só dígitos) .. [WHATSAPP_DDI_DDD_NUMERO]
INSTAGRAM .............. [URL_INSTAGRAM]
EMAIL_AVISO ............ [EMAIL_AVISO]            (quem recebe o aviso de novo depoimento)
REMETENTE_EMAIL ........ [NOME_DO_PROJETO] <avisos@[DOMINIO]>
COR_FUNDO .............. [COR_FUNDO]
COR_SUPERFICIE ......... [COR_SUPERFICIE]         (fundo alternado das seções)
COR_TEXTO / 2 / 3 ...... [COR_TEXTO] / [COR_TEXTO_2] / [COR_TEXTO_3]
COR_PRIMARIA ........... [COR_PRIMARIA]           (botões primários)
COR_PRIMARIA_CLARA ..... [COR_PRIMARIA_CLARA]     (destaques e foco sobre fundo escuro)
COR_LINHA .............. [COR_LINHA]              (hairlines, ex.: rgba do texto a 10%)
FONTE_TITULO ........... [FONTE_TITULO]           (pacote @fontsource)
FONTE_TEXTO ............ [FONTE_TEXTO]            (pacote @fontsource)
FONTE_MONO ............. [FONTE_MONO]             (pacote @fontsource, metadados e campos)
SECOES_DA_HOME ......... cabecalho, hero, [SECAO_A], [SECAO_B], ..., depoimentos, contato, rodape
PAGINAS_INTERNAS ....... depoimentos/ , [OUTRA_PAGINA]/ , 404.html
CATEGORIAS ............. [CATEGORIA_1], [CATEGORIA_2], ..., Outro   (select do depoimento)
LIMITES DO DEPOIMENTO .. nome 2–60 · cidade 2–60 · texto 10–400
```

Módulos [OPCIONAL] (apague a seção inteira se não for usar):

- `[OPCIONAL-ANIMACAO]` GSAP + ScrollTrigger + Lenis
- `[OPCIONAL-DEPOIMENTOS]` carrossel + envio + moderação + injeção no build
- `[OPCIONAL-SUPABASE]` banco dos depoimentos
- `[OPCIONAL-RESEND]` e-mail de moderação
- `[OPCIONAL-CRON]` keep-alive do Supabase

Se DEPOIMENTOS sair, saem também SUPABASE, RESEND, CRON, `/api`, `schema.sql`, o plugin do `vite.config` e as variáveis de ambiente.

---

## 1. STACK

Vite + HTML/CSS/JS vanilla (ES modules, `"type": "module"`).
Sem framework de JS. **Sem framework de CSS** (tokens em variáveis CSS puras).
Funções serverless da Vercel em Node, SEM dependências (fetch nativo + `node:crypto`).

package.json:

```
"private": true, "type": "module"
scripts: "dev": "vite", "build": "vite build", "preview": "vite preview"
dependencies:
  "gsap": "^3.15.0"                          [OPCIONAL-ANIMACAO]
  "lenis": "^1.3.27"                         [OPCIONAL-ANIMACAO]
  "@fontsource/[fonte-titulo]": "^5.3.0"
  "@fontsource/[fonte-texto]": "^5.3.0"
  "@fontsource/[fonte-mono]": "^5.3.0"
devDependencies:
  "vite": "^8.3.5"
```

Instalação:

```bash
npm install gsap@^3.15.0 lenis@^1.3.27 @fontsource/[fonte-titulo] @fontsource/[fonte-texto] @fontsource/[fonte-mono]
npm install -D vite@^8.3.5
```

`.gitignore`: `.DS_Store`, `.vscode/`, `dist/`, `build/`, `node_modules/`, `.env`, `.env.*`, `!.env.example`, `.vercel/`

---

## 2. ÁRVORE DE PASTAS

```
index.html                      → home; carrega SÓ <script type="module" src="/src/main.js">
depoimentos/index.html          → página /depoimentos/ (carrossel gerado no build + formulário) [OPCIONAL-DEPOIMENTOS]
[outra-pagina]/index.html       → página interna /[outra-pagina]/
404.html                        → página de erro (noindex; a Vercel serve com status 404)
vite.config.js                  → entradas multipágina + plugin que injeta depoimentos aprovados
vercel.json                     → trailingSlash, Cache-Control e cron
.env.example                    → NOMES das variáveis (sem valores); o .env nunca vai para o Git
CLAUDE.md                       → convenções do projeto (seção 9)
BASE-PROJETO.md                 → esta especificação
api/                            → funções da Vercel ("_" no nome = não vira rota)
  _comum.js                     → limites, escape de HTML, consultarSupabase, token HMAC, regex de UUID
  depoimentos.js                → POST do formulário: honeypot, validação, rate limit, grava pendente, e-mail
  moderar.js                    → GET mostra confirmação; POST aprova/recusa e dispara o Deploy Hook
  manter.js                     → keep-alive do Supabase chamado pelo cron (CRON_SECRET)
supabase/schema.sql             → tabela depoimentos (rodar 1x no SQL Editor)
public/                         → servido na raiz, SEM hash
  imagens/<grupo>/              → imagens do site (WebP + JPG), referenciadas como /imagens/...
  imagens/hero/                 → poster do hero (preload)
  imagens/compartilhamento/     → og-image.jpg (1200×630)
  videos/                       → vídeos (/videos/...)
  favicon-32.png, apple-touch-icon.png, robots.txt, sitemap.xml
src/
  main.js                       → ENTRADA ÚNICA: fontes, CSS, rolagem, teclado, cabeçalho e hero; o resto sob demanda
  estilos/
    main.css                    → ordem das camadas + imports + tokens (@layer theme)
    base.css                    → reset, foco, layout (.envoltorio, .secao), fundos, tipografia, utilitários
    componentes.css             → botões, .secao-topo, .link-secao, abertura das páginas internas
    secoes/<secao>.css          → UM arquivo por seção
  scripts/
    core/rolagem.js             → Lenis + ScrollTrigger; ÚNICO lugar que registra plugins; reexporta gsap e ScrollTrigger
    core/carregador.js          → carregarAoAproximar(seletor, carregar): IntersectionObserver + import()
    secoes/<secao>.js           → um módulo por seção, exporta iniciar<Secao>(elemento)
    utils/movimento.js          → export const reduzirMovimento
    utils/revelar.js            → revelar(elementos) e revelarEmSequencia(elementos, gatilho)
    utils/teclado.js            → detectarTeclado(): html.usando-teclado durante navegação por teclado
```

---

## 3. vite.config.js

- `defineConfig(({ mode }) => ({ plugins: [depoimentosAprovados(loadEnv(mode, process.cwd(), ''))], build: { rollupOptions: { input: {...} } } }))`
- `input: { principal: 'index.html', depoimentos: 'depoimentos/index.html', [outra]: '[outra-pagina]/index.html', erro: '404.html' }`
- **Como adicionar uma página:** criar `<pasta>/index.html` (carregando só `/src/main.js`), adicionar a chave em `input`, adicionar a URL (com barra final) no `sitemap.xml` e, se tiver seção nova, o CSS em `secoes/` + import no `main.css` + entrada em `secoesSobDemanda`.
- Importa `escaparHtml` e `consultarSupabase` de `./api/_comum.js` (mesmo código das funções).
- O plugin `depoimentosAprovados` está descrito na seção 6.5.

---

## 4. CSS (sem framework)

### main.css

```css
/* === CAMADAS (TOKENS → BASE → COMPONENTES; O QUE NÃO TEM CAMADA, COMO O LENIS, VENCE) === */
@layer theme, base, components;

@import "lenis/dist/lenis.css";                    /* [OPCIONAL-ANIMACAO] SEM CAMADA, DE PROPÓSITO */
@import "./base.css" layer(base);
@import "./componentes.css" layer(base);
@import "./secoes/<secao>.css" layer(components);  /* UM POR SEÇÃO, NA ORDEM DA PÁGINA */

@layer theme {
  :root {
    --color-fundo:        [COR_FUNDO];
    --color-superficie:   [COR_SUPERFICIE];
    --color-texto:        [COR_TEXTO];
    --color-texto-2:      [COR_TEXTO_2];
    --color-texto-3:      [COR_TEXTO_3];
    --color-acento:       [COR_PRIMARIA];
    --color-acento-claro: [COR_PRIMARIA_CLARA];
    --color-linha:        [COR_LINHA];
    --color-branco:       #fff;

    --font-titulo: "[FONTE_TITULO]", serif;
    --font-texto:  "[FONTE_TEXTO]", system-ui, sans-serif;
    --font-mono:   "[FONTE_MONO]", ui-monospace, monospace;
  }
}
```

- No CSS use SEMPRE `var(--color-*)` e `var(--font-*)`. Nunca cor solta.
- Sem preflight de framework: o reset fica no `base.css`.

### base.css (layer base)

- **Reset:** `*,*::before,*::after { margin:0; padding:0; box-sizing:border-box }`; img/svg/video `display:block` + `max-width:100%`; `a` herda cor sem sublinhado; ul/ol sem list-style; button/input/select com `font: inherit`.
- **Foco:** `:focus-visible { outline: 2px solid var(--color-acento-claro); outline-offset: 4px }`
- `.visualmente-oculto`; `.so-mobile` (some a partir de 600px); `.so-desktop` (só a partir de 600px).
- `.envoltorio { --respiro: 20px; max-width: calc(1344px + var(--respiro) * 2); margin-inline: auto; padding-inline: var(--respiro) }` → respiro 20 → 32 (600px) → 48 (900px).
- `.secao { padding-block: 96px }` → 140px a partir de 900px.
- `.fundo-base` / `.fundo-superficie`: alternância de fundo NO HTML, pela ordem real das seções. Nenhum CSS de seção define background próprio. Sem nth-child. Sem bordas entre seções.
- **Tipografia:** h1/h2/h3 com `--font-titulo`; h1 `clamp(36px, 6vw, 80px)`; h2 `clamp(20px, 3vw, 44px)`; h3 17 → 24 → 26px. `.rotulo` (sobretítulo), `.texto-intro`, `.destaque`, `.metadado` (mono 12px).

### componentes.css (layer base)

`.botao.botao-primario` (acento, pill, 52px de altura), `.botao.botao-secundario`, `.link-secao` ("Ver todos →"), `.secao-topo` (rótulo + h2 à esquerda, texto/link à direita a partir de 900px), abertura das páginas internas (`.pagina-topo`, `.pagina-titulo`, `.pagina-intro`).

### secoes/&lt;secao&gt;.css (layer components)

Um arquivo por seção, classes com o prefixo da seção. Ordem interna:

1. Estilos base (mobile)
2. `/* === RESPONSIVIDADE === */` — media queries no fim
3. `/* === HOVER (SÓ MOUSE) === */` — `@media (hover: hover) and (pointer: fine) { ...todo :hover... }`
4. `/* === MOVIMENTO REDUZIDO === */` — `@media (prefers-reduced-motion: reduce) { ... }`

Feedback de toque só com `:active`. `:focus-visible` fica fora do bloco de hover.

### Media queries (padrão único do projeto)

- **MOBILE-FIRST em todos os arquivos**, sempre `min-width`, da menor para a maior: **600px → 900px → 1200px**.
- Sem `max-width`, exceto em casos pontuais justificados com comentário (ex.: ajuste só para telas abaixo de 360px).
- Breakpoints: 600 (tablet), 900 (desktop: nav completa, 3 colunas), 1200 (telas largas).
- Teste de 320 a 1920px, sem overflow horizontal.

---

## 5. JAVASCRIPT

### 5.1 src/main.js (ENTRADA ÚNICA)

- Importa os CSS das fontes (`@fontsource/<fonte>/latin-400.css` etc., só os pesos usados) e `./estilos/main.css`.
- `const lenis = iniciarRolagem();`
- `detectarTeclado();`
- **Acima da dobra (estático):**
  ```js
  const cabecalho = document.querySelector('.cabecalho');
  if (cabecalho) iniciarCabecalho(cabecalho, lenis);

  const hero = document.querySelector('.hero');
  if (hero) iniciarHero(hero);
  ```
- **Abaixo da dobra (sob demanda):**
  ```js
  const secoesSobDemanda = [
    { seletor: '.[secao]', carregar: () => import('./scripts/secoes/[secao].js').then((m) => m.iniciar[Secao]) },
    { seletor: '.depoimentos', carregar: () => import('./scripts/secoes/depoimentos.js').then((m) => m.iniciarDepoimentos) },
    { seletor: '.depoimentos-pagina', carregar: () => import('./scripts/secoes/depoimentos.js').then((m) => m.iniciarDepoimentos) },
    { seletor: '.depoimentos-envio', carregar: () => import('./scripts/secoes/depoimentos.js').then((m) => m.iniciarDepoimentos) },
    { seletor: '.contato', carregar: () => import('./scripts/secoes/contato.js').then((m) => m.iniciarContato) },
    { seletor: '.rodape', carregar: () => import('./scripts/secoes/rodape.js').then((m) => m.iniciarRodape) },
  ];

  secoesSobDemanda.forEach(({ seletor, carregar }) => carregarAoAproximar(seletor, carregar));
  ```

### 5.2 src/scripts/core/rolagem.js [OPCIONAL-ANIMACAO]

- Importa `gsap`, `{ ScrollTrigger } from 'gsap/ScrollTrigger'`, `Lenis from 'lenis'` e `{ reduzirMovimento }`.
- `gsap.registerPlugin(ScrollTrigger)` NO TOPO DO MÓDULO: ÚNICO REGISTRO DO PROJETO.
- `export function iniciarRolagem()`:
  - `document.fonts.ready.then(() => ScrollTrigger.refresh());` (recalcula depois do swap das fontes)
  - Clique em `a[data-topo]`: `preventDefault`; `lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo(0, 0)`
  - `if (reduzirMovimento) return null;` (SEM Lenis com movimento reduzido)
  - `lenis = new Lenis();`
  - `lenis.on('scroll', ScrollTrigger.update);`
  - `gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));`
  - `gsap.ticker.lagSmoothing(0);`
  - Clique em `a[href^="#"]` com destino existente: `preventDefault` + `lenis.scrollTo(destino, { duration: 1.4 })`. SEM offset: o Lenis já desconta o `scroll-padding-top` (`html { scroll-padding-top: var(--altura-cabecalho) }`).
  - `return lenis;`
- `export { gsap, ScrollTrigger }` → TODOS os outros módulos importam gsap daqui, nunca de `'gsap'` direto.
- Sem o módulo de animação: `iniciarRolagem` vira só o tratamento de `[data-topo]` e retorna `null`.

### 5.3 src/scripts/core/carregador.js

```js
export function carregarAoAproximar(seletor, carregar) {
  const elemento = document.querySelector(seletor);
  if (!elemento) return;

  const observador = new IntersectionObserver((entradas) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;
    observador.disconnect();
    carregar().then((iniciar) => iniciar(elemento));
  }, { rootMargin: '200px' });

  observador.observe(elemento);
}
```

### 5.4 utils

- `movimento.js`: `export const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;`
- `revelar.js`: `ENTRADA = { y: 30, autoAlpha: 0, duration: 1.2, ease: 'power3.out' }`
  - `revelar(elementos)`: `gsap.from` por elemento, `scrollTrigger { trigger: elemento, start: 'top 88%', once: true }`
  - `revelarEmSequencia(elementos, gatilho)`: `gsap.from` com `stagger: 0.12`, `start: 'top 85%'`, `once: true`
- `teclado.js`: Tab/setas → `html.usando-teclado`; `pointerdown` remove (contorno de foco em inputs só no teclado).

### 5.5 Padrão de seção (secoes/&lt;secao&gt;.js)

```js
export function iniciar<Secao>(secao) {
  // 1) FUNCIONALIDADE (SEMPRE RODA: FORMULÁRIOS, CARROSSEL, ANO DO RODAPÉ...)
  // 2) if (reduzirMovimento) return;
  // 3) ANIMAÇÕES (revelar / revelarEmSequencia / gsap IMPORTADO DE core/rolagem.js)
}
```

- Só é chamado se o elemento existir (`main.js` / carregador garantem).
- Animações: duration 1–1.4s, ease `'power3.out'`. Tudo desligado com `reduzirMovimento`.
- Conteúdo (textos, número do WhatsApp, mensagens de erro, rótulos de botão) fica no HTML (`data-*`), NUNCA no JS.
- **cabecalho.js:** classe `.cabecalho-rolado` depois de 80px de scroll; menu mobile com `aria-expanded`, `aria-label` trocado por `data-rotulo-abrir`/`data-rotulo-fechar`, resto da página `inert`, `lenis.stop()`/`start()`, fecha com Esc devolvendo o foco ao botão, fecha ao passar para `min-width: 900px`.
- **hero.js:** vídeo `muted loop playsinline preload="none"` SEM autoplay; `play()`/`pause()` por IntersectionObserver; não toca com `reduzirMovimento` ou `navigator.connection?.saveData`; entrada em timeline com stagger 0.12.
- **rodape.js:** `[data-ano-atual]` recebe `new Date().getFullYear()` (o do HTML é fallback).

### 5.6 Carrossel com scroll-snap [OPCIONAL-DEPOIMENTOS]

HTML (igual na home e na página):

```html
<div class="depoimentos-carrossel">
  <ul class="depoimentos-trilho" tabindex="0" aria-label="Depoimentos"> ...li.depoimentos-item... </ul>
  <div class="depoimentos-controles">
    <p class="depoimentos-indicador" aria-hidden="true"><span data-atual>1</span> / <span data-total></span></p>
    <div class="depoimentos-setas">
      <button class="depoimentos-seta" type="button" aria-label="Anterior" data-direcao="-1">svg</button>
      <button class="depoimentos-seta" type="button" aria-label="Próximo" data-direcao="1">svg</button>
    </div>
  </div>
</div>
```

CSS:

```css
.depoimentos-trilho { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: var(--respiro); scrollbar-width: none; }
.depoimentos-trilho::-webkit-scrollbar { display: none; }
.depoimentos-item { flex: 0 0 85%; scroll-snap-align: start; }
/* 600PX: calc((100% - 16px) / 2) · 900PX: calc((100% - 48px) / 3) */

/* CONTROLES SOMEM PELO CSS (NÃO PELO JS), PARA A ALTURA SAIR CERTA NO PRIMEIRO PAINT */
.depoimentos-carrossel:not(:has(.depoimentos-item:nth-child(2))) .depoimentos-controles { display: none; }
/* 600PX: nth-child(3) · 900PX: nth-child(4) */
```

JS (`iniciarCarrossel`):

- `passo = cards[1].offsetLeft - cards[0].offsetLeft` (ou `clientWidth` com 1 card)
- `atualizar()`: seta anterior `disabled` se `scrollLeft <= 1`; próxima `disabled` no fim (`scrollLeft >= scrollWidth - clientWidth - 1`); indicador = no fim ? total : `Math.round(scrollLeft / passo) + 1`
- Setas: `trilho.scrollBy({ left: passo * Number(dataset.direcao), behavior: reduzirMovimento ? 'auto' : 'smooth' })`
- `scroll` (passive) e `resize` chamam `atualizar()`; `data-total` recebe `cards.length`.

### 5.7 Formulário → WhatsApp (secoes/contato.js)

HTML:

```html
<form class="contato-form" novalidate data-whatsapp="[WHATSAPP_DDI_DDD_NUMERO]"
      data-mensagem="Olá! Estou planejando {tipo} para {data}, com cerca de {convidados} pessoas em {cidade}. Gostaria de conversar.">
```

- Cada campo: `data-mensagem="{marcador}"`, `aria-describedby` → `<p class="contato-ajuda" aria-live="polite" data-erro="...">dica normal</p>`
- `<option>` do select com `data-frase="um [tipo] / uma [tipo]"`.

JS:

- `input[type=date]`: `min` = hoje no FUSO LOCAL (AAAA-MM-DD com `getFullYear`/`getMonth`/`getDate`; `toISOString` usa UTC).
- Validação própria: number = inteiro ≥ min e sem `badInput`; date = preenchida e ≥ min; demais = não vazio.
- Blur valida se algo foi preenchido; `input` remove o erro assim que fica válido.
- Erro: `setAttribute('aria-invalid', 'true')` (NUNCA `toggleAttribute`) + dica trocada pelo `data-erro`; ao corrigir, `removeAttribute` e restaura a dica.
- Submit: `preventDefault`; foca o primeiro inválido; senão monta a mensagem:
  ```js
  campos.reduce((msg, campo) => msg.replace(campo.dataset.mensagem, formatar(campo)), form.dataset.mensagem)
  ```
  - `formatar`: select → `selectedOptions[0].dataset.frase`; date → `"<dia da semana em minúsculas>, dd/mm/aaaa"` (`new Date(ano, mes - 1, dia)` + `Intl.DateTimeFormat('pt-BR', { weekday: 'long' })`); demais → valor como digitado.
  - `window.open(\`https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(mensagem)}\`, '_blank', 'noopener')`

---

## 6. DEPOIMENTOS: /api + BUILD [OPCIONAL-DEPOIMENTOS / SUPABASE / RESEND / CRON]

Fluxo: formulário → `POST /api/depoimentos/` (grava "pendente") → e-mail com Aprovar/Recusar → `GET /api/moderar/` (só confirma) → `POST /api/moderar/` (muda status) → aprovado dispara Deploy Hook → novo build injeta os aprovados no HTML. Não existem depoimentos de exemplo, nem em dev.

### 6.1 api/_comum.js

- `CATEGORIAS = [...]` e `LIMITES = { nome: [2, 60], cidade: [2, 60], texto: [10, 400] }` (OS MESMOS DO `schema.sql`)
- `tamanho = (texto) => [...texto].length` (code points, igual ao `char_length` do Postgres)
- `escaparHtml`: `& < > " '` → entidades
- `consultarSupabase(env, caminho, opcoes)`: fetch `${SUPABASE_URL sem barra final}/rest/v1/${caminho}` com headers `apikey: chave`; `Authorization: Bearer ${chave}` SÓ se a chave começar com `eyJ` (chave legada JWT; as `sb_secret_` não são JWT); `Content-Type` JSON. `!ok` → `throw Error(\`Supabase ${status}: ${texto}\`)`; 204 → `null`; senão `json()`.
- `tokenModeracao(id, acao)` = HMAC-SHA256(`id + acao`, `SEGREDO_MODERACAO`) em hex
- `tokenValido(id, acao, token)`: mesmo tamanho + `timingSafeEqual`
- `UUID` = regex de UUID genérico

### 6.2 api/depoimentos.js (POST)

- Método ≠ POST → 405 com header `Allow`.
- **Honeypot:** campo `site` (input escondido fora da tela, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden` no wrapper); se vier preenchido → `200 { ok: true }` SEM gravar.
- **Limpeza:** remove tags HTML; nome/cidade/categoria em 1 linha (`\s+` → espaço, trim); texto mantém parágrafos (`\r\n` → `\n`, espaços colapsados, no máximo 1 linha em branco).
- **Validação:** limites por `tamanho()`; categoria ∈ `CATEGORIAS`; `autorizado === true`. Inválido → `400 { erro: 'dados' }`.
- **Rate limit:** `ipHash = sha256(IP + SEGREDO_MODERACAO)` (IP = 1º item do `x-forwarded-for` ou `x-real-ip`); busca depoimentos com esse `ip_hash` e `criado_em ≥ agora − 1h` (limit 3); ≥ 3 → `429 { erro: 'limite' }`.
- Grava com `Prefer: return=representation` (status default "pendente") + `ip_hash`.
- **E-mail via Resend** (`POST https://api.resend.com/emails`, `Bearer RESEND_API_KEY`): from `[REMETENTE_EMAIL]`, to `[EMAIL_AVISO]`, versões html e text, todo conteúdo com `escaparHtml`, botões Aprovar/Recusar com link `${SITE_URL}/api/moderar/?id=${id}&acao=${acao}&token=${tokenModeracao(id, acao)}` e aviso de que o botão abre uma confirmação. Falha do Resend → throw.
- Sucesso → `201 { ok: true }`; erro → `500 { erro: 'servidor' }` (`console.error` do erro, sem segredos).

Front (`iniciarFormulario` em `depoimentos.js`): `novalidate`, `minlength`/`maxlength` no HTML, contador de caracteres, botão desabilitado e texto `data-enviando` durante o envio; fetch JSON para `form.action` com `autorizado = checkbox.checked`; sucesso esconde o form e foca `.depoimentos-recebido` (já no HTML com `hidden`); erro mostra `.depoimentos-erro` (429 usa `data-limite`) e o botão vira `data-tentar`.

### 6.3 api/moderar.js (GET + POST)

- `ACOES = { aprovar: { status: 'aprovado', ... }, recusar: { status: 'recusado', ... } }`
- Lê `{ id, acao, token }` de `req.query` (GET) ou `req.body` (POST). UUID inválido, ação desconhecida ou token inválido → 403.
- Busca o depoimento; inexistente → 404; status ≠ `pendente` → mostra "já foi &lt;status&gt;", nada muda.
- **GET:** SÓ mostra a página de confirmação com o depoimento e um `<form method="post" action="/api/moderar/">` com id/acao/token em hidden (antivírus de e-mail pré-abrem links: GET nunca modera).
- **POST:** `PATCH depoimentos?id=eq.<id>&status=eq.pendente` com `{ status, moderado_em: agora }` (o filtro de pendente impede moderar duas vezes); zero linhas → "já moderado".
- Recusado → página "Pronto". Aprovado → `dispararDeploy()`:
  - lê `VERCEL_DEPLOY_HOOK_URL` tolerando espaços/aspas coladas; só aceita https; POST na URL;
  - falhas vão para `console.error` SEM a URL; retorna boolean;
  - `false` → página avisando para fazer Redeploy manual no painel da Vercel.
- Resposta HTML mínima com CSS inline, conteúdo escapado e headers: `Content-Type: text/html; charset=utf-8` · `Cache-Control: no-store` · `X-Robots-Tag: noindex, nofollow` · `Referrer-Policy: no-referrer`.

### 6.4 api/manter.js (GET, keep-alive) [OPCIONAL-CRON]

- O plano Free do Supabase pausa após ~7 dias sem uso (derrubaria build e formulário).
- Método ≠ GET → 405. Autorização: header `Authorization === \`Bearer ${CRON_SECRET}\`` com `timingSafeEqual`; sem `CRON_SECRET` configurado, ninguém passa → 401.
- Consulta leve `depoimentos?select=id&limit=1` → `200 { ok: true }`; falha → 500 + `console.error` só com status/código, nunca chaves.

### 6.5 Injeção no build (plugin depoimentosAprovados no vite.config.js)

Marcadores EXATOS no HTML (não renomear):

```html
<!-- DEPOIMENTOS:INICIO --> ... <!-- DEPOIMENTOS_HOME --> ... <!-- DEPOIMENTOS:FIM -->   (home, limite 6)
<!-- DEPOIMENTOS:INICIO --> ... <!-- DEPOIMENTOS -->      ... <!-- DEPOIMENTOS:FIM -->   (página, sem limite)
```

Plugin: `{ name: 'depoimentos-aprovados', transformIndexHtml: { order: 'pre', async handler(html) {...} } }`

- Acha o marcador presente; se nenhum, devolve o html.
- Busca UMA vez por build (`busca ??= buscarAprovados(env)`) e reaproveita entre páginas.
- `buscarAprovados`: sem `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` → se `env.VERCEL`, throw (build falha na Vercel); local, retorna `[]`. Com as variáveis: `GET depoimentos?select=nome,cidade,categoria,texto&status=eq.aprovado&order=criado_em.desc`; qualquer falha → throw (build interrompido, a Vercel mantém o deploy anterior no ar).
- **Com aprovados:** troca o marcador por cards `<li class="depoimentos-item"><figure class="depoimento"><blockquote>texto</blockquote><figcaption>nome · categoria · cidade</figcaption></figure></li>` (TUDO com `escaparHtml`) e remove as linhas dos marcadores INICIO/FIM.
- **Sem aprovados:** remove tudo entre INICIO e FIM; se o bloco removido continha `fundo-base`/`fundo-superficie` (a seção inteira), INVERTE os `fundo-*` do resto do HTML para a alternância continuar.

---

## 7. SUPABASE: supabase/schema.sql [OPCIONAL-SUPABASE]

```sql
-- RODAR UMA VEZ NO SQL EDITOR. ACESSO SÓ PELO SERVIDOR (FUNÇÕES E BUILD) COM A SERVICE ROLE.
-- RLS ATIVO E NENHUMA POLICY: AS CHAVES ANON/PUBLISHABLE NÃO LEEM NEM GRAVAM NADA.
create table if not exists public.depoimentos (
  id           uuid primary key default gen_random_uuid(),
  criado_em    timestamptz not null default now(),
  nome         text not null check (char_length(nome) between 2 and 60),
  cidade       text not null check (char_length(cidade) between 2 and 60),
  categoria    text not null check (categoria in ('[CATEGORIA_1]', '[CATEGORIA_2]', 'Outro')),
  texto        text not null check (char_length(texto) between 10 and 400),
  autorizado   boolean not null check (autorizado = true),
  status       text not null default 'pendente' check (status in ('pendente', 'aprovado', 'recusado')),
  moderado_em  timestamptz,
  ip_hash      text
);

alter table public.depoimentos enable row level security;

create index if not exists depoimentos_status_criado_em_idx
  on public.depoimentos (status, criado_em desc);
```

- NÃO crie policies. A service role key nunca vai para o front.
- Limites e categorias devem ser idênticos em `schema.sql`, `_comum.js` e no HTML (`minlength`/`maxlength`/options).

---

## 8. vercel.json E VARIÁVEIS DE AMBIENTE

```json
{
  "trailingSlash": true,
  "headers": [
    { "source": "/imagens/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }] },
    { "source": "/videos/(.*)",  "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }] },
    { "source": "/assets/(.*)",  "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ],
  "crons": [{ "path": "/api/manter/", "schedule": "0 12 * * *" }]
}
```

- `trailingSlash: true` → todo caminho sem extensão leva barra (308). Por isso TODOS os endereços internos já têm barra: `action="/api/depoimentos/"`, links `/api/moderar/?...`, form da moderação e o cron `/api/manter/` (o cron não segue redirect).
- Plano Hobby: 1 execução de cron por dia.

`.env.example` (só nomes, comentados; cadastrar os mesmos na Vercel):

| Nome | Função | Obrigatória |
|---|---|---|
| SUPABASE_URL | URL do projeto Supabase (REST) | sim* |
| SUPABASE_SERVICE_ROLE_KEY | service role/secret key; só servidor e build; nunca a anon | sim* |
| RESEND_API_KEY | envio do e-mail de moderação | sim* |
| EMAIL_AVISO | destinatário do aviso de novo depoimento | sim* |
| SEGREDO_MODERACAO | HMAC dos links e salt do hash de IP (`openssl rand -hex 32`); trocar invalida links | sim* |
| VERCEL_DEPLOY_HOOK_URL | Deploy Hook da branch main (disparado ao aprovar) | sim* |
| CRON_SECRET | autoriza o cron em `/api/manter/` (só Production) | sim (se CRON) |
| SITE_URL | domínio base dos links do e-mail, sem barra final | sim* |

\* Obrigatória se o módulo DEPOIMENTOS existir. Sem `SUPABASE_*`: dev/build local seguem sem depoimentos; na Vercel o build falha.
Em `npm run dev` não existe `/api` (teste o envio com `vercel dev`).
Variável nova ou editada só vale depois de um Redeploy. Cole só o valor (sem nome, aspas ou espaços).

---

## 9. CONVENÇÕES (gerar o CLAUDE.md com isto)

No topo do CLAUDE.md: **"A especificação completa está em BASE-PROJETO.md. Consulte antes de cada etapa."**

1. `index.html` (e cada página) carrega apenas `<script type="module" src="/src/main.js"></script>` (JSON-LD é dado, não script).
2. Lenis: `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`. Não iniciar Lenis com `reduzirMovimento`. Plugins registrados só em `core/rolagem.js`.
3. Cada módulo de seção só roda se o elemento existir no DOM.
4. Seções abaixo da dobra: `import()` dinâmico por IntersectionObserver (`rootMargin: 200px`).
5. Animações: 1–1.4s, `power3.out`; tudo desligado com `prefers-reduced-motion` (funcionalidades continuam).
6. Conteúdo (textos, links, WhatsApp, mensagens) fica no HTML, nunca hardcoded no JS.
7. Identificadores de CSS/JS em PORTUGUÊS, com prefixo da seção (`.contato-*`, `.depoimentos-*`). Comentários em CAIXA ALTA, curtos, só explicando o PORQUÊ. Explicações longas ficam no CLAUDE.md.
   - CSS/JS — título:
     ```
     /* =======================
        TITULO
        ======================= */
     ```
     subtítulo: `/* === SUBTITULO === */`
   - HTML — título: `<!-- ======================= / TITULO / ======================= -->` e subtítulo `<!-- === SUBTITULO === -->` (títulos HEAD, NAVEGAÇÃO, CONTEÚDO, RODAPÉ).
   - Em CSS, RESPONSIVIDADE, HOVER (SÓ MOUSE) e MOVIMENTO REDUZIDO são subtítulos no fim do arquivo.
8. CSS mobile-first: media queries só com `min-width` (600 → 900 → 1200), no fim de cada arquivo.
9. HTML, CSS e JS em arquivos separados. Sem código morto, sem `console.log` (`console.error` só nas funções `/api`).
10. Remover arquivos e dependências que ficarem sem uso.
11. Mídias em `public/` sem hash, referenciadas por caminho absoluto (`/imagens/...`); em metatags e JSON-LD, URL completa `https://[DOMINIO]/...`. Ao trocar o conteúdo de um arquivo, RENOMEIE (ex.: `hero-v2.jpg`) para não servir cache velho.
12. Ao fim de cada tarefa: `npm run build` e corrigir erros.
13. Fundos alternados (`.fundo-base`/`.fundo-superficie`) no HTML; ao adicionar/mover seção, refazer a alternância.
14. Acessibilidade: um único h1 por página; h2 → h3; labels reais; contraste ≥ 4.5:1; foco visível; menu mobile fecha com Esc, deixa o resto `inert` e devolve o foco; `aria-invalid` + dica com `aria-live` nos formulários.

---

## 10. SEO E MÍDIA

`<head>` de toda página indexável:

- `charset`, `viewport`, `<title>` "[Página] · [NOME_DO_PROJETO]" (home: "[NOME_DO_PROJETO] · [DESCRICAO_CURTA]", ~60 caracteres).
- `meta description` (140–160 caracteres, com cidade/região), `theme-color` [COR_FUNDO].
- `<link rel="canonical" href="https://[DOMINIO]/[pagina]/">` (sempre com barra final).
- `favicon-32.png` + `apple-touch-icon.png`.
- Open Graph: `og:title`, `og:description`, `og:image` (URL completa) + `og:image:width` 1200 + `og:image:height` 630 + `og:image:alt`, `og:url`, `og:type` website, `og:locale` pt_BR, `og:site_name`.
- Twitter: `summary_large_image` + title, description, image, image:alt (iguais ao OG).
- JSON-LD: home com `@graph [ <TipoDoNegocio> (@id #empresa, contato, endereço, areaServed, sameAs [URL_INSTAGRAM]) + WebSite (@id #site, publisher #empresa) ]`; páginas internas com `BreadcrumbList`. Nunca `aggregateRating`/`review` sem dados reais.

`404.html`: `<meta name="robots" content="noindex">`, fora do sitemap.

`public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://[DOMINIO]/sitemap.xml
```

`public/sitemap.xml`: todas as páginas indexáveis com barra final e `<lastmod>` = data do último commit da página (`git log -1 --format=%cs -- <arquivo>`). Página nova entra aqui.

**Imagens:**

- `<picture>` com `<source type="image/webp" srcset="...-500.webp 500w, ...-1000.webp 1000w" sizes="...">` + `<img>` JPG de fallback.
- O descritor do srcset usa a largura REAL do arquivo (nunca ampliar); `width`/`height` reais no `<img>` (CLS zero).
- `sizes` = largura desenhada da imagem por faixa, considerando `object-fit: cover`.
- Abaixo da dobra: `loading="lazy" decoding="async"`. Imagem principal acima da dobra: `fetchpriority="high"`, sem lazy.
- Enquadramento: `object-fit: cover` + `object-position: var(--foco, 50% 50%)`, ajustável com `style="--foco: X% Y%"`.
- Placeholders com `aspect-ratio` fixo.

**Vídeo (hero):**

- `<video muted loop playsinline preload="none" poster="/imagens/hero/hero-poster.jpg">` SEM autoplay; `play()` via JS só na tela.
- `<link rel="preload" as="image" href="/imagens/hero/hero-poster.jpg" fetchpriority="high">` no `<head>` (poster = LCP; nunca esconda o poster com opacidade/clip-path na entrada).
- Exportação: H.264, yuv420p, sem áudio, `+faststart`, meta de até ~5 MB.
- Texto nunca sobre o vídeo sem fundo sólido ou máscara que garanta contraste.

---

## 11. ORDEM DE EXECUÇÃO (UMA ETAPA POR VEZ — PARE E ESPERE MINHA CONFIRMAÇÃO)

**ETAPA 0 — Diagnóstico (sem alterar nada):** liste os arquivos que já existem na pasta e o que contêm; diga o que vai manter, substituir ou apagar na ETAPA 1; liste os campos da seção 0 ainda vazios ou com [MARCADOR].
**ETAPA 1 — Base:** package.json, instalação, .gitignore, vite.config.js (multipágina, SEM o plugin ainda), index.html mínimo, CLAUDE.md com as convenções da seção 9. Rodar `npm run build`.
**ETAPA 2 — CSS base:** main.css (camadas + tokens), base.css, componentes.css; fontes self-hosted no main.js.
**ETAPA 3 — Núcleo JS:** main.js, core/rolagem.js, core/carregador.js, utils (movimento, revelar, teclado).
**ETAPA 4 — Cabeçalho + menu mobile + hero** (HTML, CSS e JS), com preload do poster.
**ETAPA 5 — Seções de conteúdo da home**, uma por vez (HTML + secoes/&lt;secao&gt;.css + secoes/&lt;secao&gt;.js), com fundos alternados.
**ETAPA 6 — Contato** com o formulário → WhatsApp + rodapé.
**ETAPA 7 — Páginas internas + 404.html** (cabeçalho/rodapé com links absolutos) + entradas no vite.config.
**ETAPA 8 — SEO:** metatags, OG, Twitter, canonical, JSON-LD, robots.txt, sitemap.xml, favicons, og-image.
**ETAPA 9 — [OPCIONAL-DEPOIMENTOS]** Carrossel (HTML com marcadores, CSS scroll-snap, JS) + formulário de envio no front.
**ETAPA 10 — [OPCIONAL-SUPABASE]** supabase/schema.sql + api/_comum.js + plugin depoimentosAprovados no vite.config.
**ETAPA 11 — [OPCIONAL-RESEND]** api/depoimentos.js + api/moderar.js + .env.example (só nomes).
**ETAPA 12 — [OPCIONAL-CRON]** api/manter.js + vercel.json (headers, trailingSlash, cron).
**ETAPA 13 — Revisão final:** build sem erros, sem console.log, sem código morto, sem dependências sem uso, teste de 320 a 1920px, prefers-reduced-motion, navegação por teclado.

**Regras de execução:**

- Ao fim de cada etapa: rode `npm run build`, liste os arquivos criados/alterados e PARE esperando meu "ok".
- Não sobrescreva nem apague arquivo existente sem listar antes e receber meu "ok".
- Não faça commit nem push sem eu pedir.
- Nunca escreva valores de chaves, tokens ou URLs de hooks em arquivo versionado; só os NOMES no `.env.example`.
- Se uma informação da seção 0 estiver vazia, pergunte antes de inventar.
