---
tipo: doc
status: publicado
area: pessoal
categoria: sistema
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Spec JARVIS]]"
tags:
  - tema/ia
---

# 🎨 Tema e Visual — Identidade JARVIS

> [!jarvis] Objetivo
> Dar ao vault uma aparência de **software premium** — referências: macOS, Linear e Raycast — sem comprometer a manutenibilidade. O visual é construído em três camadas que se somam: **tema Minimal** (base sólida e neutra), **Style Settings** (ajustes finos sem código) e o snippet **`jarvis.css`** (componentes proprietários da marca).

---

## 1. Por que Minimal (kepano) + Style Settings

O tema **Minimal**, do Steph Ango (kepano, atual CEO da Obsidian), é a base ideal porque:

- **Neutro e tipográfico** — não impõe estética própria; serve de tela em branco para a marca JARVIS, ao contrário de temas opinativos que brigam com CSS custom.
- **Pensado para Style Settings** — expõe dezenas de variáveis (cor de accent, fonte, densidade, largura de linha, cantos) editáveis pela interface, sem tocar em uma linha de código.
- **Estável e mantido** — acompanha as versões do Obsidian de perto, então atualizações raramente quebram o layout.
- **Performático** — leve, sem animações pesadas que atrapalham um vault grande de 10 anos.

O plugin **Style Settings** é o painel que destrava essas variáveis. Ele transforma o Minimal de "tema bonito" em "tema configurável": você define o accent ciano da marca, a fonte e a densidade uma vez, e tudo herda esses valores.

> [!card] Divisão de responsabilidades
> - **Minimal** → estrutura, tipografia e comportamento base.
> - **Style Settings** → ajustes globais via interface (cor, fonte, densidade).
> - **`jarvis.css`** → componentes proprietários: cards, grid, faixa JARVIS, métricas, tabelas Dataview, botões pill. O que o tema não entrega de fábrica.

---

## 2. Ativar o snippet `jarvis.css` (passo a passo)

O arquivo já está em `.obsidian/snippets/jarvis.css`. Para ligá-lo:

1. Abra **Configurações** (ícone de engrenagem, canto inferior esquerdo).
2. Vá em **Aparência** (Appearance).
3. Role até a seção **CSS snippets**.
4. Clique no ícone de **recarregar** (🔄) para o Obsidian detectar o arquivo `jarvis`.
5. Ligue o **toggle** ao lado de **`jarvis`**.
6. Pronto — o visual é aplicado na hora, sem reiniciar.

> [!jarvis] Editou o CSS?
> Após qualquer mudança no arquivo `jarvis.css`, basta **desligar e religar** o toggle (ou clicar em recarregar) para ver o resultado. Não precisa fechar o Obsidian.

> [!card] Onde fica o arquivo
> Caminho completo: `C:/Users/talle/OneDrive/Documents/Jarvis/.obsidian/snippets/jarvis.css`. Como está dentro do vault sincronizado (OneDrive), o tema acompanha o vault em qualquer máquina.

---

## 3. Paleta de cores da marca

Estas são as cores oficiais — já embutidas no `jarvis.css` como variáveis `--jarvis-*`. Use-as como referência para qualquer elemento visual novo (banners, gráficos, capas).

| Papel | Hex | Variável CSS | Uso |
|---|---|---|---|
| Fundo | `#0B0E14` | `--jarvis-bg` | quase preto azulado, base do modo escuro |
| Superfície | `#11151F` | `--jarvis-surface` | fundo de cards e métricas |
| Superfície elevada | `#161B27` | `--jarvis-surface-2` | hover / camadas sobrepostas |
| **Accent ciano** | `#22D3EE` | `--jarvis-accent` | cor da marca JARVIS, links, números |
| Accent ciano claro | `#36C5F0` | `--jarvis-accent-soft` | gradientes, hover |
| Âmbar (alerta) | `#F5A524` | `--jarvis-amber` | destaques e avisos secundários |
| Sucesso | `#22C55E` | `--jarvis-success` | concluído, positivo |
| Perigo | `#EF4444` | `--jarvis-danger` | atrasado, erro |
| Texto | `#E6EDF3` | `--jarvis-text` | corpo de texto |
| Texto suave | `#8B98A9` | `--jarvis-text-muted` | labels, legendas, metadados |

---

## 4. Como usar os callouts custom nas notas

O snippet adiciona três callouts proprietários. A sintaxe é a padrão do Obsidian — `> [!tipo] Título` — e o CSS faz o resto.

### 4.1 `[!card]` — cartão premium

Bloco com superfície escura, borda sutil, cantos arredondados e **brilho ciano no hover**. Ideal para destacar uma informação, um KPI ou um resumo.

```markdown
> [!card] Status do mês
> 12 projetos ativos, 3 concluídos. Pipeline saudável.
```

### 4.2 `[!grid]` — malha responsiva de cards

