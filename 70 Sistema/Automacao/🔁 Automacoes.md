---
dominio: jarvis
tipo: doc
status: publicado
area: empresa
categoria: sistema
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[🔌 Plugins]]"
  - "[[🤖 JARVIS]]"
  - "[[💰 Financeiro]]"
tags:
  - tema/ia
---

# 🔁 Automações do JARVIS

> [!info] O que é este guia
> Catálogo **acionável** das automações que sustentam o JARVIS. Para cada fluxo: o **objetivo**, o **plugin** que o executa e a **configuração concreta** (passos + snippets reais para copiar). A regra de ouro continua valendo — automações escrevem **propriedades corretas**; as queries leem propriedades, nunca caminhos de pasta.

> [!tip] Como usar
> 1. Tenha os plugins de [[🔌 Plugins]] instalados e ativos.
> 2. Configure cada automação na ordem abaixo (Captura → Criação → Organização → Manutenção).
> 3. Os botões do Dashboard (última seção) só funcionam **depois** que os comandos QuickAdd existirem — o nome do botão referencia o nome exato do _choice_.

## Mapa rápido

| # | Automação | Plugin | Gatilho |
|---|---|---|---|
| 1 | Captura de ideias/tarefas | QuickAdd (Capture) | Atalho / Botão / Command palette |
| 2 | Novo projeto | QuickAdd (Macro → Template) | Botão / Atalho |
| 3 | Novo cliente | QuickAdd (Macro → Template) | Botão / Atalho |
| 4 | Nova reunião | QuickAdd (Macro → Template) | Botão / Atalho |
| 5 | Novo lançamento | QuickAdd (Macro → Capture) | Botão / Atalho |
| 6 | Resumo de reunião | Fluxo manual + LLM (Claude) | Dentro da nota |
| 7 | Organização de documentos | Auto Note Mover | Ao salvar / on-demand |
| 8 | Registro de estudos | QuickAdd (Template + Capture) | Botão / Atalho |
| 9 | Manutenção (YAML, revisão, Wiki) | Linter + Periodic Notes | Ao salvar / semanal |
| 10 | **Morning Brief → Slack #daily** | `morning-brief/generate.mjs` | Task Scheduler 09:00 |

> [!success] Morning Brief (Path 2)
> Pipeline local em `70 Sistema/Automacao/morning-brief/`. Ver [[_Morning Brief — Spec]] e [[_Morning Brief — Runbook]].

---

## 1. Captura de ideias e tarefas — QuickAdd `Capture`

> [!abstract] Objetivo
> Tirar qualquer pensamento da cabeça em **2 segundos**, sem decidir onde guardar. A nota nasce no `10 Inbox/` com a tag `#captura` (sinal de "processar depois") — ou, para tarefas soltas, vai como _append_ no dashboard [[🤖 JARVIS]]. O Dashboard mostra tudo que tem `#captura` para triagem.

**Plugin:** QuickAdd → tipo de choice **Capture**.

### 1a. Capturar ideia/nota → nova nota no Inbox

Passos (Configurações → QuickAdd → _Add Choice_ → nome `Capturar`, tipo **Capture** → ⚙️):

- **Capture To:** `10 Inbox/{{VALUE:titulo}}.md`
- **Create file if it doesn't exist:** ✅ (e marque _Create the file with the below template_ se quiser frontmatter)
- **Task:** ❌ (é nota, não tarefa)
- **Format:** ✅ ative _Capture format_ e cole:

```text
---
tipo: nota
status: rascunho
criado: {{DATE:YYYY-MM-DD}}
atualizado: {{DATE:YYYY-MM-DD}}
tags:
  - captura
---

# {{VALUE:titulo}}

{{VALUE:conteudo}}

> Capturado em {{DATE:YYYY-MM-DD HH:mm}} via QuickAdd.
```

Config equivalente (referência de campos do choice — _exporte/cole no `data.json` do QuickAdd_):

