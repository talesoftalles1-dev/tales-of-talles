---
tipo: doc
status: publicado
categoria: sistema
criado: 2026-06-27
atualizado: 2026-06-27
tags:
  - tema/ia
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[🔌 Plugins]]"
  - "[[🔁 Automacoes]]"
---

# ⌨️ Atalhos e Hotkeys — Mapa de Teclas do JARVIS

> [!info] Filosofia
> Atalhos no estilo **Raycast / macOS**: poucos, memoráveis e centrados numa tecla-âncora. A tecla-marca do sistema é **`Ctrl/Cmd + J`** (J de **JARVIS**) → abre a home. A partir daí, combinações com `Ctrl/Cmd` cobrem captura, templates e navegação. No macOS, troque `Ctrl` por `Cmd ⌘`.

> [!warning] Onde configurar
> Tudo abaixo é definido em `Config (⚙️) → Atalhos (Hotkeys)`. Busque pelo nome do comando (coluna "Comando"), clique no `+` e pressione a combinação. Comandos de plugins só aparecem após o plugin estar **instalado e ativo** (ver [[🔌 Plugins]]).

---

## Tabela principal de hotkeys recomendadas

| Ação | Atalho (Win/Linux) | Atalho (macOS) | Comando para buscar |
|---|---|---|---|
| **Abrir Home / Dashboard JARVIS** | `Ctrl + J` | `Cmd + J` | `Homepage: Open homepage` |
| **Captura rápida (QuickAdd)** | `Ctrl + Shift + C` | `Cmd + Shift + C` | `QuickAdd: Captura rápida` |
| **Inserir template (Templater)** | `Ctrl + T` | `Cmd + T` | `Templater: Open insert template modal` |
| **Criar template em nova nota (Templater)** | `Ctrl + Shift + T` | `Cmd + Shift + T` | `Templater: Create new note from template` |
| **Busca rápida / Quick switcher** | `Ctrl + O` | `Cmd + O` | `Quick switcher: Open quick switcher` |
| **Paleta de comandos (Command palette)** | `Ctrl + P` | `Cmd + P` | `Command palette: Open command palette` |
| **Criar / abrir Daily Note** | `Ctrl + D` | `Cmd + D` | `Periodic Notes: Open daily note` |
| **Criar / abrir Weekly Note** | `Ctrl + Shift + W` | `Cmd + Shift + W` | `Periodic Notes: Open weekly note` |
| **Alternar painel lateral esquerdo** | `Ctrl + [` | `Cmd + [` | `Toggle left sidebar` |
| **Alternar painel lateral direito** | `Ctrl + ]` | `Cmd + ]` | `Toggle right sidebar` |
| **Busca global no vault** | `Ctrl + Shift + F` | `Cmd + Shift + F` | `Search: Search in all files` |
| **Abrir Inbox (captura sem prompt)** | `Ctrl + Shift + I` | `Cmd + Shift + I` | `QuickAdd: Inbox rápido` |

> [!tip] Mnemônica
> **J**arvis = home · **C**apturar = `Shift + C` · **T**emplate = `T` · **D**aily = `D` · **O**pen (switcher) = `O` · **P**alette = `P`. As ações de "criar algo novo" ganham `Shift` (ex.: `Shift + T` cria nota nova de template; `Shift + W` cria a semanal).

---

## Atalhos âncora estilo Raycast (resumo visual)

> [!example] O "menu de comando" do JARVIS
> - `Ctrl/Cmd + J` → 🤖 **JARVIS Home** (volta sempre ao centro de controle)
> - `Ctrl/Cmd + O` → 🔎 **Ir para...** (qualquer nota pelo nome — o "Spotlight")
> - `Ctrl/Cmd + P` → ⚡ **Comando...** (qualquer ação do app)
> - `Ctrl/Cmd + Shift + C` → 📥 **Capturar** (lança ideia/tarefa no Inbox via prompt)
> - `Ctrl/Cmd + T` → 📄 **Template** (insere bloco no documento atual)
> - `Ctrl/Cmd + D` → 🌙 **Hoje** (abre o diário do dia)

---

## Atalhos nativos úteis (já vêm no Obsidian)

Estes funcionam sem configuração extra — vale memorizar:

| Ação | Win/Linux | macOS |
|---|---|---|
| Nova nota | `Ctrl + N` | `Cmd + N` |
| Nova aba | `Ctrl + Shift + N` | `Cmd + Shift + N` |
| Fechar aba atual | `Ctrl + W` | `Cmd + W` |
| Reabrir aba fechada | `Ctrl + Shift + W`* | `Cmd + Shift + W`* |
| Alternar modo leitura/edição | `Ctrl + E` | `Cmd + E` |
| Inserir/editar propriedades (frontmatter) | `Ctrl + ;` | `Cmd + ;` |
| Voltar / Avançar no histórico | `Alt + ←` / `Alt + →` | `Cmd + ←` / `Cmd + →` |
| Painel de gráfico (graph view) | — | — (atribua se usar) |

> [!warning] Conflito previsível: `Ctrl + Shift + W`
> O Obsidian usa `Ctrl/Cmd + Shift + W` para **reabrir aba fechada** por padrão. Como recomendamos essa combinação para **Weekly Note**, escolha um lado: ou remapeie a semanal para `Ctrl + Alt + W`, ou aceite reabrir aba por outro caminho. Sugestão limpa: **Weekly = `Ctrl + Alt + W`** para evitar o choque.

---

## Como evitar conflitos de atalho

> [!tip] Checklist rápido
> 1. Em `Config → Atalhos`, use o campo de busca e o **filtro "Atribuído"** para ver o que já está em uso.
> 2. Se aparecer um ⚠️ ao gravar, há colisão — escolha outra combinação ou remova a antiga.
> 3. Mantenha `Ctrl/Cmd + J/O/P/D` reservados às âncoras do JARVIS — não reaproveite para outra coisa.
> 4. No macOS, evite combinações já capturadas pelo sistema (ex.: `Cmd + Space`, `Cmd + Tab`).

---

> [!success] Resultado
> Com este mapa, o JARVIS se opera quase sem mouse: `Cmd + J` para a home, `Cmd + Shift + C` para capturar, `Cmd + O` para ir a qualquer nota, `Cmd + P` para qualquer comando. Configure tudo em `Config → Atalhos` e revise a instalação dos plugins em [[🔌 Plugins]].
