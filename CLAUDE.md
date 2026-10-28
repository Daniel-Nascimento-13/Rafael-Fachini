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
| WhatsApp | 5551997504346 (`https://wa.me/5551997504346`) |
| Instagram | https://www.instagram.com/rafaelfachinidecoracoes/ (entra no `sameAs` do JSON-LD na ETAPA 8) |
| E-mail de aviso | [EMAIL_AVISO] (pendente) |
| Remetente | Rafael Fachini Decorações <avisos@[DOMINIO]> |
| Hospedagem | Vercel Hobby, deploy pelo GitHub (repositório ainda não existe) |

### Posicionamento
- Duas frentes complementares: **Organização de Eventos** e **Decoração** (o cliente contrata uma ou as duas).
- Público: PF (casamento, aniversário, formatura, infantil) e PJ (corporativo).
- A palavra "orçamento" está pendente (liberada ou vetada). Até a decisão, use "conversar sobre o seu evento".

### Estrutura
- **Home (ordem):** cabecalho, hero, manifesto, equipe, servicos, portfolio, processo, depoimentos (ETAPA 9), contato, rodape.
- **Fundos da home:** hero base → manifesto superfície → equipe base → nossa atuação superfície → portfólio base → processo superfície → contato base → rodapé superfície. Placeholders de foto contrastam com o fundo da seção (serviços: `--color-fundo`; equipe: `--color-superficie`; `.portfolio-foto`: superfície, e `--color-fundo` dentro de `.fundo-superficie`, o que também cobre os grupos da `/portfolio/`).
- **Páginas internas:** `/portfolio/`, `/depoimentos/`, `404.html` (input `erro` no `vite.config.js`, `noindex`).
- **Menu:** Início · Nossa atuação (âncora `#servicos`) · Portfólio (página `/portfolio/`) · Como funciona · Depoimentos (página `/depoimentos/`) · Contato (só no mobile) + botão WhatsApp. Gap da lista do desktop 24px até 1199 (os 5 itens + WhatsApp cabem em uma linha desde 900) → 32px em 1200.
- **Links do menu e do rodapé** (iguais nas 4 páginas): "Início" é o 1º item do menu (desktop e mobile, onde recebe o foco ao abrir) e da 1ª lista do rodapé. Na home: `href="/"` + `data-topo` (sobe com o Lenis, sem recarregar) e `aria-current="page"` só no menu; nas internas: `href="/"` normal, sem `aria-current`. "Portfólio" sempre vai para `/portfolio/` e "Depoimentos" para `/depoimentos/` (navegação normal, sem Lenis; o menu mobile fecha no clique). Os demais são âncoras absolutas da home (`/#servicos`, `/#processo`, `/#contato`). O rodapé tem Início · Nossa atuação · Portfólio · Como funciona · Depoimentos. A seção `#portfolio` da home continua (alvo do "Ver portfólio" do hero).
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

Ordem: tipo (select) | servico (select) → nome (texto, linha inteira, rótulo dinâmico, `autocomplete="off"`: não é o nome de quem preenche) → data (date, mínimo = hoje no fuso local) | convidados (number, inteiro, mínimo 10) → cidade (texto, linha inteira) → local (texto, linha inteira, **opcional**) → gastronomia (select, linha inteira, **opcional**). Os opcionais ficam agrupados no fim, antes do botão. Os pares ficam lado a lado a partir de 600 (auto-placement; nome, cidade, local e gastronomia têm `grid-column: 1 / -1`).