```json
{
  "name": "Capturar",
  "type": "Capture",
  "command": true,
  "captureTo": "10 Inbox/{{VALUE:titulo}}.md",
  "captureToActiveFile": false,
  "createFileIfItDoesntExist": {
    "enabled": true,
    "createWithTemplate": false,
    "template": ""
  },
  "format": {
    "enabled": true,
    "format": "---\ntipo: nota\nstatus: rascunho\ncriado: {{DATE:YYYY-MM-DD}}\natualizado: {{DATE:YYYY-MM-DD}}\ntags:\n  - captura\n---\n\n# {{VALUE:titulo}}\n\n{{VALUE:conteudo}}\n"
  },
  "prepend": false,
  "appendLink": false,
  "task": false,
  "openFile": false
}
```

> [!note] `{{VALUE:nome}}`
> Cada `{{VALUE:titulo}}` / `{{VALUE:conteudo}}` distinto abre **um prompt**. Reutilizar o mesmo nome reaproveita o valor digitado. Use `{{VALUE}}` simples para um prompt único.

### 1b. Capturar tarefa rápida → _append_ no Dashboard

Para jogar uma tarefa solta direto no [[🤖 JARVIS]] (que o plugin Tasks agrega):

- **Capture To:** `00 JARVIS/🤖 JARVIS.md`
- **Insert after:** ative e aponte para a linha `## 📥 Capturas rápidas` (ancora a inserção sob esse heading)
- **Task:** ✅ (formata como item `- [ ]`)
- **Format:**

```text
- [ ] {{VALUE:tarefa}} 🔼 📅 {{VDATE:vencimento,YYYY-MM-DD}} #captura
```

```json
{
  "name": "Capturar tarefa",
  "type": "Capture",
  "command": true,
  "captureTo": "00 JARVIS/🤖 JARVIS.md",
  "task": true,
  "insertAfter": {
    "enabled": true,
    "after": "## 📥 Capturas rápidas",
    "insertAtEnd": false,
    "considerSubsections": false
  },
  "format": {
    "enabled": true,
    "format": "- [ ] {{VALUE:tarefa}} 🔼 📅 {{VDATE:vencimento,YYYY-MM-DD}} #captura"
  }
}
```

> [!tip] `{{VDATE:nome,formato}}` aceita linguagem natural ("amanhã", "sexta", "em 3 dias") e converte para a data — ótimo para vencimento de tarefa.

---

## 2. Criar projeto — QuickAdd Macro → Template (`T - Projeto`)

> [!abstract] Objetivo
> Criar um projeto já com **frontmatter completo**, na pasta certa **por área** (`20 Pessoal/Projetos/` ou `30 Empresa/Projetos/`), com nome perguntado no momento. Zero arrastar arquivo, zero esquecer propriedade.

**Plugin:** QuickAdd → choice tipo **Macro**, que dispara o template Templater `T - Projeto`.

Passos:

1. **Configurações → QuickAdd → _Add Choice_** → nome `Novo Projeto` → tipo **Macro** → ⚙️ _Configure_.
2. No editor da macro, **Add → Template Choice** (ou _User Scripts_ se quiser lógica). Configure o _Template_:
   - **Template Path:** `70 Sistema/Templates/T - Projeto.md`
   - **File Name Format:** ✅ → `{{VALUE:nome}}` (nome do projeto perguntado)
   - **Folder:** ✅ _Choose folder when creating a new note_ ou fixe via prompt do template (recomendado: o template decide a pasta pela `area`).
   - **Open the file:** ✅ · **New tab:** opcional.
3. Marque o choice como **command** (ícone de raio) para aparecer na _Command palette_ e poder virar botão/atalho.

A **escolha da pasta por área** mora dentro do `T - Projeto` (Templater), mantendo o QuickAdd simples:

```javascript
<%*
// T - Projeto — decide a pasta de destino pela área escolhida
const area = await tp.system.suggester(["pessoal","empresa"], ["pessoal","empresa"], false, "Área do projeto?");
const destino = area === "empresa" ? "30 Empresa/Projetos" : "20 Pessoal/Projetos";
await tp.file.move(`${destino}/${tp.file.title}`);
const prioridade = await tp.system.suggester(["alta","media","baixa"], ["alta","media","baixa"], false, "Prioridade?");
const prazo = await tp.system.prompt("Prazo (YYYY-MM-DD ou vazio)");
-%>
---
tipo: projeto
status: ativo
area: <% area %>
prioridade: <% prioridade %>
inicio: <% tp.date.now("YYYY-MM-DD") %>
prazo: <% prazo %>
progresso: 0
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags: []
---

# <% tp.file.title %>

## 🎯 Objetivo
<% tp.file.cursor() %>

## ✅ Tarefas
- [ ] Definir primeiro passo 🔼

## 🧭 Decisões
## 📌 Notas
```

