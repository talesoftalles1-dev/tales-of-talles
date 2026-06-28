---
dominio: jarvis
tipo: habito
status: ativo
frequencia: <% tp.system.prompt("Frequência (diario/semanal)", "diario") %>
meta_semanal: <% tp.system.prompt("Meta semanal (número de vezes por semana)", "7") %>
area: pessoal
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - tema/saude
---

# 🔁 <% tp.file.title %>

> [!info] Hábito
> Frequência **`= this.frequencia`** · Meta semanal **`= this.meta_semanal`x**
> Hábitos vencem pela consistência, não pela intensidade. Comece pequeno e não quebre a corrente.

## Gatilho

> [!note] O que dispara o hábito
> Ancore o hábito em algo que já acontece ("depois de escovar os dentes", "ao abrir o notebook"). Gatilho claro = menos dependência de força de vontade.

- **Depois de:** <% tp.file.cursor() %>
- **Onde:** 
- **Hora aproximada:** 

## Recompensa

> [!success] Por que vale a pena
> O que torna o hábito gratificante no curto prazo? Sem recompensa percebida, o cérebro não fixa o loop.

- **Recompensa imediata:** 
- **Benefício de longo prazo:** 

## Registro

> [!tip] Como marcar
> Marque o cumprimento **no Daily Note** do dia (campo de hábitos / tarefa diária), não aqui. Esta nota guarda a definição do hábito; o histórico vive nos dailies e é agregado pelo Dashboard.
>
> Sugestão de tarefa recorrente para colar no Daily:
> `- [ ] <% tp.file.title %> 🔁 every day`

### Pendências de ajuste

- [ ] Revisar adesão ao hábito 🔁 every week ⏳ <% tp.date.now("YYYY-MM-DD", 7) %>
