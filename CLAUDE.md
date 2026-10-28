# Rafael Fachini Decorações — Site

**A especificação completa está em BASE-PROJETO.md. Consulte antes de cada etapa.**

Landing page cinematográfica de um promoter de eventos e decorador que atende todo o Rio Grande do Sul. O portfólio visual (fotos e vídeos de eventos reais) é o principal argumento; o objetivo único é gerar lead qualificado pelo WhatsApp.

## Fluxo de trabalho
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
| Descrição curta | Decoração e produção de eventos em todo o RS |
| Domínio | [DOMINIO] (pendente) |
| Cidade-base / região | [CIDADE] (pendente) / Rio Grande do Sul (atende todo o estado) |
| WhatsApp | [WHATSAPP_DDI_DDD_NUMERO] (pendente) |
| Instagram | [URL_INSTAGRAM] (pendente) |
| E-mail de aviso | [EMAIL_AVISO] (pendente) |
| Remetente | Rafael Fachini Decorações <avisos@[DOMINIO]> |
| Hospedagem | Vercel Hobby, deploy pelo GitHub (repositório ainda não existe) |

### Posicionamento
- Duas frentes complementares: **Produção de Eventos** e **Decoração** (o cliente contrata uma ou as duas).
- Público: PF (casamento, aniversário, formatura, infantil) e PJ (corporativo).
- A palavra "orçamento" está pendente (liberada ou vetada). Até a decisão, use "conversar sobre o seu evento".

### Estrutura
- **Home (ordem):** cabecalho, hero, manifesto, servicos, portfolio, processo, depoimentos, contato, rodape.
- **Páginas internas:** `/portfolio/`, `/depoimentos/`, `404.html` (input `erro` no `vite.config.js`, `noindex`).
- **Menu:** Nossa atuação (âncora `#servicos`) · Portfólio · Como funciona · Depoimentos · Contato (+ botão WhatsApp).
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
Todos os campos obrigatórios, nesta ordem: nome (texto), servico (select), tipo (select), data (date, mínimo = hoje no fuso local), convidados (number, inteiro, mínimo 10), cidade (texto).

| servico | data-frase |
|---|---|
| Produção do evento | na produção do evento |
| Decoração | na decoração |
| Produção e decoração | na produção e na decoração |

| tipo | data-frase |
|---|---|
| Casamento | um casamento |
| Aniversário | um aniversário |
| Formatura | uma formatura |
| Infantil | uma festa infantil |
| Corporativo | um evento corporativo |

`data-mensagem`: "Olá, Rafael! Sou {nome} e estou planejando {tipo} para {data}, com cerca de {convidados} pessoas em {cidade}. Tenho interesse {servico}. Podemos conversar?" (o "na" vem da `data-frase`: "Tenho interesse na decoração.")

### Depoimentos
- Categorias (select, `schema.sql` e `_comum.js` idênticos): Casamento, Aniversário, Formatura, Infantil, Corporativo, Outro.
- Limites: nome 2–60 · cidade 2–60 · texto 10–400.
- Supabase Free (com cron de keep-alive). Contas Supabase/Resend pendentes (perguntar na ETAPA 10).

### SEO
- Title da home: "Rafael Fachini Decorações · Decoração e produção de eventos no RS". Internas: "<Página> · Rafael Fachini Decorações".
- JSON-LD `LocalBusiness`, `areaServed` = `{ "@type": "State", "name": "Rio Grande do Sul" }`, endereço com a cidade-base (pendente), `sameAs` com o Instagram (pendente).

## Imagens (substitui o -500/-1000 da spec)
- Cada foto em 4 arquivos: `<nome>-800.webp`, `<nome>-1600.webp`, `<nome>-800.jpg`, `<nome>-1600.jpg`, em `/imagens/<secao>/`.
- `<picture>` com `<source type="image/webp" srcset="...-800.webp 800w, ...-1600.webp 1600w">` + `<img>` JPG com o mesmo srcset; `width`/`height` reais do arquivo -1600.
- `sizes` = largura real desenhada da foto em cada faixa do layout (até 599 / 600 / 900 / 1440+), considerando o respiro do `.envoltorio` (20 / 32 / 48px) e o gap do grid. Ex. (Serviços, 2 colunas a partir de 600): `(min-width: 1440px) 648px, (min-width: 900px) calc(50vw - 72px), (min-width: 600px) calc(50vw - 48px), calc(100vw - 40px)`.
- Abaixo da dobra: `loading="lazy" decoding="async"`. Moldura fixa (`aspect-ratio`) + `object-fit: cover` + `object-position: var(--foco, 50% 50%)`.
- Placeholder: fundo do `<picture>`. Foto ausente ou quebrada: o `::after` do `img` (base.css) cobre o ícone e o alt com esse fundo.