Todos obrigatórios, menos o local (sem `required`, dica "Opcional, se já estiver definido.", placeholder "Ex.: Clube Comercial Encantado"). No `utils/campos.js`, campo sem `required` e vazio é válido; preenchido segue as regras normais. O {local} vem dos atributos do input: preenchido, `data-frase` ("Local: {valor}."); vazio, `data-frase-vazia` ("O local ainda não está definido.").
- **Formato da gastronomia** (`select name="gastronomia"`, sem `required`, dica "Opcional, se já estiver definido."): 1ª opção `value=""` "Ainda não definido", `selected` e **não** `disabled` (dá para voltar a ela); Buffet · Volantes · Ilhas gastronômicas · Outro, com `data-frase` "buffet" / "volantes" / "ilhas gastronômicas" / "outro formato". O select tem `data-frase="Gastronomia: {valor}."` (o {valor} vem da `data-frase` da opção) e não tem `data-frase-vazia`: "Ainda não definido" vira "" e a frase some. O `montarMensagem` colapsa os espaços duplos que sobram. Vazio, fica em `--color-texto-3` como placeholder (`select:not([required]):has(option[value=""]:checked)`; os obrigatórios continuam com `:invalid`).

Cada campo tem `data-mensagem="{marcador}"`. As `<option>` do tipo também têm `data-mensagem` (a frase do tipo), por isso o JS pega os campos com `[data-mensagem]:not(option)`.

| servico | data-frase |
|---|---|
| Organização do evento | na organização do evento |
| Decoração | na decoração |
| Organização e decoração | na organização e na decoração |

**Nome e mensagem por tipo** (tudo nos atributos da `<option>`; o JS só lê): `data-rotulo-nome`, `data-exemplo-nome` (placeholder), `data-erro-nome` e `data-mensagem`. A opção "Escolha" traz o padrão (rótulo "Nome", sem placeholder, erro "Informe o nome."). No `change` do tipo (e na carga), o JS troca o `<label>`, o placeholder e o `data-erro` da dica; se o nome já está em erro, troca o texto na hora.

| tipo | rótulo · exemplo · erro | data-mensagem |
|---|---|---|
| Casamento | Nome dos noivos · Ex.: Ana e Pedro · Informe o nome dos noivos. | Olá, Rafael! Somos {nome} e vamos nos casar em {data}, com cerca de {convidados} convidados em {cidade}. {local} {gastronomia} Temos interesse {servico}. Podemos conversar? |
| Aniversário | Nome do aniversariante · Ex.: Marcos · Informe o nome do aniversariante. | Olá, Rafael! Estou planejando o aniversário de {nome} para {data}, com cerca de {convidados} convidados em {cidade}. {local} {gastronomia} Tenho interesse {servico}. Podemos conversar? |
| Formatura | Formando ou turma · Ex.: Medicina 2026 · Informe o formando ou a turma. | Olá, Rafael! Estou planejando a formatura de {nome} para {data}, com cerca de {convidados} convidados em {cidade}. {local} {gastronomia} Tenho interesse {servico}. Podemos conversar? |
| Infantil | Nome da criança · Ex.: Cecília · Informe o nome da criança. | Olá, Rafael! Estou planejando a festa infantil de {nome} para {data}, com cerca de {convidados} convidados em {cidade}. {local} {gastronomia} Tenho interesse {servico}. Podemos conversar? |
| Corporativo | Nome da empresa · Ex.: Rafael Fachini Decorações · Informe o nome da empresa. | Olá, Rafael! Sou da {nome} e estamos planejando um evento corporativo para {data}, com cerca de {convidados} pessoas em {cidade}. {local} {gastronomia} Temos interesse {servico}. Podemos conversar? |

`data-mensagem` do `<form>` (reserva, se a opção não tiver frase): "Olá, Rafael! Sou {nome} e estou planejando um evento para {data}, com cerca de {convidados} pessoas em {cidade}. {local} {gastronomia} Tenho interesse {servico}. Podemos conversar?" O "na" vem da `data-frase` do serviço ("Tenho interesse na decoração."); {data} vira "sábado, 05/12/2026".

