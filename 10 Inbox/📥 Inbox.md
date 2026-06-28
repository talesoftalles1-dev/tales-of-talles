---
tipo: nota
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
tags: []
---

# 📥 Inbox

> [!cyan] Capture primeiro, organize depois
> Este é o ponto único de entrada do JARVIS. Tudo que chega — uma ideia solta, um nome de cliente, um link, uma tarefa — entra aqui **sem fricção** e é processado depois. A regra é simples: **nunca pare para classificar no momento da captura**. Solte a nota com a tag `#captura` e siga em frente. O processamento acontece em lote, com calma.

## Como funciona o fluxo

1. **Capturar** — crie uma nota rápida (ou use o QuickAdd) em qualquer lugar e adicione a tag `#captura`. Não se preocupe com pasta, propriedades ou formatação.

> [!tip] Captura por voz
> Gravou um áudio (carro, caminhada, reunião)? Transcreva (app do celular, Whisper, ou ditado nativo) e cole o texto bruto numa nota com `#captura`. O fluxo de processamento é o mesmo — a origem (texto digitado ou voz transcrita) não importa, só o conteúdo.
2. **Processar** — uma vez por dia (ou quando o Inbox encher), abra esta nota e percorra a lista abaixo. Para cada item, decida:
   - **Acionável?** Vira tarefa (`- [ ]`) ou projeto (`tipo: projeto`).
   - **Referência?** Vira nota de conhecimento (`tipo: nota`) ou vai para a Wiki.
   - **Pessoa/empresa?** Vira `cliente` ou `contato` no CRM.
   - **Dinheiro?** Vira `lancamento` no Financeiro.
   - **Não serve?** Apague sem dó. Inbox zero é o objetivo.
3. **Classificar** — preencha o frontmatter correto (`tipo`, `status`, `area`) e **remova a tag `#captura`**. O Auto Note Mover leva a nota para a pasta certa automaticamente — pastas são só armazenamento, a propriedade é que manda.

> [!amber] Regra de ouro
> A tag `#captura` é o sinal de "ainda não processei". Enquanto ela existir, a nota aparece abaixo. Processou? Remova a tag. Inbox limpo = mente limpa.

## 🟡 A processar (marcadas com #captura)

```dataview
LIST
FROM #captura
SORT file.cday DESC
```

## 🆕 Criadas nos últimos 7 dias

```dataview
TABLE WITHOUT ID
  file.link AS "Nota",
  tipo AS "Tipo",
  status AS "Status",
  file.cday AS "Criada em"
WHERE file.cday >= date(today) - dur(7 days)
SORT file.cday DESC
```

## ✅ Tarefas capturadas aguardando processamento

```tasks
not done
path includes 10 Inbox
sort by created reverse
hide task count
```

---

## Navegação

- 🤖 Dashboard principal: [[🤖 JARVIS]]
- 🌱 [[🌱 Pessoal]] · 🏢 [[🏢 Yalt]] · 🤝 [[🤝 CRM]] · 💰 [[💰 Financeiro]] · 🧠 [[🧠 Conhecimento]] · 🗄️ [[🗄️ Arquivo]]