Transforma os **callouts filhos** em um grid responsivo (`auto-fit`, mínimo 240px por coluna, gap de 16px). O próprio `[!grid]` perde borda e fundo — é só o container. Aninhe `[!card]` dentro dele com **indentação extra** (`> >`):

```markdown
> [!grid]
>
> > [!card] Projetos ativos
> > 12 em andamento
>
> > [!card] Reuniões da semana
> > 4 agendadas
>
> > [!card] Receita do mês
> > R$ 18.400
```

> [!jarvis] Dica de sintaxe
> Cada card filho começa com `> >` (um nível a mais de citação). Deixe **uma linha em branco com apenas `>`** entre os cards para o Obsidian separá-los corretamente.

### 4.3 `[!jarvis]` — faixa de destaque do assistente

Banner com **gradiente ciano sutil** e barra esquerda accent. Use para avisos do sistema, dicas e mensagens do "assistente".

```markdown
> [!jarvis] Lembrete
> Revisar o Inbox toda sexta antes de fechar a semana.
```

### 4.4 Metric cards — números grandes (estatísticas do dashboard)

Para a seção de estatísticas do `🤖 JARVIS.md`, use o bloco HTML de métricas. Os números saem grandes em ciano, com label menor embaixo:

```markdown
<div class="jarvis-metrics">
  <div class="jarvis-metric"><span class="num">12</span><span class="label">Projetos ativos</span></div>
  <div class="jarvis-metric green"><span class="num">3</span><span class="label">Concluídos</span></div>
  <div class="jarvis-metric amber"><span class="num">4</span><span class="label">A revisar</span></div>
  <div class="jarvis-metric danger"><span class="num">1</span><span class="label">Atrasado</span></div>
</div>
```

As classes de cor `green`, `amber` e `danger` mudam só a cor do número (padrão é ciano).

---

## 5. Ajustes recomendados no Style Settings

Após instalar o Minimal e o plugin Style Settings, abra **Configurações > Style Settings** e aplique:

> [!card] Configuração recomendada
> - **Accent color** → ciano `#22D3EE` (alinha links e seleção do Obsidian à marca).
> - **Color scheme / Base color** → escuro (`Dark`), com tons próximos de `#0B0E14`.
> - **Font (Text / Interface)** → uma fonte geométrica e limpa: **Inter**, **SF Pro** ou **General Sans**. Fallback do sistema funciona bem.
> - **Font size** → 16px no corpo (leitura confortável).
> - **Line height / Line width** → linha aerada e largura de leitura ~40–46em (respiro estilo documento).
> - **Image grid / Card layout** → ative os cards do Minimal para os file explorers, se gostar do visual em grade.
> - **Borders / Window frame** → bordas discretas; ligue "Hide scrollbars" se quiser o visual mais limpo (o snippet já deixa o scrollbar fino).

> [!jarvis] Importante: defina o accent no Style Settings
> O `jarvis.css` colore **componentes próprios** (cards, tabelas Dataview, botões). Mas o **accent global** do Obsidian (links comuns, cursor, seleção, gráfico do Graph View) vem do tema — então ajuste o accent ciano também no **Style Settings** para a marca ficar 100% consistente.

---

## 6. O que o snippet refina automaticamente

Mesmo sem mexer em nada além de ligar o toggle, o `jarvis.css` aplica:

- **Tabelas Dataview** — header em ciano com destaque, linhas zebradas e hover suave.
- **Checkboxes de Tasks** — arredondados, preenchem em ciano ao marcar.
- **Scrollbar fino** — discreto, estilo app nativo, com hover ciano.
- **Botões (plugin Buttons)** — formato pill com gradiente ciano.
- **Tags inline** — em formato pill ciano suave.
- **Tipografia** — `line-height` mais aerado e cantos arredondados em imagens e blocos de código.

> [!card] Segurança em temas claros
> Os refinamentos globais usam **variáveis nativas do tema**, não cores escuras fixas. O visual escuro premium fica restrito aos componentes próprios (cards, grid, faixa JARVIS, métricas). Resultado: se um dia você alternar para um tema claro, o vault **não quebra** — só os cards mantêm a identidade escura da marca.

---

## 7. Solução de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| Snippet não aparece na lista | Obsidian não recarregou a pasta | Clique no ícone de recarregar em CSS snippets |
| Card sem estilo | Callout escrito errado | Confirme a sintaxe `> [!card] Título` (colchete + exclamação) |
| Grid não vira colunas | Cards filhos sem indentação extra | Cada card deve começar com `> >` dentro do `[!grid]` |
| Cores diferentes da marca | Accent do tema não ajustado | Defina o accent ciano no **Style Settings** |
| Mudei o CSS e nada muda | Cache do snippet | Desligue e religue o toggle do snippet `jarvis` |

---

> [!jarvis] Resumo de uma linha
> **Minimal** dá a base, **Style Settings** ajusta o global (accent ciano + fonte), e **`jarvis.css`** entrega os componentes da marca. Ligou o snippet e definiu o accent → o vault vira software.
