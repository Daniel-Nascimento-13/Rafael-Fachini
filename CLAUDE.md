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
- **Menu:** Serviços · Portfólio · Como funciona · Depoimentos · Contato (+ botão WhatsApp).
- **Wordmark:** `data-topo` SÓ na home (sobe a página sem recarregar). Nas páginas internas o wordmark é um link normal para `/`.
- **Hero:** entrada do texto em CSS (`@keyframes hero-entrar` em `hero.css`, delays 0 / 0.12 / 0.24 / 0.36s, dentro de `prefers-reduced-motion: no-preference`), não em GSAP: o módulo carrega com defer e o texto piscaria. O `hero.js` só controla o play/pause do vídeo. h1 em 2 linhas no desktop (`max-width: 920px` no `.hero-texto`), de propósito.
- **Hero:** vídeo de eventos (`/videos/hero.mp4`) + poster (`/imagens/hero/hero-poster.jpg`, preload como LCP). Enquanto os arquivos não existem, placeholders com `aspect-ratio` fixo.

### Formulário → WhatsApp (seção contato)
Todos os campos obrigatórios, nesta ordem: nome (texto), servico (select), tipo (select), data (date, mínimo = hoje no fuso local), convidados (number, inteiro, mínimo 10), cidade (texto).

| servico | data-frase |
|---|---|
| Produção do evento | a produção do evento |
| Decoração | a decoração |
| Produção e decoração | a produção e a decoração |

| tipo | data-frase |
|---|---|
| Casamento | um casamento |
| Aniversário | um aniversário |
| Formatura | uma formatura |
| Infantil | uma festa infantil |
| Corporativo | um evento corporativo |

`data-mensagem`: "Olá, Rafael! Sou {nome} e estou planejando {tipo} para {data}, com cerca de {convidados} pessoas em {cidade}. Tenho interesse em {servico}. Podemos conversar?"

### Depoimentos
- Categorias (select, `schema.sql` e `_comum.js` idênticos): Casamento, Aniversário, Formatura, Infantil, Corporativo, Outro.
- Limites: nome 2–60 · cidade 2–60 · texto 10–400.
- Supabase Free (com cron de keep-alive). Contas Supabase/Resend pendentes (perguntar na ETAPA 10).

### SEO
- Title da home: "Rafael Fachini Decorações · Decoração e produção de eventos no RS". Internas: "<Página> · Rafael Fachini Decorações".
- JSON-LD `LocalBusiness`, `areaServed` = `{ "@type": "State", "name": "Rio Grande do Sul" }`, endereço com a cidade-base (pendente), `sameAs` com o Instagram (pendente).

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