> [!warning] Pasta é só armazenamento
> A pasta é definida por conveniência; o que faz o projeto aparecer no Dashboard é `tipo: projeto` + `status: ativo`. Mover a pasta depois **não quebra** nada.

---

## 3. Criar cliente — QuickAdd Macro → Template (`T - Cliente`)

> [!abstract] Objetivo
> Novo cliente em `40 CRM/Clientes/` com status de funil e dados de contato, pronto para entrar nas queries do CRM e no campo `proximo_contato`.

**Plugin:** QuickAdd Macro → Template, igual ao projeto.

- **Template Path:** `70 Sistema/Templates/T - Cliente.md`
- **File Name Format:** `{{VALUE:cliente}}`
- **Folder:** `40 CRM/Clientes` (pode fixar direto no choice; clientes não variam por área)

Cabeçalho do `T - Cliente` (Templater):

```javascript
<%*
const status = await tp.system.suggester(
  ["lead","ativo","inativo","perdido"], ["lead","ativo","inativo","perdido"], false, "Status do cliente?");
const empresa = await tp.system.prompt("Empresa");
const origem = await tp.system.suggester(
  ["indicacao","inbound","outbound","evento"], ["indicacao","inbound","outbound","evento"], false, "Origem?");
-%>
---
tipo: cliente
status: <% status %>
empresa: <% empresa %>
email: ""
telefone: ""
valor: 0
origem: <% origem %>
responsavel: ""
proximo_contato: <% tp.date.now("YYYY-MM-DD", 7) %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - tema/vendas
---

# <% tp.file.title %>

## 🧩 Contexto
<% tp.file.cursor() %>

## 🗒️ Histórico
## ✅ Próximas ações
- [ ] Primeiro follow-up 🔼 📅 <% tp.date.now("YYYY-MM-DD", 7) %>
```

---

## 4. Criar reunião — QuickAdd Macro → Template (`T - Reuniao`)

> [!abstract] Objetivo
> Nota de reunião nomeada `YYYY-MM-DD Assunto` em `30 Empresa/Reunioes/`, já ligada a projeto/cliente e com seções de **Decisões** e **Ações** prontas para o resumo (ver §6).

**Plugin:** QuickAdd Macro → Template.

- **Template Path:** `70 Sistema/Templates/T - Reuniao.md`
- **File Name Format:** `{{DATE:YYYY-MM-DD}} {{VALUE:assunto}}`
- **Folder:** `30 Empresa/Reunioes`

Cabeçalho do `T - Reuniao`:

```javascript
<%*
const status = await tp.system.suggester(
  ["agendada","realizada","cancelada"], ["agendada","realizada","cancelada"], false, "Status?");
const data = await tp.system.prompt("Data (YYYY-MM-DD)", tp.date.now("YYYY-MM-DD"));
-%>
---
tipo: reuniao
status: <% status %>
data: <% data %>
participantes: []
projeto: ""
cliente: ""
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags: []
---

# <% tp.file.title %>

## 👥 Participantes
## 📝 Pauta
<% tp.file.cursor() %>

## 🗣️ Notas / Transcrição

## 🧭 Decisões

## ✅ Ações
```

> [!tip] Preencha `projeto:` e `cliente:` com links `[[...]]` para a reunião aparecer na timeline daquele projeto/cliente via Dataview.

---

## 5. Novo lançamento financeiro — QuickAdd Macro → Capture

> [!abstract] Objetivo
> Registrar receita/despesa em **1 nota por lançamento** (`50 Financeiro/Pessoal|Empresa/`), com `valor` sempre positivo e `mov` indicando o sinal. As somas saem por Dataview no MOC [[💰 Financeiro]] — nada de planilha paralela.

**Plugin:** QuickAdd → choice **Capture** (cria 1 arquivo por lançamento). Use Macro se quiser perguntar a área e rotear a pasta.