### Depoimentos
- Categorias (select, `schema.sql` e `_comum.js` idênticos): Casamento, Aniversário, Formatura, Infantil, Corporativo, Outro.
- Limites: nome 2–60 · cidade 2–60 · texto 10–400.
- Supabase Free (com cron de keep-alive). Contas Supabase/Resend pendentes (perguntar na ETAPA 10).
- **Carrossel:** usa o componente (ver "Carrossel" abaixo), com o padrão dele. Card: `li.carrossel-item > figure.depoimento > blockquote + figcaption.metadado` ("nome · categoria · cidade"); hairline em cima; texto em `--font-titulo` 20 → 24px. **No plugin da ETAPA 10, gerar o `li` com `class="carrossel-item"` e o `figcaption` com `class="metadado"`.**
- **Formulário de envio** (front da 6.2): campos, dicas e erros usam as classes do `contato.css` (`.contato-campos`, `.contato-campo`, `.contato-ajuda`, `.contato-select`), como o `/portfolio/` usa o `portfolio.css`; o `depoimentos.css` só tem o textarea, o contador, o checkbox, a isca e os estados. A validação é a mesma do contato, em `utils/campos.js` (minlength/maxlength contados em code points, igual ao servidor; checkbox = marcado).
- **Demo — remover:**
  - [ ] ETAPA 9/10: os 3 cards de demo (comentário `DEMO: REMOVER NA ETAPA 9`) em `depoimentos/index.html`; o build injeta os aprovados no marcador `<!-- DEPOIMENTOS -->`.
  - [ ] ETAPA 11: o atributo `data-demo` do `.depoimentos-form` (comentário `DEMO: REMOVER data-demo NA ETAPA 11`). Com ele, o envio mostra o `.depoimentos-recebido` sem chamar `/api/depoimentos/`.

### Carrossel (componente: `.carrossel` em `componentes.css`, `iniciarCarrossel` em `utils/carrossel.js`)
- Usado em `/depoimentos/` e na Equipe. Estrutura: `.carrossel > ul.carrossel-trilho[tabindex=0][aria-label] > li.carrossel-item` + `.carrossel-controles > p.carrossel-indicador.metadado[aria-hidden] (<span data-atual> / <span data-total>) + .carrossel-setas > button.carrossel-seta[data-direcao="-1"|"1"]`.
- Padrão: trilho com scroll-snap que sangra até a borda (margem negativa do respiro); itens 85% → 2 por vez (600) → 3 por vez (900, gap 24px); controles embaixo (indicador à esquerda, setas 48×48 à direita). Os controles somem pelo CSS (`:has`) quando os cards cabem: 1 card / ≤2 em 600 / ≤3 em 900. O JS só liga as setas e o indicador (o arraste e o teclado são do scroll nativo).
- Cada seção muda só o que precisa no próprio CSS (camada `components`); para voltar ao padrão numa faixa maior, `revert-layer` (o componente está na camada `base`).

### Equipe (home, depois do manifesto)
- `.secao-topo` (rótulo "Equipe", h2 "Quem faz *acontecer.*", texto) + carrossel com 3 cards: `figure.equipe-membro > picture.equipe-foto (4:5) + figcaption (h3.equipe-nome + p.metadado.equipe-cargo + p.equipe-frase)`. Alts "Retrato de <nome>". Comentário `DEMO: CARGOS E FRASES A CONFIRMAR COM O CLIENTE`.
- Até 599: 1 card por vez (item 100%, gap = respiro, para o próximo não espiar). As setas (44×44, fundo 60% + blur, borda `--color-linha-forte`) ficam SOBRE a foto, numa camada absoluta 4:5 com `pointer-events: none` (o toque na foto chega ao trilho). O "1 / 3" fica na linha do nome, à direita (o nome tem `padding-right` para não encostar). 600–899: padrão do componente (2 por vez, controles embaixo). 900+: 3 lado a lado, controles somem.
- Fotos coloridas. Hover (só mouse) igual ao do portfólio: `scale(1.03)` na foto (a moldura tem `overflow: hidden`), 1.2s `cubic-bezier(0.22, 1, 0.36, 1)`; sem transição com movimento reduzido.
- Empurrãozinho na seta da direita (só até 599): `@keyframes equipe-empurrar` (0 → 8px → 0, 1.6s, 2 vezes). O `equipe.js` põe a classe `.equipe-empurrar` uma vez, quando o carrossel entra na tela (ScrollTrigger, `top 70%`, `once`); `pointerdown`, `keydown`, `wheel` ou scroll do trilho cancelam e impedem que comece depois. Desligado com movimento reduzido (o JS nem chega lá).
- `sizes` (moldura medida no Chrome; foto ~4:5, desenhada na largura da moldura): `(min-width: 1440px) 432px, (min-width: 900px) calc(33.34vw - 48px), (min-width: 600px) calc(50vw - 40px), calc(100vw - 40px)`.

