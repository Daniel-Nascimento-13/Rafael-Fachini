# Rafael Fachini Decorações — Site

**A especificação completa está em BASE-PROJETO.md. Consulte antes de cada etapa.**

Landing page cinematográfica de um promoter de eventos e decorador que atende todo o Rio Grande do Sul. O portfólio visual (fotos e vídeos de eventos reais) é o principal argumento; o objetivo único é gerar lead qualificado pelo WhatsApp.

## Fluxo de trabalho
- **FASE ATUAL: ajustes de design + DEMO. ETAPAS 8–13 depois da aprovação. Não avance de etapa sozinho.**
- Implementar uma etapa do BASE-PROJETO.md (seção 11) por vez e parar esperando o "ok".
- Ao fim de cada tarefa: `npm run build` e corrigir erros.
- Não fazer commit nem push sem pedido explícito.
- Não sobrescrever nem apagar arquivo existente sem listar antes e receber o "ok".
- Campos [PENDENTE] continuam como `[MARCADOR]` no código; perguntar na etapa em que forem necessários, nunca inventar.

## Stack
Vite + HTML/CSS/JS vanilla + GSAP + ScrollTrigger + Lenis + fontes self-hosted (@fontsource). **Sem framework de CSS:** tokens em variáveis CSS (`@layer theme` em `main.css`).

- `npm run dev` — servidor local
- `npm run build` — build de produção em `dist/`
- `npm run preview` — serve o `dist/`

## Contexto do projeto
| Campo | Valor |
|---|---|
| Nome | Rafael Fachini Decorações |
| Descrição curta | Decoração e organização de eventos em todo o RS |
| Domínio | [DOMINIO] (pendente) |
| Cidade-base / região | [CIDADE] (pendente) / Rio Grande do Sul (atende todo o estado) |
| WhatsApp | [WHATSAPP_DDI_DDD_NUMERO] (pendente) |
| Instagram | [URL_INSTAGRAM] (pendente) |
| E-mail de aviso | [EMAIL_AVISO] (pendente) |
| Remetente | Rafael Fachini Decorações <avisos@[DOMINIO]> |
| Hospedagem | Vercel Hobby, deploy pelo GitHub (repositório ainda não existe) |

### Posicionamento
- Duas frentes complementares: **Organização de Eventos** e **Decoração** (o cliente contrata uma ou as duas).
- Público: PF (casamento, aniversário, formatura, infantil) e PJ (corporativo).
- A palavra "orçamento" está pendente (liberada ou vetada). Até a decisão, use "conversar sobre o seu evento".