- **Capture To:** `50 Financeiro/{{VALUE:areaPasta}}/{{DATE:YYYY-MM-DD}} {{VALUE:descricao}}.md`
- **Create file if it doesn't exist:** ✅
- **Format:**

```text
---
tipo: lancamento
status: pendente
data: {{DATE:YYYY-MM-DD}}
valor: {{VALUE:valor}}
mov: {{VALUE:mov}}
categoria: {{VALUE:categoria}}
conta: {{VALUE:conta}}
area: {{VALUE:area}}
criado: {{DATE:YYYY-MM-DD}}
atualizado: {{DATE:YYYY-MM-DD}}
tags:
  - tema/financas
---

# {{VALUE:descricao}}
```

> [!note] `area` vs `areaPasta`
> Para garantir consistência, no template Macro use Templater e derive a pasta da área escolhida (igual ao projeto), em vez de pedir os dois. Ex.: `const areaPasta = area === "empresa" ? "Empresa" : "Pessoal";`.

**Agregação no MOC [[💰 Financeiro]]** (DataviewJS — soma com sinal por `mov`):

````markdown
```dataviewjs
const mes = dv.luxon.DateTime.now().toFormat("yyyy-MM");
const lanc = dv.pages('"50 Financeiro"').where(p => p.tipo === "lancamento" && p.data && p.data.toFormat("yyyy-MM") === mes);
const receita = lanc.where(p => p.mov === "receita").array().reduce((s,p)=>s+(p.valor||0),0);
const despesa = lanc.where(p => p.mov === "despesa").array().reduce((s,p)=>s+(p.valor||0),0);
dv.paragraph(`**Mês ${mes}** — Receita: R$ ${receita.toFixed(2)} · Despesa: R$ ${despesa.toFixed(2)} · **Saldo: R$ ${(receita-despesa).toFixed(2)}**`);
```
````

Tabela por categoria (Dataview puro):

```dataview
TABLE mov, valor AS "R$", categoria, conta, status
WHERE tipo = "lancamento" AND area = "empresa"
SORT data DESC
```

> [!idea] Importação mensal (lote)
> No fim do mês, exporte o extrato/cartão em CSV e converta cada linha em uma nota de lançamento. Opções:
> - **Templater + script:** um _User Script_ lê o CSV (`tp.user.importarExtrato`) e gera N notas com o frontmatter acima — mapeando colunas data/valor/descrição e marcando `status: pago`.
> - **QuickAdd em loop:** rode `Novo lançamento` repetidamente colando cada linha (simples, sem código).
> - Categoria padrão por palavra-chave da descrição (ex.: "iFood" → `alimentacao`) reduz digitação. Sempre revise antes de marcar `pago`.

---

## 6. Resumo de reunião — fluxo manual + LLM (Claude)

> [!abstract] Objetivo
> Transformar transcrição/anotações cruas em **Decisões** registradas e **Ações** como tarefas com responsável e prazo — sem inventar plugin de IA. O LLM (Claude) faz a síntese; você cola o resultado nas seções já existentes do `T - Reuniao`.

**Não usa plugin de IA dedicado** — é um fluxo de copiar/colar disciplinado:

1. **Capturar bruto:** durante/após a reunião, cole a transcrição ou suas notas sob `## 🗣️ Notas / Transcrição` na nota de reunião.
2. **Pedir o resumo ao Claude** (no app/CLI do Claude). Prompt sugerido — guarde-o como `tipo: prompt` em `60 Conhecimento/IA/Prompts/`:

   > Você é meu assistente de reuniões. A partir da transcrição abaixo, produza **em PT-BR** e **somente** nestes dois blocos:
   >
   > **DECISÕES** — bullets objetivos do que foi decidido (sem rodeios).
   >
   > **AÇÕES** — uma linha por tarefa no formato do plugin Tasks do Obsidian:
   > `- [ ] <ação> 🔼 📅 <YYYY-MM-DD>` — inclua o responsável entre parênteses no fim e estime o prazo. Se não houver prazo claro, use 📅 da próxima sexta.
   >
   > Não invente itens que não estão na transcrição.
   >
   > Transcrição:
   > """ {cole aqui} """

