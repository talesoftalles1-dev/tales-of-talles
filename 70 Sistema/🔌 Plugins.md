---
dominio: jarvis
tipo: doc
status: publicado
categoria: sistema
criado: 2026-06-27
atualizado: 2026-06-27
tags:
  - tema/ia
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[🔁 Automacoes]]"
  - "[[⌨️ Atalhos e Hotkeys]]"
---

# 🔌 Plugins — Guia de Instalação e Configuração

> [!info] Para que serve este guia
> Documentação completa dos plugins da comunidade que fazem o JARVIS funcionar como um "software" dentro do Obsidian. Para **cada plugin**: por que foi escolhido e a **configuração recomendada passo a passo**. Siga a [[#Ordem de instalação]] de cima para baixo na primeira montagem.

> [!warning] Como instalar qualquer plugin da comunidade
> Todos os plugins abaixo são **plugins da comunidade** — não vêm com o Obsidian. Para instalar:
> 1. `Config (⚙️)` → **Plugins da comunidade** → desligue o **Modo restrito** (Restricted mode), se ativo.
> 2. Clique em **Procurar** (Browse) e busque pelo nome ou pelo **ID** entre parênteses.
> 3. **Instalar** → **Ativar** (Enable).
> 4. Volte às **Opções do plugin** para aplicar a configuração descrita aqui.
>
> Os IDs oficiais estão listados em [[#community-plugins recomendados]] para conferência.

---

## Ordem de instalação

Instale e configure nesta sequência — cada passo depende dos anteriores (templates antes de QuickAdd, Dataview antes do dashboard, etc.).

1. **Templater** — base de toda criação de notas.
2. **Dataview** — motor de todas as queries do sistema.
3. **Tasks** — gestão de tarefas com emoji.
4. **Calendar** — navegação temporal (pré-requisito visual do Periodic Notes).
5. **Periodic Notes** — daily/weekly automáticas.
6. **QuickAdd** — macros de captura rápida (usa os templates do Templater).
7. **Homepage** — abrir o dashboard ao iniciar.
8. **Iconize** — ícones de pasta (visual de software).
9. **Style Settings** — controles visuais do tema Minimal + `jarvis.css`.
10. **Linter** — higiene automática de frontmatter.
11. **Auto Note Mover** — mover notas do Inbox por propriedade/tag.
12. **Buttons** — botões de captura no dashboard.

> [!tip] Regra de ouro
> Instale **um plugin por vez**, configure, reinicie o Obsidian e só então passe ao próximo. Assim, se algo quebrar, você sabe a causa.

---

## 1. Templater (`templater-obsidian`)

**Por que foi escolhido:** motor de templates muito mais poderoso que o core "Templates" — executa data dinâmica, prompts interativos, posiciona o cursor e dispara templates ao criar notas. É a base de todo o fluxo de criação do JARVIS.

**Configuração recomendada (passo a passo):**
1. Opções do Templater → **Template folder location**: defina `70 Sistema/Templates`.
2. Em **General** → ative **Trigger Templater on new file creation**. Isso faz com que toda nota nova criada via QuickAdd/Periodic Notes já passe pelo Templater.
3. Em **Folder Templates** (opcional, recomendado): mapeie pastas a templates padrão, ex.:
   - `10 Inbox` → `70 Sistema/Templates/T - Captura Inbox`
   - `30 Empresa/Reunioes` → `70 Sistema/Templates/T - Reuniao`
4. **Hotkey de inserir template:** `Config → Atalhos (Hotkeys)` → busque **Templater: Open insert template modal** → atribua `Ctrl + T` (ver [[⌨️ Atalhos e Hotkeys]]).
5. Em **User System Functions** → mantenha **Enable System Commands** ligado apenas se for usar `tp.system.*` (usamos `tp.system.prompt` em alguns templates).

> [!example] Sintaxe usada nos templates
> `<% tp.date.now("YYYY-MM-DD") %>` · `<% tp.file.title %>` · `<% tp.system.prompt("Pergunta") %>` · `<% tp.file.cursor() %>` · data a partir do título: `<% tp.date.now("YYYY-MM-DD", 0, tp.file.title, "YYYY-MM-DD") %>`

---

## 2. Dataview (`dataview`)

**Por que foi escolhido:** transforma o frontmatter em banco de dados consultável. É o que torna real o princípio do JARVIS — "propriedades são a fonte da verdade". Todos os dashboards e MOCs dependem dele.

**Configuração recomendada (passo a passo):**
1. Opções do Dataview → **Enable JavaScript Queries**: **ligado** (necessário para `dataviewjs`, usado em visões mais ricas do dashboard).
2. **Enable Inline Queries**: **ligado** (permite `= this.progresso` no meio do texto).
3. **Enable Inline JavaScript Queries**: ligado (opcional, para cálculos inline).
4. **Date format** → `yyyy-MM-dd` para casar com o padrão de datas do sistema.
5. **Automatic View Refresh**: ligado, para os dashboards atualizarem sozinhos.

> [!example] Toda query filtra por propriedade, nunca por pasta
> ```dataview
> TABLE status, prioridade, prazo, progresso AS "%"
> WHERE tipo = "projeto" AND status = "ativo"
> SORT prioridade ASC, prazo ASC
> ```

---

## 3. Tasks (`obsidian-tasks-plugin`)

**Por que foi escolhido:** gestão de tarefas com vencimento, prioridade e recorrência diretamente em qualquer nota, agregadas no dashboard. Usa o formato emoji oficial, que é portável e legível.

**Configuração recomendada (passo a passo):**
1. Opções do Tasks → **Task Format**: selecione **Tasks Emoji Format** (formato global por emoji — `📅 ⏳ 🛫 🔺⏫🔼🔽 🔁 ✅`).
2. **Global Task Filter**: **deixe VAZIO** (sem filtro global). 

> [!tip] Por que SEM global filter
> Um filtro global (ex.: exigir `#task` em toda tarefa) força você a marcar cada item, polui as tags e quebra a [taxonomia](#) que reserva tags só para temas. Sem filtro, **qualquer** `- [ ]` na vault é uma tarefa — mais simples e alinhado ao spec. Só adote `#task` se um dia precisar separar tarefas de checklists de processo; por ora, **não**.

3. **Set Done Date on every completed task**: ligado (gera o `✅ YYYY-MM-DD`).
4. **Auto-suggest** (Enable task auto-suggest): ligado — sugere emojis ao digitar `📅`, `due`, etc.
5. **Recurring tasks** → mantenha "Next recurrence appears above/below" conforme preferência (padrão "below").

> [!example] Formato de tarefa
> `- [ ] Enviar proposta para o cliente 🔼 📅 2026-06-30`

---

## 4. Calendar (`calendar`)

**Por que foi escolhido:** mini-calendário na barra lateral para navegar e criar notas diárias/semanais com um clique. Complementa o Periodic Notes visualmente.

**Configuração recomendada (passo a passo):**
1. Opções do Calendar → **Start week on**: `Monday` (segunda-feira).
2. **Words per dot** / **Show week number**: ative **Show week number** (mostra o número da semana — útil com as notas semanais `gggg-[W]ww`).
3. O Calendar **lê as configurações do Periodic Notes** para saber onde criar as notas — configure o Periodic Notes (passo 5) e o Calendar respeita os mesmos caminhos e templates automaticamente.
4. Clique no número da semana → cria/abre a **nota semanal**; clique no dia → cria/abre a **daily**.

---

## 5. Periodic Notes (`periodic-notes`)

**Por que foi escolhido:** automatiza a criação das notas de **Diário** (daily) e **Semanal** (weekly) com pasta, formato de nome e template corretos — base da rotina de revisão.

**Configuração recomendada (passo a passo):**

**Daily Notes:**
1. Ative **Daily Notes** dentro do Periodic Notes.
2. **Format**: `YYYY-MM-DD`
3. **Folder**: `20 Pessoal/Diario`
4. **Template**: `70 Sistema/Templates/T - Daily Note`

**Weekly Notes:**
1. Ative **Weekly Notes**.
2. **Format**: `gggg-[W]ww` (ex.: `2026-W26` — `gggg` é o ano ISO da semana, `ww` o número da semana).
3. **Folder**: `20 Pessoal/Diario`
4. **Template**: `70 Sistema/Templates/T - Weekly Note`

> [!warning] Use o core "Daily notes" DESLIGADO
> Se o plugin core **Daily notes** estiver ativo, desligue-o em `Config → Plugins principais` para evitar conflito — o Periodic Notes assume essa função com formato e pasta corretos.

5. **Hotkey** (opcional): `Config → Atalhos` → **Periodic Notes: Open daily note** → `Ctrl + D` (ver [[⌨️ Atalhos e Hotkeys]]).

---

## 6. QuickAdd (`quickadd`)

**Por que foi escolhido:** cria **macros de captura** — capturar uma ideia, lançar uma despesa, abrir um cliente novo — com um único atalho e prompts guiados. É o "botão de ação" do sistema.

**Configuração recomendada (passo a passo):**
1. Opções do QuickAdd → adicione *Choices* do tipo **Capture**, **Template** ou **Macro** conforme cada fluxo.
2. Marque cada choice com a estrelinha ⭐ (**Add to Command palette / ribbon**) para ganhar comando e ícone na barra lateral.
3. Aponte os choices do tipo *Template* para os arquivos em `70 Sistema/Templates`.
4. Atribua atalhos aos comandos gerados (ex.: **QuickAdd: Captura rápida** → `Ctrl + Shift + C`, ver [[⌨️ Atalhos e Hotkeys]]).

> [!note] A configuração detalhada das macros vive na automação
> As macros completas de captura (campos, prompts, destino, formato) estão documentadas e mantidas em [[🔁 Automacoes]]. Este guia cobre apenas a instalação e os ajustes globais do plugin.

---

## 7. Homepage (`homepage`)

**Por que foi escolhido:** abre o dashboard do JARVIS automaticamente ao iniciar o app, dando a sensação de "abrir um software", não um editor de texto.

**Configuração recomendada (passo a passo):**
1. Opções do Homepage → **Homepage**: defina `00 JARVIS/🤖 JARVIS`.
2. **Open on startup**: **ligado** (abre o dashboard toda vez que o Obsidian inicia).
3. **Open mode / When opening normally**: configure para abrir em **nova aba** (Open in new tab) — assim a home fica sempre acessível sem sobrescrever a aba atual.
4. **Open on mobile**: ligue também, se usar o Obsidian no celular.
5. **Hotkey**: associe **Homepage: Open homepage** a `Ctrl + J` (atalho-marca do JARVIS, ver [[⌨️ Atalhos e Hotkeys]]).

---

## 8. Iconize (`obsidian-icon-folder`)

**Por que foi escolhido:** adiciona ícones às pastas e notas, dando ao explorador o visual de painel de um software. Reforça a leitura rápida da estrutura numerada.

**Configuração recomendada (passo a passo):**
1. Instale e ative. Em **Iconize → Icon Packs**, baixe um pacote (recomendado: **Lucide** ou **Remix Icons**).
2. Clique com o botão direito numa pasta → **Change icon** → escolha o ícone.

> [!example] Sugestão de ícones por pasta
> | Pasta | Ícone sugerido |
> |---|---|
> | `00 JARVIS` | 🤖 robô / `bot` |
> | `10 Inbox` | 📥 `inbox` |
> | `20 Pessoal` | 🌱 `user` / `leaf` |
> | `30 Empresa` | 🏢 `building` |
> | `40 CRM` | 🤝 `handshake` / `contact` |
> | `50 Financeiro` | 💰 `wallet` / `dollar-sign` |
> | `60 Conhecimento` | 📚 `book-open` / `brain` |
> | `70 Sistema` | ⚙️ `settings` / `cog` |
> | `90 Arquivo` | 🗄️ `archive` |

3. Opcional: ative **Toggle icon in tabs** e **icons before file name** para o visual aparecer também nas abas.

---

## 9. Style Settings (`obsidian-style-settings`)

**Por que foi escolhido:** expõe controles visuais (cores, fontes, espaçamento) do tema **Minimal** e do snippet `jarvis.css` numa interface, sem precisar editar CSS na mão. É como aplicamos as cores da marca JARVIS.

**Configuração recomendada (passo a passo):**
1. Garanta o tema **Minimal** (kepano) ativo em `Config → Aparência → Tema`.
2. Ative o snippet `jarvis.css` em `Config → Aparência → Snippets de CSS` (botão de recarregar se acabou de adicionar o arquivo na pasta `.obsidian/snippets`).
3. Abra **Config → Style Settings** e ajuste as variáveis de cor para a paleta da marca:
   - Fundo `#0B0E14` / superfície `#11151F`
   - Accent (ciano JARVIS) `#22D3EE`
   - Secundário (âmbar) `#F5A524`
   - Texto `#E6EDF3` / texto suave `#8B98A9`
4. Salve. As mudanças são instantâneas e ficam guardadas no vault.

---

## 10. Linter (`obsidian-linter`)

**Por que foi escolhido:** mantém o frontmatter limpo e consistente automaticamente — ordena propriedades, normaliza datas e atualiza o campo `atualizado` no save. Garante que as queries Dataview nunca quebrem por inconsistência de formato.

**Configuração recomendada (passo a passo):**
1. Opções do Linter → **YAML** → ative **Format YAML Array** e **YAML Key Sort** com a ordem das propriedades base:
   `tipo, status, area, criado, atualizado, tags` (mantendo as específicas do tipo logo em seguida).
2. Ative **Insert YAML attributes** se quiser que o Linter garanta a presença das chaves base.
3. **Yaml Timestamp** → configure:
   - **Date Created** → chave `criado`, formato `YYYY-MM-DD`.
   - **Date Modified** → chave `atualizado`, formato `YYYY-MM-DD`, atualizado **a cada modificação**.
4. **Format → Date** → padrão de data `YYYY-MM-DD` em todo o documento.
5. Em **General** → ative **Lint on save** (rodar o Linter ao salvar) e, se preferir automação total, **Lint on file change**.

> [!warning] Cuidado com o "Date Modified"
> Como o Linter atualiza `atualizado` no save, evite "Lint on save" enquanto edita templates (`70 Sistema/Templates`) — adicione essa pasta a **Folders to ignore** para não sujar os arquivos `<% ... %>`.

---

## 11. Auto Note Mover (`obsidian-auto-note-mover`)

**Por que foi escolhido:** move automaticamente as notas do `10 Inbox` para a pasta de armazenamento correta com base em **tag** ou **propriedade** — mantém o Inbox vazio sem trabalho manual. Como as queries filtram por propriedade, mover a nota nunca quebra nada.

**Configuração recomendada (passo a passo):**
1. Opções do Auto Note Mover → **Trigger**: `Automatic` (move ao salvar) ou `Manual` via comando, conforme preferência. Recomendado começar em **Manual** e migrar para automático com confiança.
2. Adicione regras em **Add new rule**. Cada regra tem: pasta de destino + critério (tag ou propriedade) + valor.

> [!example] Regras por TAG (#tema) — para notas de conhecimento
> | Destino | Tag |
> |---|---|
> | `60 Conhecimento/Notas` | `#tema/ia` |
> | `60 Conhecimento/Notas` | `#tema/dev` |
> | `50 Financeiro/Pessoal` | `#tema/financas` |

> [!example] Regras por PROPRIEDADE (`tipo:`) — o método preferido
> Use o critério de **frontmatter / property** quando disponível na sua versão:
> | Destino | Propriedade | Valor |
> |---|---|---|
> | `20 Pessoal/Ideias` | `tipo` | `ideia` |
> | `30 Empresa/Reunioes` | `tipo` | `reuniao` |
> | `40 CRM/Clientes` | `tipo` | `cliente` |
> | `60 Conhecimento/IA/Prompts` | `tipo` | `prompt` |

3. **Excluded folder**: adicione `90 Arquivo` e `70 Sistema/Templates` para nunca serem movidos.
4. Teste com uma nota de captura no Inbox antes de ligar o modo automático.

> [!tip] Alinhado ao princípio do sistema
> Preferir regras por **propriedade** (`tipo`) a regras por tag mantém o Inbox 100% automatizável usando exatamente os mesmos campos que os dashboards consultam.

---

## 12. Buttons (`buttons`)

**Por que foi escolhido:** cria botões clicáveis dentro das notas (dashboard) que disparam comandos do QuickAdd, abrem templates ou rodam macros — transforma o `🤖 JARVIS` num painel de ações de verdade.

**Configuração recomendada (passo a passo):**
1. Instale e ative. Os botões são definidos em blocos ` ```button ` dentro da nota.
2. No dashboard, crie botões que chamam os comandos do QuickAdd (tipo `command`).

> [!example] Botão de captura no dashboard
> ````
> ```button
> name 📥 Capturar Ideia
> type command
> action QuickAdd: Captura rápida
> color blue
> ```
> ````

3. Use `color blue` (ciano da marca) para ações primárias e `color yellow` (âmbar) para ações secundárias, mantendo a identidade visual.
4. Os botões de captura completos do dashboard são montados junto com as macros — ver [[🔁 Automacoes]].

---

## community-plugins recomendados

Lista de conferência (nome → **ID** para busca em `Config → Plugins da comunidade → Procurar`):

| Plugin | ID |
|---|---|
| Templater | `templater-obsidian` |
| Dataview | `dataview` |
| Tasks | `obsidian-tasks-plugin` |
| QuickAdd | `quickadd` |
| Calendar | `calendar` |
| Periodic Notes | `periodic-notes` |
| Homepage | `homepage` |
| Style Settings | `obsidian-style-settings` |
| Iconize | `obsidian-icon-folder` |
| Linter | `obsidian-linter` |
| Auto Note Mover | `obsidian-auto-note-mover` |
| Buttons | `buttons` |

> [!note] Tema (não é plugin da comunidade)
> O tema **Minimal** (kepano) é instalado em `Config → Aparência → Tema → Gerenciar → Procurar`, e o snippet `jarvis.css` vai em `.obsidian/snippets/`. Os controles aparecem no Style Settings (plugin nº 9).

---

> [!success] Pronto
> Com os 12 plugins instalados na [[#Ordem de instalação|ordem indicada]] e configurados, o JARVIS abre no dashboard, captura por atalho, organiza o Inbox sozinho e mantém o frontmatter impecável. Próximo passo: revisar os [[⌨️ Atalhos e Hotkeys]].