### SEO
- Title da home: "Rafael Fachini Decorações · Decoração e organização de eventos no RS". Internas: "<Página> · Rafael Fachini Decorações".
- **SEO da demo** (nas 4 páginas, até a ETAPA 8): `description` (140–160 caracteres) + `robots` `noindex, nofollow` (comentário `DEMO: REMOVER NA ETAPA 8`; na 404 volta a só `noindex`). OG + Twitter nas 3 indexáveis (a 404 não tem), com URL absoluta `https://[URL_DEMO]/...`: trocar pela `.vercel.app` depois do 1º deploy e por `[DOMINIO]` na ETAPA 8. Canonical, JSON-LD, robots.txt e sitemap.xml só na ETAPA 8.
- JSON-LD `LocalBusiness`, `areaServed` = `{ "@type": "State", "name": "Rio Grande do Sul" }`, endereço com a cidade-base (pendente), `sameAs` com o Instagram (`https://www.instagram.com/rafaelfachinidecoracoes/`).

## Imagens (substitui o -500/-1000 da spec)
- Cada foto em 4 arquivos: `<nome>-800.webp`, `<nome>-1600.webp`, `<nome>-800.jpg`, `<nome>-1600.jpg`, em `/imagens/<secao>/`.
- `<picture>` com `<source type="image/webp" srcset="...-800.webp 800w, ...-1600.webp 1600w">` + `<img>` JPG com o mesmo srcset; `width`/`height` reais do arquivo -1600.
- `sizes` = largura real desenhada da foto em cada faixa do layout (até 599 / 600 / 900 / 1440+), considerando o respiro do `.envoltorio` (20 / 32 / 48px) e o gap do grid. Ex. (Serviços, 2 colunas em todas as larguras): `(min-width: 1440px) 648px, (min-width: 900px) calc(50vw - 72px), (min-width: 600px) calc(50vw - 48px), calc(83.34vw - 47px)` (até 599 a moldura é 4:5, de `50vw - 28px`, e a foto 4:3 em `cover` é desenhada 5/3 mais larga).
- Abaixo da dobra: `loading="lazy" decoding="async"`. Moldura fixa (`aspect-ratio`) + `object-fit: cover` + `object-position: var(--foco, 50% 50%)`.
- Placeholder: fundo do `<picture>`. Foto ausente ou quebrada: o `::after` do `img` (base.css) cobre o ícone e o alt com esse fundo.