3. **Colar o retorno** nas seções prontas:
   - Bullets de DECISÕES → `## 🧭 Decisões`
   - Linhas de AÇÕES → `## ✅ Ações` (já viram tarefas que o Dashboard agrega; troque `(Responsável)` por link `[[Contato]]` se quiser rastrear por pessoa).
4. **Fechar a nota:** mude `status: realizada` e atualize `atualizado:` (o Linter faz isso no save — §9).

> [!example] Resultado típico
> ```markdown
> ## 🧭 Decisões
> - Aprovado escopo da fase 1; entrega parcial em 15/07.
> - Stack definida: Next.js + Supabase.
>
> ## ✅ Ações
> - [ ] Enviar proposta revisada para o cliente 🔼 📅 2026-07-01  (Responsável)
> - [ ] Configurar repositório e CI 🔽 📅 2026-07-03  (Responsável)
> ```

> [!tip] Atalho de captura da transcrição
> Crie um QuickAdd **Capture** `Colar transcrição` com _Capture To: active file_, _Insert after: `## 🗣️ Notas / Transcrição`_ e `Format: {{VALUE:transcricao}}` — assim você cola num campo só, sem rolar a nota.

---

## 7. Organização de documentos — Auto Note Mover

> [!abstract] Objetivo
> Esvaziar o `10 Inbox/` automaticamente: assim que uma nota recebe `tipo`/`tag` definitivos, o Auto Note Mover a leva para a pasta de armazenamento correta. As queries não dependem disso (filtram por propriedade), mas mantém o cofre arrumado.

**Plugin:** Auto Note Mover. Configurações → Auto Note Mover.

- **Trigger:** _Automatic_ (move ao salvar/editar) — ou _Manual_ via comando se preferir controle.
- **Excluded folders:** `70 Sistema/Templates` (templates nunca devem ser movidos), `90 Arquivo`.
- Adicione **regras** (a primeira que casar vence — ordene da mais específica para a mais geral).

> [!info] Como as regras casam
> O Auto Note Mover casa por **tag** (`#captura`) ou por **propriedade do frontmatter** no formato `chave: valor` (ex.: `tipo: projeto`). Defina a **pasta de destino** e o **critério**.

Exemplos de regras (Destino ← Critério):

| Pasta de destino | Tag | Propriedade |
|---|---|---|
| `30 Empresa/Projetos` | — | `tipo: projeto` *(área tratada no template; ver nota)* |
| `40 CRM/Clientes` | — | `tipo: cliente` |
| `40 CRM/Contatos` | — | `tipo: contato` |
| `30 Empresa/Reunioes` | — | `tipo: reuniao` |
| `30 Empresa/Documentacao` | — | `tipo: doc` |
| `20 Pessoal/Estudos` | — | `tipo: estudo` |
| `20 Pessoal/Ideias` | — | `tipo: ideia` |
| `60 Conhecimento/IA/Prompts` | — | `tipo: prompt` |
| `90 Arquivo` | — | `status: arquivado` |
| `10 Inbox` | `#captura` | — *(mantém capturas no inbox até processar)* |

> [!warning] Limite: área não é pasta
> O Auto Note Mover roteia por **um** par chave:valor, então `tipo: projeto` não distingue pessoal/empresa. Por isso a **escolha da pasta por área é feita no template** (§2/§5). Deixe a regra de `tipo: projeto` apontando para uma pasta padrão (ou não crie regra para projeto e confie no template). Regra geral: se o template já põe na pasta certa, **não** crie regra concorrente para o mesmo `tipo`.

---

## 8. Registro de estudos — QuickAdd `T - Estudo` + captura de highlights

> [!abstract] Objetivo
> Cadastrar um item de estudo (livro/curso/artigo/vídeo/podcast) com `disciplina` e `fonte`, e ter um jeito rápido de jogar **highlights** dentro dele sem perder o fluxo de leitura.

**Plugin:** QuickAdd Macro → Template (cadastro) + QuickAdd Capture (highlight).

### 8a. Novo estudo — Template

- **Template Path:** `70 Sistema/Templates/T - Estudo.md`
- **File Name Format:** `{{VALUE:titulo}}`
- **Folder:** `20 Pessoal/Estudos`

