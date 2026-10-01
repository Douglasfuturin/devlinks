# Links para a bio do Instagram

Páginas estáticas no visual do DevLinks, uma para cada perfil. Não tem backend nem banco: o conteúdo mora em arquivos JSON e o `build.js` gera o HTML.

| URL | Arquivo | Para que serve |
| --- | --- | --- |
| [/](./) | `site.json` → `vercelRoot` | Página da Marina (`/espanhol/`), na raiz da Vercel e do GitHub Pages |
| [/perfis/](./perfis/) | `site.json` | Lista dos perfis |
| [/douglasdev/](./douglasdev/) | `profiles/douglasdev.json` | Bio de [@o.douglas.dev](https://instagram.com/o.douglas.dev): IA e automação |
| [/espanhol/](./espanhol/) | `profiles/espanhol.json` | A mesma página da raiz: [Espanhol do Brasileiro](https://www.instagram.com/espanhol.do.brasileiro/) (@espanhol.do.brasileiro), com a professora Marina Duarte |

## Editar um link

Abra o JSON do perfil. Cada item tem:

- `title`, `description`, `url`
- `icon`: emoji, ou um destes nomes para a fileira de redes: `logo-instagram`, `logo-linkedin`, `logo-github`, `logo-youtube`, `logo-tiktok`, `logo-whatsapp`. São os ícones do Ionicons (os mesmos do DevLinks), gravados na página, sem carregar script externo
- `badge`: selo opcional, como `R$47` ou `GRÁTIS`. Deixe `""` para não mostrar
- `highlight`: `true` deixa a borda do botão na cor de destaque do perfil
- `enabled`: `false` tira o link da página sem apagar o bloco
- `utm`: `false` não adiciona UTM. O padrão é adicionar em links `http` e `https`
- `todo`: lembrete seu. Não aparece no site

`layout` da seção: `list` (botões) ou `social` (ícones no rodapé, como no DevLinks). Seção com todos os links desligados some da página.

Quando a URL ainda não existe, use `"url": "#"` e explique no `todo`.

Depois de salvar:

```bash
node build.js
```

O comando regrava `index.html`, `douglasdev/index.html`, `espanhol/index.html`, `sitemap.xml` e `robots.txt`. Não edite esses HTML na mão.

## Criar um perfil

1. Copie `profiles/douglasdev.json` para `profiles/nome.json`.
2. O `id` tem que ser igual ao nome do arquivo (`nome`), em minúsculas.
3. Preencha nome, arroba, bio, avatar, `theme` e as seções.
4. Rode `node build.js`.

A página fica em `/nome/`. Apagar o JSON e rodar o build de novo remove a pasta gerada.

O `utm_campaign` é sempre o `id` do perfil.

## Cores

O objeto `theme` troca as variáveis do DevLinks naquele perfil: texto, borda, fundo do botão, hover e as cores do selo (`accent` e `accentText`). O bloco `light` vale quando o interruptor está no tema claro.

O fundo com foto roxa/cinza continua o do DevLinks, compartilhado. O `/douglasdev/` usa o tema clássico (branco) em cima da foto roxa. O `/espanhol/` usa a paleta da marca: azul-marinho `#031228`, verde `#037b27`, amarelo `#fdba01` e vermelho da Espanha `#dd1014`. O destaque do topo, o favicon, o ícone da tela inicial e a imagem de preview são `assets/espanhol/marina-duarte-logo.webp`.

Avatar: caminho em `profile.avatar`, a partir da raiz do site (`assets/avatars/douglas.svg`). Pode ser SVG, PNG ou JPG. `avatarAlt` é o texto alternativo.

## Vercel (marina-duarte.vercel.app)

O projeto `marina-duarte` na Vercel publica este repositório sem build. A Vercel entrega um arquivo estático antes de aplicar rewrite, então um rewrite de `/` para `/espanhol/` nunca roda enquanto existir `index.html`. O `node build.js` grava a página do perfil em `site.json` → `vercelRoot` (hoje `espanhol`) direto em `index.html`, com caminhos `./`. Assim https://marina-duarte.vercel.app abre a página da Marina, e o mesmo arquivo também funciona na raiz de um GitHub Pages de projeto (`/devlinks/`). `/espanhol/` continua a mesma página, com caminhos `../`. `/douglasdev/` e a lista em `/perfis/` seguem no ar nos dois hosts.

No `/espanhol/` e na raiz, `seo.canonical` aponta canonical e `og:url` para a Vercel. O `og:image` é a marca nova, em `https://marina-duarte.vercel.app/assets/espanhol/marina-duarte-logo.webp`. O título grande fica só para leitores de tela, porque a imagem já traz o nome.

## UTM

Em todo link `http`/`https` com `utm` diferente de `false`, o build acrescenta:

`utm_source=instagram&utm_medium=bio&utm_campaign=<id-do-perfil>`

Origem e mídia saem do objeto `utm` do perfil. Se a URL já tiver um desses parâmetros, ele é mantido. Links `#`, `mailto:` e `tel:` não recebem UTM.

## Cliques (opcional, desligado)

Dá para medir o clique sem obrigar ninguém a aceitar cookie.

1. **Sem script.** O UTM já chega na Lastlink, no Vercel Analytics do destino, ou em qualquer ferramenta que leia a URL. É o caminho que funciona nos dois deploys.
2. **Vercel Web Analytics** (grátis no plano Hobby, sem cookie). No projeto da Vercel, ative Web Analytics. Em `site.json`, mude `analytics` para `"enabled": true` e `"vercel": true`. Rode `node build.js` e faça deploy. Cada clique manda o evento `link_click` com `profile` (ex.: `espanhol`) e `link` (ex.: `flashcards`). O script `/_vercel/insights/script.js` só existe na Vercel; por isso ele fica de fora enquanto `vercel` for `false`.
3. **Plausible.** Se você tiver um domínio no Plausible (ou numa instância sua), preencha `plausibleDomain` e ligue `enabled`. O mesmo evento `link_click` é enviado.

## SEO e preview

Cada página tem título, descrição, canonical, Open Graph e Twitter Card em pt-BR, mais JSON-LD. A imagem de preview é `assets/og-home.png`, `assets/og-douglasdev.png` e `assets/og-espanhol.png`.

`site.json` → `siteUrl` precisa ser a URL pública, sem barra no final. O padrão é o GitHub Pages do repositório. Se o endereço oficial for o da Vercel ou um domínio próprio, troque o `siteUrl` e rode o build de novo, senão o preview aponta para o lugar errado.

Para refazer as imagens depois de mudar nome ou marca:

```bash
python3 scripts/og-images.py
node build.js
```

O script usa Pillow e a fonte Inter.

## Rodar na máquina

```bash
node build.js
python3 -m http.server 4173
```

Abra `http://localhost:4173/`, `http://localhost:4173/espanhol/`, `http://localhost:4173/douglasdev/` e `http://localhost:4173/perfis/`.

## GitHub Pages

O repositório não tinha um workflow de Pages: o deploy é o modo estático, pela branch. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta **/ (root)**.

A URL fica `https://douglasfuturin.github.io/devlinks/`. A raiz mostra a mesma página da Marina, com caminhos `./`, então o subcaminho `/devlinks/` acha o CSS e as imagens. `/douglasdev/` e `/perfis/` continuam nesse endereço. O arquivo `.nojekyll` impede o Jekyll de filtrar JSON e pastas.

## Vercel

Importe o repositório. Framework **Other**, sem comando de build, diretório de saída na raiz. O `index.html` da raiz já é a página da Marina; não precisa de comando de build nem de rewrite. O `vercel.json` só liga a barra no final da URL e alguns cabeçalhos. Não crie projeto Node: não existe `package.json` de propósito.

Se a URL da Vercel for a oficial, atualize `siteUrl` e rode o build antes do push.

## Pendências de URL

Os quatro cursos de `/espanhol/` já apontam para a Lastlink, com UTM do perfil: Kit Sobrevivência (R$19,90), Flashcards (R$47), Fluência na Prática (R$97) e Morar e Trabalhar na Espanha (R$197, bônus Professor de Espanhol).

O grupo gratuito do WhatsApp é o primeiro botão de `/espanhol/`: [Grupo de Networking de Imigrantes na Espanha](https://chat.whatsapp.com/DasExwyjLjNJAdKjoMYYUb).

Ainda falta, e nada disso aparece na página. O `node build.js` lista de novo:

- Curso de importação de chuteiras (`/douglasdev/`)

## Crédito

O visual (fundo, interruptor de tema, cartões e fileira de ícones) vem do [DevLinks da Rocketseat](https://github.com/rocketseat-education/devlinks), projeto em MIT. O conteúdo e os perfis são do Douglas Ribeiro dos Santos.