### Mídias da demo (capturas de tela)
- Brutos em `_brutos/` (no `.gitignore`, fora do deploy). `artur.png`, `camila.png` e `rafa.png` ainda sem uso.
- Hero: `/videos/hero.mp4` (450×754, H.264, CRF 26, sem áudio, faststart, ~3 MB) + poster `/imagens/hero/hero-poster.jpg` (frame de 1s).
- Fotos menores que 800px: só o arquivo `-800`, na largura real (srcset com o descritor real, ex. `380w`; `width`/`height` reais). Nunca ampliar.
- Recorte cover por moldura: Serviços 4:3 (676×507); portfólio 3:4 (380×507) e destaque 4:5 (406×507). Um arquivo por recorte único: em `/portfolio/` cada tipo repete as fotos disponíveis apontando para os mesmos arquivos de `/imagens/portfolio/` (`casamento-1-34` = recorte 3:4 de `casamento1`).
- Ao trocar pelas mídias finais: gere -800/-1600 reais, volte o srcset de 2 entradas e use nome novo de arquivo (regra 11).

### Revisar quando as mídias chegarem
Toda seção nova com foto entra nesta lista (alt genérico ou arquivo ainda inexistente).
- [ ] Hero: `/videos/hero.mp4` e `/imagens/hero/hero-poster.jpg`.
- [ ] Serviços 01 (`/imagens/servicos/producao-*`): alt genérico "Produção de um evento realizado por Rafael Fachini".
- [ ] Serviços 02 (`/imagens/servicos/decoracao-*`): alt genérico "Decoração de um evento realizado por Rafael Fachini".
- [ ] Portfólio (home), 6 fotos em `/imagens/portfolio/` (`casamento-1`, `formatura-1`, `aniversario-1`, `infantil-1`, `corporativo-1`, `casamento-2`): alts genéricos por tipo ("Decoração de <tipo> realizada por Rafael Fachini") e `[CIDADE]` nas legendas. O destaque (`casamento-1`) é 4:5 (1600×2000); os outros 3:4 (1600×2133). Se a proporção real mudar, recalcule o `sizes`.

- [ ] Página `/portfolio/`, 30 fotos em `/imagens/portfolio/<tipo>/<NN>-*` (tipos: `casamento`, `aniversario`, `formatura`, `infantil`, `corporativo`; NN de 01 a 06): alts genéricos ("Decoração de <tipo> realizada por Rafael Fachini") e legendas `[LOCAL] · [CIDADE]`. Todas 3:4 (1600×2133).

### Páginas internas (/portfolio/, /depoimentos/, 404.html)
- Cabeçalho, menu mobile e rodapé são **cópias** dos da home: ao mudar um, mude nas 4 páginas.
- Diferenças nas internas: wordmark sem `data-topo` (link normal para `/`); sem o preload do poster.
- Página atual no menu: o item aponta para a própria página com `aria-current="page"` (`/portfolio/` e `/depoimentos/`, em vez de `/#portfolio` e `/#depoimentos`); os demais seguem absolutos (`/#servicos` etc.). Estilo: sublinhado no desktop, itálico no menu mobile.
- O "Voltar ao topo ↑" do rodapé tem `href="#"` + `data-topo` em todas as páginas (com `#conteudo`, o handler de âncoras rolaria junto).
- Fundos: `.pagina-topo` em `fundo-base`, alternando até o rodapé (`fundo-superficie`).
- `/portfolio/`: sem filtro em JS; pílulas com âncoras (`#casamento`, `#aniversario`, `#formatura`, `#infantil`, `#corporativo`, trilho horizontal até 599px) e uma seção por tipo com grade 3:4 (1 → 2 → 3). Figura, moldura, foto e hover vêm do `portfolio.css`; o `portfolio-pagina.css` só muda proporção, placeholder e grade.
- `/depoimentos/`: esqueleto até a ETAPA 9. **Fora do sitemap até a ETAPA 9.**
- 404: no `vite preview`, caminho inexistente devolve a home (fallback do Vite); teste a 404 em `/404.html`. Na Vercel, a `404.html` é servida com status 404.

### Portfólio (home)
- Mobile (até 599px): trilho horizontal com scroll-snap, só CSS (`flex: 0 0 82%`, sangra até a borda com margem negativa do respiro, `tabindex="0"` + `aria-label` no `<ul>`), todos os itens 4:5. A partir de 600px: grade de 2 → 3 colunas. Em 600–899 todos 3:4 (linha alinhada) e a partir de 900 ocupa **2 colunas × 2 linhas** (os 6 itens fecham a grade 3×3 sem buraco). Nessa faixa a moldura não tem `aspect-ratio`: a altura vem dos vizinhos e a foto é absoluta (`cover`).
- `sizes` do destaque (moldura medida no Chrome; a foto 4:5 é desenhada mais larga que a moldura de ~0,73): `(min-width: 1440px) 974px, (min-width: 900px) calc(71.1vw - 50px), (min-width: 600px) calc(53.34vw - 46px), calc(82vw - 32px)`. Demais: `(min-width: 1440px) 427px, (min-width: 900px) calc(33.34vw - 53px), (min-width: 600px) calc(50vw - 44px), calc(82vw - 32px)`.
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