```javascript
<%*
const tipoFonte = await tp.system.suggester(
  ["livro","curso","artigo","video","podcast"], ["livro","curso","artigo","video","podcast"], false, "Tipo de fonte?");
const disciplina = await tp.system.prompt("Disciplina / tema");
const fonte = await tp.system.prompt("Fonte (autor / plataforma / URL)");
-%>
---
tipo: estudo
status: backlog
disciplina: <% disciplina %>
fonte: <% fonte %>
tipo_fonte: <% tipoFonte %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags: []
---

# <% tp.file.title %>

## 🎯 Por que estudar isto
<% tp.file.cursor() %>

## ✨ Highlights

## 🧠 Síntese (com minhas palavras)

## ✅ Aplicação
- [ ] Aplicar 1 ideia deste estudo 🔼
```

### 8b. Captura rápida de highlight — Capture

QuickAdd **Capture** `Highlight`, para acrescentar trechos à nota de estudo aberta:

- **Capture To:** _active file_ (✅ _Capture to active file_)
- **Insert after:** `## ✨ Highlights`
- **Format:**

```text
> {{VALUE:trecho}} — _p. {{VALUE:pagina}}_
```

```json
{
  "name": "Highlight",
  "type": "Capture",
  "command": true,
  "captureToActiveFile": true,
  "insertAfter": { "enabled": true, "after": "## ✨ Highlights" },
  "format": {
    "enabled": true,
    "format": "> {{VALUE:trecho}} — _p. {{VALUE:pagina}}_"
  }
}
```

> [!tip] Mude `status: estudando` ao começar e `concluido` ao terminar — assim a fila de estudo (Dataview `WHERE tipo = "estudo" AND status = "estudando"`) reflete a realidade.

---

## 9. Manutenção automática — Linter + revisão semanal + Wiki

> [!abstract] Objetivo
> Manter o cofre íntegro sem trabalho manual: padronizar/atualizar YAML ao salvar, ter uma rotina semanal de revisão e manter a Wiki consistente.

### 9a. Linter no save — atualiza `atualizado` e ordena o YAML

**Plugin:** Linter. Configurações → Linter.

- **General → Lint on save:** ✅ (roda ao salvar).
- **YAML → Insert YAML attributes / Force YAML escape** conforme necessidade; ative:
  - **YAML Timestamp** → _Date Modified Key_: `atualizado`, _Date Format_: `YYYY-MM-DD`, _Update on file modify_: ✅. (Opcional _Date Created Key_: `criado`.)
  - **YAML Key Sort** → defina a ordem canônica das chaves para todo frontmatter ficar igual:

```text
tipo
status
area
prioridade
data
prazo
progresso
criado
atualizado
tags
```

  - **YAML → Remove YAML keys** (opcional) para limpar chaves órfãs.
- **Custom Replace / Heading**: opcionalmente normalize espaços e títulos.

> [!warning] Cuidado com `Lint on save` em templates
> Adicione `70 Sistema/Templates` à lista de **pastas ignoradas** do Linter (se disponível na sua versão) ou desative o lint em arquivos com `<%` para o Templater não ser corrompido.

### 9b. Rotina semanal de revisão — Periodic Notes (Weekly)

**Plugin:** Periodic Notes (Weekly Note) + Tasks. A nota semanal `YYYY-[W]ww` (tipo `semanal`) carrega o ritual.

- Configure o template da Weekly Note para incluir o checklist de revisão e as queries abaixo. Link de referência: [[2026-W26]] (a semanal vigente).

````markdown
## 🔁 Revisão semanal
- [ ] Processar `#captura` do Inbox → classificar `tipo`
- [ ] Atualizar `progresso` dos projetos ativos
- [ ] Conferir `proximo_contato` de clientes
- [ ] Fechar reuniões da semana (`status: realizada`)
- [ ] Conciliar lançamentos `pendente` → `pago`

### Inbox a processar
```dataview
LIST FROM #captura
WHERE tipo = "nota" OR !tipo
```

### Projetos ativos sem progresso atualizado
```dataview
TABLE status, progresso AS "%", prazo
WHERE tipo = "projeto" AND status = "ativo"
SORT prazo ASC
```

### Clientes para contatar
```dataview
TABLE empresa, proximo_contato
WHERE tipo = "cliente" AND proximo_contato <= date(today) + dur(7 days)
SORT proximo_contato ASC
```
````

