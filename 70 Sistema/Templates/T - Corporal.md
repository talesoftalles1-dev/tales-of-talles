---
tipo: corporal
data: <% tp.date.now("YYYY-MM-DD") %>
peso_kg: <% tp.system.prompt("Peso (kg)", "77") %>
gordura_pct: <% tp.system.prompt("Gordura corporal (%) — opcional", "") %>
readiness: <% tp.system.prompt("Readiness / prontidão (0–100)", "75") %>
sono_h: <% tp.system.prompt("Sono (horas)", "7") %>
fadiga: <% tp.system.prompt("Fadiga (1–5)", "2") %>
foto: ""
area: pessoal
fonte: manual
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - tema/saude
---

# 🩺 <% tp.file.title %>

> [!cyan] Métrica corporal · Coach Muzy
> Rumo a **84 kg** (de 77). Readiness combina recuperação + sono + fadiga + carga de treino. Pese-se em jejum, mesma hora, para a série ser comparável.

**Peso:** `= this.peso_kg` kg · **Readiness:** `= this.readiness`/100 · **Sono:** `= this.sono_h` h · **Fadiga:** `= this.fadiga`/5

## 📸 Body scan

> [!note] Foto de progresso (opcional)
> Cole o anexo e aponte `foto:` no frontmatter.

## 🧠 Leitura do dia

<% tp.file.cursor() %>

## 🔗 Relacionados

- Hub: [[🩺 Saúde & Performance]] · Projeto: [[Reformular Rotina de Saude]]