### Mídias da demo (capturas de tela)
- Brutos em `_brutos/` (no `.gitignore`, fora do deploy). `rafa.png`, `camila.png` e `artur.png` viraram os retratos da Equipe.
- Hero: `/videos/hero.mp4` (450×754, H.264, CRF 26, sem áudio, faststart, ~3 MB) + poster `/imagens/hero/hero-poster.jpg` (frame de 1s).
- Fotos menores que 800px: só o arquivo `-800`, na largura real (srcset com o descritor real, ex. `380w`; `width`/`height` reais). Nunca ampliar.
- Recorte cover por moldura: Equipe 4:5 (rafael 623×779, camila 283×354, artur 610×763; rosto no terço superior); Serviços 4:3 (676×507); portfólio 3:4 (380×507), destaque 4:5 (406×507) e, na home a partir de 600px, 4:3 (676×507, `<nome>-43`; na `/portfolio/` também `aniversario-1-43`, `corporativo-1-43` e `casamento-2-43`). Um arquivo por recorte único: em `/portfolio/` cada tipo repete as fotos disponíveis apontando para os mesmos arquivos de `/imagens/portfolio/` (`casamento-1-34` = recorte 3:4 de `casamento1`).
- Ao trocar pelas mídias finais: gere -800/-1600 reais, volte o srcset de 2 entradas e use nome novo de arquivo (regra 11).

### Revisar quando as mídias chegarem
Toda seção nova com foto entra nesta lista (alt genérico ou arquivo ainda inexistente).
- [ ] Hero: `/videos/hero.mp4` e `/imagens/hero/hero-poster.jpg`.
- [ ] Serviços 01 (`/imagens/servicos/producao-*`): alt genérico "Organização de um evento realizado por Rafael Fachini".
- [ ] Serviços 02 (`/imagens/servicos/decoracao-*`): alt genérico "Decoração de um evento realizado por Rafael Fachini".
- [ ] Portfólio (home), 3 fotos em `/imagens/portfolio/` (`casamento-1`, `formatura-1`, `infantil-1`), cada uma em 2 recortes: retrato até 599 (destaque 4:5, dupla 3:4) e `-43` (4:3) a partir de 600. Alts genéricos por tipo ("Decoração de <tipo> realizada por Rafael Fachini"). Se as proporções mudarem, recalcule o `sizes`.
- [ ] og-image (`/imagens/compartilhamento/og-image.jpg`, 1200×630): recorte de `casamento1` (750×507, ampliado 1,24× para 630 de altura) + véu + wordmark + "Onde os sonhos ganham forma". Refazer com a foto final (nome novo de arquivo, regra 11).
- [ ] Favicon provisório (`/favicon-32.png`, `/apple-touch-icon.png` 180×180): monograma "RF" em Instrument Serif, branco sobre #0A0A0A. Trocar pelo logo real.
- [ ] Equipe, 3 retratos em `/imagens/equipe/` (`rafael`, `camila`, `artur`, só `-800` na largura real). O da Camila tem só 283px de largura (é desenhado a 335px em 375 e a 432px no desktop): trocar por foto maior. Confirmar com o cliente cargos, frases e o `[ANO]` ("Transforma ideias em atmosferas desde [ANO].").
- [ ] Página `/portfolio/`: os 10 eventos são **fictícios** (comentário `DEMO: EVENTOS FICTÍCIOS, TROCAR PELOS REAIS COM AUTORIZAÇÃO DOS CLIENTES`): trocar nomes, descrições e fichas pelos reais, **com autorização de cada cliente** para nome e fotos. As fotos repetem as do tipo (aniversário, formatura, infantil e corporativo têm 1 foto só, repetida 3 vezes por evento); cada evento real precisa de 3 fotos próprias (retrato 4:5 e 3:4 + recorte 4:3, com `-1600`: no desktop o destaque é desenhado a 917px e o `-43` da demo tem só 676). Alts "<evento>, foto N de 3".