> [!tip] Lembrete recorrente
> Crie uma tarefa recorrente no Dashboard para abrir a revisão: `- [ ] Revisão semanal 🔼 🔁 every week on Sunday 📅 2026-06-28`.

### 9c. Lint da Wiki — consistência do sub-sistema LLM-wiki

A `60 Conhecimento/Wiki/` segue regras próprias (ver _Wiki — Como Manter_). Para manutenção:

- Rode o Linter **manualmente** na pasta da Wiki (comando _Lint folder_) periodicamente, para uniformizar headings e frontmatter sem disparar a cada save.
- Use uma query de saúde para achar páginas órfãs/incompletas:

```dataview
TABLE status, atualizado
WHERE contains(file.folder, "60 Conhecimento/Wiki") AND (status = "rascunho" OR !atualizado)
SORT atualizado ASC
```

- Padrão de revisão: páginas com `atualizado` há mais de 90 dias entram na fila de revisão da Wiki.

---

## Botões do Dashboard (plugin Buttons)

> [!abstract] Objetivo
> Disparar as automações com **um clique** no [[🤖 JARVIS]]. Cada botão chama um **comando** do QuickAdd pelo nome exato do _choice_ (por isso ele precisa estar marcado como _command_).

**Plugin:** Buttons. Cole cada bloco no dashboard. O campo `action` deve ser o **nome literal** do choice/comando QuickAdd.

> [!warning] Nome do comando deve bater
> `QuickAdd: Capturar` exige um choice chamado exatamente `Capturar`. Renomeou o choice? Atualize o botão. Para a Daily Note, o comando é o do Periodic Notes.

### Capturar (ideia/nota → Inbox)

````markdown
```button
name 📥 Capturar
type command
action QuickAdd: Capturar
color blue
```
````

### Novo Projeto

````markdown
```button
name 🚀 Novo Projeto
type command
action QuickAdd: Novo Projeto
color green
```
````

### Novo Cliente

````markdown
```button
name 🤝 Novo Cliente
type command
action QuickAdd: Novo Cliente
color yellow
```
````

### Daily Note (Periodic Notes)

````markdown
```button
name 📅 Daily Note
type command
action Periodic Notes: Open daily note
color default
```
````

### Linha de botões (opcional)

Para alinhar vários botões lado a lado, dê um `id` a cada um e use o bloco `button-row`, ou simplesmente coloque os blocos em sequência. Sugestão de barra de ações no topo do Dashboard:

````markdown
```button
name 📥 Capturar
type command
action QuickAdd: Capturar
```
```button
name ✅ Capturar tarefa
type command
action QuickAdd: Capturar tarefa
```
```button
name 🚀 Novo Projeto
type command
action QuickAdd: Novo Projeto
```
```button
name 🤝 Novo Cliente
type command
action QuickAdd: Novo Cliente
```
```button
name 🗓️ Nova Reunião
type command
action QuickAdd: Nova Reunião
```
```button
name 💸 Novo Lançamento
type command
action QuickAdd: Novo Lançamento
```
```button
name 📅 Daily Note
type command
action Periodic Notes: Open daily note
```
````

> [!tip] Atalhos de teclado
> Além dos botões, abra **Configurações → Atalhos** e atribua teclas aos comandos QuickAdd (ex.: `Ctrl+Shift+C` para `Capturar`). Botão para quem está no mouse, atalho para quem está no teclado — mesma automação.

---

> [!success] Checklist de implantação
> - [ ] Plugins de [[🔌 Plugins]] instalados e ativos
> - [ ] Templates `T - Projeto`, `T - Cliente`, `T - Reuniao`, `T - Estudo` criados em `70 Sistema/Templates/`
> - [ ] Choices QuickAdd criados e marcados como _command_: `Capturar`, `Capturar tarefa`, `Novo Projeto`, `Novo Cliente`, `Nova Reunião`, `Novo Lançamento`, `Highlight`
> - [ ] Auto Note Mover com regras por `tipo` + exclusão de Templates
> - [ ] Linter com _Lint on save_ + YAML Timestamp (`atualizado`) + Key Sort
> - [ ] Botões colados no [[🤖 JARVIS]]
> - [ ] Revisão semanal agendada na Weekly Note