### Estrutura
- **Home (ordem):** cabecalho, hero, manifesto, servicos, portfolio, processo, depoimentos, contato, rodape.
- **Páginas internas:** `/portfolio/`, `/depoimentos/`, `404.html` (input `erro` no `vite.config.js`, `noindex`).
- **Menu:** Nossa atuação (âncora `#servicos`) · Portfólio (página `/portfolio/`) · Como funciona · Depoimentos (página `/depoimentos/`) · Contato (+ botão WhatsApp).
- **Links do menu e do rodapé** (iguais nas 4 páginas): "Portfólio" sempre vai para `/portfolio/` e "Depoimentos" para `/depoimentos/` (navegação normal, sem Lenis; o menu mobile fecha no clique). Os demais são âncoras absolutas da home (`/#servicos`, `/#processo`, `/#contato`). O rodapé tem Nossa atuação · Portfólio · Como funciona · Depoimentos. A seção `#portfolio` da home continua (alvo do "Ver portfólio" do hero).
- **Barra do cabeçalho** (fixa, 64px / 80px a partir de 900): sobre o hero, `color-mix` 60% de `--color-fundo` + `backdrop-filter: blur(14px)` (com `-webkit-`) + hairline `--color-linha`. Depois de 80px (`.cabecalho-rolado`, JS): fundo sólido, sem blur. Sem suporte a `backdrop-filter`: 85% desde o início (o `@supports` fica antes do `.cabecalho-rolado` para não sobrescrevê-lo). Menu aberto: sólida, sem hairline. Transição 0.6s; nenhuma com movimento reduzido. Medido sobre o vídeo (pior instante): marca #F5F5F5 6.55:1 (375) e 16.7:1 (1440); links #A3A3A3 do desktop só 2.46:1 (1440), pendente de decisão.
- **Hambúrguer:** 3 `<span>` (nas 4 páginas), riscos 22×1.5px a 7px de centro a centro, o do meio no centro do botão de 44×44. Aberto (X): meio `opacity: 0` + `scaleX(0)`; de cima `translateY(7px) rotate(45deg)`; de baixo `translateY(-7px) rotate(-45deg)`; 0.5s `cubic-bezier(0.65, 0, 0.35, 1)`; sem transição com movimento reduzido.
- **Wordmark:** `data-topo` SÓ na home (sobe a página sem recarregar). Nas páginas internas o wordmark é um link normal para `/`.
- **Hero:** entrada do texto em CSS (`@keyframes hero-entrar` em `hero.css`, delays 0 / 0.12 / 0.24 / 0.36s, dentro de `prefers-reduced-motion: no-preference`), não em GSAP: o módulo carrega com defer e o texto piscaria. O `hero.js` só controla o play/pause do vídeo. h1 em 2 linhas no desktop (`max-width: 920px` no `.hero-texto`), de propósito.
- **Rótulo do hero** em `--color-texto-2` (#A3A3A3), só no hero (`.hero .rotulo`).
- **Véu do hero** (`.hero-midia::after`, só `color-mix` sobre `--color-fundo`). Sem camada de topo: o cabeçalho tem fundo próprio.
  - Até 899px, base `to top`: 100 / 92 (14%) / 88 (30%) / 82 (44%) / 68 (48%) / 48 (52%) / 28 (55%) / 12 (58%) / 0 (60%). As paradas de 14–44% são as mínimas para o rótulo passar de 4.7:1 em 375 (4.82:1; 768 = 6.5:1); baixá-las 2 pontos já reprova.
  - A partir de 900px, a lateral é a camada principal. Base `to top` 100 / 72 (12%) / 42 (22%) / 16 (30%) / 0 (35%), só a transição para a seção seguinte. Lateral `to right` 89 / 84 (25%) / 71 (38%) / 45 (50%) / 18 (60%) / 5 (66%) / 0 (70%): rótulo 5.48:1 em 1440 e 4.98:1 em 1920 (o h1 vai até ~65% da largura, por isso a lateral só zera em 70%).
  - Medido com o vídeo real (19 instantes, pior caso, percentil 99 da caixa do texto real via Range). Se o vídeo ou a posição do texto mudar, meça de novo.
- **Hero:** vídeo de eventos (`/videos/hero.mp4`) + poster (`/imagens/hero/hero-poster.jpg`, preload como LCP). Enquanto os arquivos não existem, placeholders com `aspect-ratio` fixo.

### Formulário → WhatsApp (seção contato)
Descritivo: "Conte o que você imagina. Sua mensagem chega pronta direto ao Rafael, no WhatsApp." Botão: "Enviar para o WhatsApp".

Todos os campos obrigatórios, nesta ordem: tipo (select) | servico (select) → nome (texto, linha inteira, rótulo dinâmico, `autocomplete="off"`: não é o nome de quem preenche) → data (date, mínimo = hoje no fuso local) | convidados (number, inteiro, mínimo 10) → cidade (texto, linha inteira). Os pares ficam lado a lado a partir de 600 (auto-placement; só nome e cidade têm `grid-column: 1 / -1`).

Cada campo tem `data-mensagem="{marcador}"`. As `<option>` do tipo também têm `data-mensagem` (a frase do tipo), por isso o JS pega os campos com `[data-mensagem]:not(option)`.

| servico | data-frase |
|---|---|
| Organização do evento | na organização do evento |
| Decoração | na decoração |
| Organização e decoração | na organização e na decoração |

**Nome e mensagem por tipo** (tudo nos atributos da `<option>`; o JS só lê): `data-rotulo-nome`, `data-exemplo-nome` (placeholder), `data-erro-nome` e `data-mensagem`. A opção "Escolha" traz o padrão (rótulo "Nome", sem placeholder, erro "Informe o nome."). No `change` do tipo (e na carga), o JS troca o `<label>`, o placeholder e o `data-erro` da dica; se o nome já está em erro, troca o texto na hora.

| tipo | rótulo · exemplo · erro | data-mensagem |
|---|---|---|
| Casamento | Nome dos noivos · Ex.: Ana e Pedro · Informe o nome dos noivos. | Olá, Rafael! Somos {nome} e vamos nos casar em {data}, com cerca de {convidados} convidados em {cidade}. Temos interesse {servico}. Podemos conversar? |
| Aniversário | Nome do aniversariante · Ex.: Marcos · Informe o nome do aniversariante. | Olá, Rafael! Estou planejando o aniversário de {nome} para {data}, com cerca de {convidados} convidados em {cidade}. Tenho interesse {servico}. Podemos conversar? |
| Formatura | Formando ou turma · Ex.: Medicina 2026 · Informe o formando ou a turma. | Olá, Rafael! Estou planejando a formatura de {nome} para {data}, com cerca de {convidados} convidados em {cidade}. Tenho interesse {servico}. Podemos conversar? |
| Infantil | Nome da criança · Ex.: Cecília · Informe o nome da criança. | Olá, Rafael! Estou planejando a festa infantil de {nome} para {data}, com cerca de {convidados} convidados em {cidade}. Tenho interesse {servico}. Podemos conversar? |
| Corporativo | Nome da empresa · Ex.: Acme · Informe o nome da empresa. | Olá, Rafael! Sou da {nome} e estamos planejando um evento corporativo para {data}, com cerca de {convidados} pessoas em {cidade}. Temos interesse {servico}. Podemos conversar? |

`data-mensagem` do `<form>` (reserva, se a opção não tiver frase): "Olá, Rafael! Sou {nome} e estou planejando um evento para {data}, com cerca de {convidados} pessoas em {cidade}. Tenho interesse {servico}. Podemos conversar?" O "na" vem da `data-frase` do serviço ("Tenho interesse na decoração."); {data} vira "sábado, 05/12/2026".

### Depoimentos
- Categorias (select, `schema.sql` e `_comum.js` idênticos): Casamento, Aniversário, Formatura, Infantil, Corporativo, Outro.
- Limites: nome 2–60 · cidade 2–60 · texto 10–400.
- Supabase Free (com cron de keep-alive). Contas Supabase/Resend pendentes (perguntar na ETAPA 10).
- **Carrossel** (spec 5.6): trilho com scroll-snap, sangra até a borda (margem negativa do respiro); itens 85% → 2 por vez (600) → 3 por vez (900, gap 24px). Controles somem pelo CSS (`:has`) quando os cards cabem: 1 card / ≤2 em 600 / ≤3 em 900. Card: `li.depoimentos-item > figure.depoimento > blockquote + figcaption.metadado` ("nome · categoria · cidade"); hairline em cima; texto em `--font-titulo` 20 → 24px. **No plugin da ETAPA 10, gerar o `figcaption` com `class="metadado"`.**
- **Formulário de envio** (front da 6.2): campos, dicas e erros usam as classes do `contato.css` (`.contato-campos`, `.contato-campo`, `.contato-ajuda`, `.contato-select`), como o `/portfolio/` usa o `portfolio.css`; o `depoimentos.css` só tem o textarea, o contador, o checkbox, a isca e os estados. A validação é a mesma do contato, em `utils/campos.js` (minlength/maxlength contados em code points, igual ao servidor; checkbox = marcado).
- **Demo — remover:**
  - [ ] ETAPA 9/10: os 3 cards de demo (comentário `DEMO: REMOVER NA ETAPA 9`) em `depoimentos/index.html`; o build injeta os aprovados no marcador `<!-- DEPOIMENTOS -->`.
  - [ ] ETAPA 11: o atributo `data-demo` do `.depoimentos-form` (comentário `DEMO: REMOVER data-demo NA ETAPA 11`). Com ele, o envio mostra o `.depoimentos-recebido` sem chamar `/api/depoimentos/`.

### SEO
- Title da home: "Rafael Fachini Decorações · Decoração e organização de eventos no RS". Internas: "<Página> · Rafael Fachini Decorações".
- **SEO da demo** (nas 4 páginas, até a ETAPA 8): `description` (140–160 caracteres) + `robots` `noindex, nofollow` (comentário `DEMO: REMOVER NA ETAPA 8`; na 404 volta a só `noindex`). OG + Twitter nas 3 indexáveis (a 404 não tem), com URL absoluta `https://[URL_DEMO]/...`: trocar pela `.vercel.app` depois do 1º deploy e por `[DOMINIO]` na ETAPA 8. Canonical, JSON-LD, robots.txt e sitemap.xml só na ETAPA 8.
- JSON-LD `LocalBusiness`, `areaServed` = `{ "@type": "State", "name": "Rio Grande do Sul" }`, endereço com a cidade-base (pendente), `sameAs` com o Instagram (pendente).

## Imagens (substitui o -500/-1000 da spec)
- Cada foto em 4 arquivos: `<nome>-800.webp`, `<nome>-1600.webp`, `<nome>-800.jpg`, `<nome>-1600.jpg`, em `/imagens/<secao>/`.
- `<picture>` com `<source type="image/webp" srcset="...-800.webp 800w, ...-1600.webp 1600w">` + `<img>` JPG com o mesmo srcset; `width`/`height` reais do arquivo -1600.
- `sizes` = largura real desenhada da foto em cada faixa do layout (até 599 / 600 / 900 / 1440+), considerando o respiro do `.envoltorio` (20 / 32 / 48px) e o gap do grid. Ex. (Serviços, 2 colunas em todas as larguras): `(min-width: 1440px) 648px, (min-width: 900px) calc(50vw - 72px), (min-width: 600px) calc(50vw - 48px), calc(83.34vw - 47px)` (até 599 a moldura é 4:5, de `50vw - 28px`, e a foto 4:3 em `cover` é desenhada 5/3 mais larga).
- Abaixo da dobra: `loading="lazy" decoding="async"`. Moldura fixa (`aspect-ratio`) + `object-fit: cover` + `object-position: var(--foco, 50% 50%)`.
- Placeholder: fundo do `<picture>`. Foto ausente ou quebrada: o `::after` do `img` (base.css) cobre o ícone e o alt com esse fundo.

### Mídias da demo (capturas de tela)
- Brutos em `_brutos/` (no `.gitignore`, fora do deploy). `artur.png`, `camila.png` e `rafa.png` ainda sem uso.
- Hero: `/videos/hero.mp4` (450×754, H.264, CRF 26, sem áudio, faststart, ~3 MB) + poster `/imagens/hero/hero-poster.jpg` (frame de 1s).
- Fotos menores que 800px: só o arquivo `-800`, na largura real (srcset com o descritor real, ex. `380w`; `width`/`height` reais). Nunca ampliar.
- Recorte cover por moldura: Serviços 4:3 (676×507); portfólio 3:4 (380×507), destaque 4:5 (406×507) e, na home a partir de 600px, 4:3 (676×507, `<nome>-43`). Um arquivo por recorte único: em `/portfolio/` cada tipo repete as fotos disponíveis apontando para os mesmos arquivos de `/imagens/portfolio/` (`casamento-1-34` = recorte 3:4 de `casamento1`).
- Ao trocar pelas mídias finais: gere -800/-1600 reais, volte o srcset de 2 entradas e use nome novo de arquivo (regra 11).

### Revisar quando as mídias chegarem
Toda seção nova com foto entra nesta lista (alt genérico ou arquivo ainda inexistente).
- [ ] Hero: `/videos/hero.mp4` e `/imagens/hero/hero-poster.jpg`.
- [ ] Serviços 01 (`/imagens/servicos/producao-*`): alt genérico "Organização de um evento realizado por Rafael Fachini".
- [ ] Serviços 02 (`/imagens/servicos/decoracao-*`): alt genérico "Decoração de um evento realizado por Rafael Fachini".
- [ ] Portfólio (home), 3 fotos em `/imagens/portfolio/` (`casamento-1`, `formatura-1`, `infantil-1`), cada uma em 2 recortes: retrato até 599 (destaque 4:5, dupla 3:4) e `-43` (4:3) a partir de 600. Alts genéricos por tipo ("Decoração de <tipo> realizada por Rafael Fachini"). Se as proporções mudarem, recalcule o `sizes`.
- [ ] og-image (`/imagens/compartilhamento/og-image.jpg`, 1200×630): recorte de `casamento1` (750×507, ampliado 1,24× para 630 de altura) + véu + wordmark + "Onde os sonhos ganham forma". Refazer com a foto final (nome novo de arquivo, regra 11).
- [ ] Favicon provisório (`/favicon-32.png`, `/apple-touch-icon.png` 180×180): monograma "RF" em Instrument Serif, branco sobre #0A0A0A. Trocar pelo logo real.
- [ ] Página `/portfolio/`, 30 fotos em `/imagens/portfolio/<tipo>/<NN>-*` (tipos: `casamento`, `aniversario`, `formatura`, `infantil`, `corporativo`; NN de 01 a 06): alts genéricos ("Decoração de <tipo> realizada por Rafael Fachini") e legendas `[LOCAL] · [CIDADE]`. Todas 3:4 (1600×2133).

### Páginas internas (/portfolio/, /depoimentos/, 404.html)
- Cabeçalho, menu mobile e rodapé são **cópias** dos da home: ao mudar um, mude nas 4 páginas.
- Diferenças nas internas: wordmark sem `data-topo` (link normal para `/`); sem o preload do poster.
- Página atual no menu: o item recebe `aria-current="page"` (em `/portfolio/`, o "Portfólio"; em `/depoimentos/`, o "Depoimentos"). Só no menu (desktop e mobile), não no rodapé. Estilo: sublinhado no desktop, itálico no menu mobile.
- O "Voltar ao topo ↑" do rodapé tem `href="#"` + `data-topo` em todas as páginas (com `#conteudo`, o handler de âncoras rolaria junto).
- Fundos: `.pagina-topo` em `fundo-base`, alternando até o rodapé (`fundo-superficie`).
- `/portfolio/`: sem filtro em JS; pílulas com âncoras (`#casamento`, `#aniversario`, `#formatura`, `#infantil`, `#corporativo`, trilho horizontal até 599px) e uma seção por tipo com grade 3:4 (1 → 2 → 3). Figura, moldura, foto e hover vêm do `portfolio.css`; o `portfolio-pagina.css` só muda proporção, placeholder e grade.
- `/depoimentos/`: abertura (`fundo-base`) → `.depoimentos-pagina` (carrossel, `fundo-superficie`, entre `DEPOIMENTOS:INICIO`/`FIM`) → `.depoimentos-envio` (formulário, `fundo-base`) → rodapé. **Fora do sitemap até a ETAPA 9.** Ver "Depoimentos" acima.
- 404: no `vite preview`, caminho inexistente devolve a home (fallback do Vite); teste a 404 em `/404.html`. Na Vercel, a `404.html` é servida com status 404.

### Portfólio (home)
- 3 itens, "destaque + dupla": casamento-1 (destaque), formatura-1, infantil-1. Legenda só com o tipo. Abaixo da grade, `.portfolio-mais` com "Ver todos os eventos →" (`/portfolio/`; largura total até 599). O `.secao-topo` não tem link.
- Grade de 2 colunas desde a base. Até 599 (gap 12): destaque em `1 / -1`, 4:5; dupla 3:4. 600–899 (gap 24): destaque 3:2, dupla 4:3. 900+ (`2fr 1fr`, gap 32): destaque na coluna 1 com `grid-row: span 2`, sem `aspect-ratio` (a altura vem da dupla, a foto é absoluta em `cover`), dupla empilhada em 4:3. Topo e base do destaque alinham com a 1ª e a 2ª foto da dupla.
- `<picture>` com direção de arte: `<source media="(min-width: 600px)">` (webp + jpg) com o recorte `-43`; abaixo disso o retrato. As molduras a partir de 600 são paisagem: com o retrato, a foto seria ampliada 2× e cortada.
- `sizes` (medidos no Chrome de 320 a 1920; no 900+ a moldura do destaque é ~1,22 e a foto 4:3 é desenhada mais larga). Destaque: retrato `calc(100vw - 40px)`; `-43` `(min-width: 1440px) 959px, (min-width: 900px) calc(66.67vw - 1px), calc(100vw - 64px)`. Dupla: retrato `calc(50vw - 26px)`; `-43` `(min-width: 1440px) 437px, (min-width: 900px) calc(33.34vw - 43px), calc(50vw - 44px)`.
- Hover só mouse: `scale(1.03)` na foto, 1.2s `cubic-bezier(0.22, 1, 0.36, 1)`.

## Tokens (`@layer theme` em main.css)
Só preto, branco e cinzas: nenhuma cor de matiz.

| Token | Valor | Uso |
|---|---|---|
| `--color-fundo` | #0A0A0A | fundo base |
| `--color-superficie` | #1A1A1A | seções alternadas |
| `--color-texto` | #F5F5F5 | títulos e links |
| `--color-texto-2` | #A3A3A3 | parágrafos |
| `--color-texto-3` | #8C8C8C | rótulos, metadados |
| `--color-acento` | #F5F5F5 | botão primário (texto do botão #0A0A0A) |
| `--color-acento-claro` | #FFFFFF | foco e destaques |
| `--color-linha` | rgba(245, 245, 245, 0.1) | hairlines |
| `--color-linha-forte` | rgba(245, 245, 245, 0.28) | borda do `.botao-secundario` |
| `--color-branco` | #fff | ainda sem uso: **sai na ETAPA 13** se continuar assim |
| `--font-titulo` | Instrument Serif 400 normal + itálico | títulos |
| `--font-texto` | Manrope 400/500/600 | texto corrido e botões |
| `--font-mono` | JetBrains Mono 400 | metadados e campos |

## Estrutura de pastas
```
index.html                    → home; carrega só /src/main.js
portfolio/index.html          → página /portfolio/
depoimentos/index.html        → página /depoimentos/
404.html                      → página de erro (noindex)
vite.config.js                → entradas multipágina (principal, portfolio, depoimentos, erro)
public/                       → servido na raiz, sem hash (imagens/, videos/)
src/
  main.js                     → entrada única
  estilos/                    → main.css, base.css, componentes.css, secoes/<secao>.css
  scripts/                    → core/, secoes/, utils/
```

## Regras
1. `index.html` (e cada página) carrega apenas `<script type="module" src="/src/main.js"></script>` (JSON-LD é dado, não script).
2. Lenis: `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`. Não iniciar Lenis com `reduzirMovimento`. Plugins registrados só em `core/rolagem.js`.
3. Cada módulo de seção só roda se o elemento existir no DOM.
4. Seções abaixo da dobra: `import()` dinâmico por IntersectionObserver (`rootMargin: 200px`).
5. Animações: 1.2–1.4s, `power3.out`; tudo desligado com `prefers-reduced-motion` (funcionalidades continuam).
6. Conteúdo (textos, links, WhatsApp, mensagens) fica no HTML, nunca hardcoded no JS. Sem `src/data/`.
7. Identificadores de CSS/JS em PORTUGUÊS, com prefixo da seção (`.contato-*`, `.depoimentos-*`). Comentários em CAIXA ALTA, curtos, só explicando o PORQUÊ. Explicações longas ficam neste arquivo.
   - CSS/JS — título:
     ```
     /* =======================
        TITULO
        ======================= */
     ```
     subtítulo: `/* === SUBTITULO === */`
   - HTML — título `<!-- =======================` / `     TITULO` / `     ======================= -->` e subtítulo `<!-- === SUBTITULO === -->` (títulos HEAD, NAVEGAÇÃO, CONTEÚDO, RODAPÉ).
   - Em CSS, RESPONSIVIDADE, HOVER (SÓ MOUSE) e MOVIMENTO REDUZIDO são subtítulos no fim do arquivo.
8. CSS mobile-first: media queries só com `min-width` (600 → 900 → 1200), no fim de cada arquivo. Todo `:hover` dentro de `@media (hover: hover) and (pointer: fine)`.
9. HTML, CSS e JS em arquivos separados. Sem código morto, sem `console.log` (`console.error` só nas funções `/api`).
10. Remover arquivos e dependências que ficarem sem uso.
11. Mídias em `public/` sem hash, referenciadas por caminho absoluto (`/imagens/...`); em metatags e JSON-LD, URL completa `https://[DOMINIO]/...`. Ao trocar o conteúdo de um arquivo, RENOMEIE (ex.: `hero-v2.jpg`).
12. Fundos alternados (`.fundo-base`/`.fundo-superficie`) no HTML; ao adicionar/mover seção, refazer a alternância.
13. Acessibilidade: um único h1 por página; h2 → h3; labels reais; contraste ≥ 4.5:1; foco visível; menu mobile fecha com Esc, deixa o resto `inert` e devolve o foco; `aria-invalid` + dica com `aria-live` nos formulários.
14. Nunca escrever valores de chaves, tokens ou URLs de hooks em arquivo versionado; só os NOMES no `.env.example`.