### Páginas internas (/portfolio/, /depoimentos/, 404.html)
- Cabeçalho, menu mobile e rodapé são **cópias** dos da home: ao mudar um, mude nas 4 páginas.
- Diferenças nas internas: wordmark sem `data-topo` (link normal para `/`); sem o preload do poster.
- Página atual no menu: o item recebe `aria-current="page"` (em `/portfolio/`, o "Portfólio"; em `/depoimentos/`, o "Depoimentos"). Só no menu (desktop e mobile), não no rodapé. Estilo: sublinhado no desktop, itálico no menu mobile.
- O "Voltar ao topo ↑" do rodapé tem `href="#"` + `data-topo` em todas as páginas (com `#conteudo`, o handler de âncoras rolaria junto).
- Fundos: `.pagina-topo` em `fundo-base`, alternando até o rodapé (`fundo-superficie`).
- `/portfolio/`: abertura → faixa de filtro → `.portfolio-pagina` (um `section.portfolio-pagina-grupo` por tipo, `id` = tipo, **sem fundo nem padding**; h2 `visualmente-oculto` só para a hierarquia h1 → h2 → h3, porque o tipo atual já aparece no botão do filtro e no rótulo de cada evento) → chamada final. 2 eventos por tipo na demo.
- **Evento (`article.portfolio-evento`)**: faixa de largura total com `fundo-base`/`fundo-superficie` e padding 96 → 140px em 900 (igual ao `.secao`); o conteúdo vai em `.envoltorio.portfolio-evento-conteudo`, nesta ordem (mobile e desktop): `header.portfolio-evento-topo` (`.metadado.portfolio-evento-tipo`, só o tipo, em caixa alta pelo CSS + h3 28 → 40px com quem celebrou, `<em>` no "&") → `p.portfolio-evento-descricao` (contexto, 2–3 frases) → fotos → `dl.portfolio-evento-ficha` (Convidados · Local · Cidade · Serviço).
  - Mobile: tudo empilhado; ficha em linhas (`dt.metadado` à esquerda, `dd` à direita, hairline em cima de cada linha). 900+: topo em 2 colunas (tipo + título à esquerda; contexto à direita, `max-width: 52ch`, alinhados pela base), fotos e ficha em largura total; ficha em 1 linha de 4 colunas (dt em cima, dd embaixo, hairline só em cima da linha).
  - Espaços por margem (cada passagem tem o seu): título → contexto 16px (só no mobile); topo → fotos 40 → 56px; fotos → ficha 32 → 40px. Sem hairline entre eventos: a troca de fundo separa.
  - **Fundos pela ordem visível:** o 1º evento visível é **superfície** (a abertura é base) e os seguintes alternam; o HTML já vem alternado na ordem completa (a que aparece sem JS). A cada troca de filtro, o `alternarFundos` do JS refaz as classes dos eventos visíveis e põe na chamada final o tom contrário ao do último evento. Com contagem par (2 por tipo), o último é base e a chamada fica superfície, encostando no rodapé (também superfície): é o único par vizinho de mesmo tom, de propósito (a chamada funciona como antessala do rodapé). Placeholders: tom contrário ao da faixa, pela regra `.fundo-superficie .portfolio-foto` do `portfolio.css`.
  - Fotos: `ul.portfolio-grade.portfolio-evento-fotos` com o mesmo destaque + dupla da home (classes e CSS do `portfolio.css`, sem legenda), em largura total, com direção de arte: retrato até 599, recorte `-43` a partir de 600. `sizes` (medidos de 320 a 1920; no 900+ a moldura do destaque é ~1,27 e a foto 4:3 é desenhada mais larga). Destaque: retrato `calc(100vw - 40px)`; `-43` `(min-width: 1440px) 917px, (min-width: 900px) calc(66.67vw - 43px), calc(100vw - 64px)`. Dupla: retrato `calc(50vw - 26px)`; `-43` `(min-width: 1440px) 437px, (min-width: 900px) calc(33.34vw - 43px), calc(50vw - 44px)`.
  - Revelação por evento (`revelarEmSequencia` em topo, 3 fotos e texto); na troca de filtro, os eventos do grupo que apareceu entram de novo.
- **Filtro por tipo (`.portfolio-pagina-filtro`)**: faixa sticky em `top: var(--altura-cabecalho)` (z-index 10, abaixo do cabeçalho e do menu mobile), 68px (`--altura-filtro`); na página, `scroll-padding-top` = cabeçalho + faixa. **Parada:** transparente e sem hairline (integrada à abertura). **Presa** (`.portfolio-filtro-preso`, JS): fundo 85% + blur e hairline embaixo, transição de 0.6s como o `.cabecalho-rolado` (nenhuma com movimento reduzido). O JS observa um sentinela de 1px logo acima da faixa (`.portfolio-filtro-sentinela`, `IntersectionObserver` com `rootMargin` negativo = altura do cabeçalho, refeito quando ela muda em 900). Botão disclosure em pílula (40px, `aria-expanded`/`aria-controls`; ícone de 3 riscos de 14px que vira X como o do cabeçalho, 0.5s) com o tipo atual e a contagem. A lista é um **painel suspenso** ancorado no botão (os dois dentro de `.portfolio-filtro`, `position: relative`): 8px abaixo, alinhado à esquerda, `max-content` entre 200px e `100vw - 2 × respiro`; fundo superfície 92% + blur, borda `--color-texto` 12%, raio 12px, sombra; entra com opacity + translateY(-6px) + scale(0.98) em 0.4s. 5 `button[data-filtro][aria-pressed]` (Casamento, Aniversário, Formatura, Infantil, Corporativo; **sem "Todos"**) em `--font-texto` 15px, 44px de altura, raio 8px, contagem à direita; o ativo tem fundo `--color-texto` 8%, cor `--color-texto` e ✓ (SVG no HTML; o lugar fica reservado em todos para alinhar os nomes). Hover só mouse: fundo 5%. Anel de foco no botão e nos itens só com `html.usando-teclado` (como os campos do contato): com mouse o JS leva o foco ao item ativo e de volta ao botão sem anel; Esc também liga o `.usando-teclado` (`utils/teclado.js`), então fechar com Esc devolve o foco com anel. Nome, contagem (de **eventos**) e o texto do `aria-live` (`data-anuncio`, "Mostrando casamento, 2 eventos") ficam no HTML.
  - JS (`portfolio-pagina.js`, antes do `reduzirMovimento`): abre com foco no item ativo; fecha com Esc (foco volta ao botão), clique fora, foco saindo da faixa e ao escolher. Escolher: `aria-pressed`, rótulo e contagem do botão, `[hidden]` nos outros grupos, `alternarFundos`, anúncio, `history.replaceState` (`#tipo`; Casamento, o padrão, fica sem hash), `ScrollTrigger.refresh()` e `rolarPara` (`core/rolagem.js`) até o início da galeria (o `rolarPara` sincroniza o Lenis com o `scrollY` antes: ao esconder grupos, o scroll anchoring do navegador muda a posição e o destino sairia deslocado). Ao abrir: sem hash ou com hash inválido, Casamento (sem rolar); com `#tipo` válido, abre nele e corrige a rolagem do salto do navegador (imediata, pelo nativo). Com movimento, os eventos do grupo que apareceu entram de novo (`killTweensOf` + `revelarEmSequencia`).
  - Sem JS, todos os grupos aparecem (os `[hidden]` só entram pelo JS; o botão mostra "Casamento" e não faz nada).
- `/depoimentos/`: abertura (`fundo-base`) → `.depoimentos-pagina` (carrossel, `fundo-superficie`, entre `DEPOIMENTOS:INICIO`/`FIM`) → `.depoimentos-envio` (formulário, `fundo-base`) → rodapé. **Fora do sitemap até a ETAPA 9.** Ver "Depoimentos" acima.
- 404: no `vite preview`, caminho inexistente devolve a home (fallback do Vite); teste a 404 em `/404.html`. Na Vercel, a `404.html` é servida com status 404.

### Portfólio (home)
- 3 itens, "destaque + dupla": casamento-1 (destaque), formatura-1, infantil-1. Legenda só com o tipo. Abaixo da grade, `.portfolio-mais` com "Ver mais eventos →" (`/portfolio/`; largura total até 599). O `.secao-topo` não tem link.
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
