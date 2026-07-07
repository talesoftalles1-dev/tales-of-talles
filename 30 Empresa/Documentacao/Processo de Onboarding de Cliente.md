---
dominio: yalt
tipo: doc
status: publicado
categoria: operacoes
relacionado:
  - "[[SOP - Fechar Venda]]"
criado: 2026-06-12
atualizado: 2026-06-27
tags:
  - tema/vendas
  - tema/lideranca
---

# 📄 Processo de Onboarding de Cliente

> [!info] Sobre este documento
> Define como um cliente entra na operação depois que a venda é fechada — da assinatura do contrato à primeira entrega. Garante experiência consistente, reduz retrabalho e cria a base de relacionamento. Documento de referência da área de operações.

## 🎯 Objetivo

Padronizar a recepção de novos clientes para que cada um tenha: contrato em dia, expectativas alinhadas, acessos coletados e kickoff realizado dentro de **5 dias úteis** após o fechamento.

## 🧭 Quando se aplica

Logo após o "ganho" registrado no [[SOP - Fechar Venda]]: a partir daí, todo cliente novo entra por este fluxo, começando pela reunião de kickoff.

## 🔁 Etapas do onboarding

### 1. Formalização (D+0 a D+1)
- Enviar contrato e coletar assinatura.
<<<<<<< HEAD
- Emitir a nota da primeira parcela e registrar o recebimento em `50 Financeiro/Empresa`.
- Criar a nota do cliente em `40 CRM/Clientes` com `status: ativo`.
=======
- Emitir a nota da primeira parcela e registrar o recebimento (ex.: [[2026-06-27 Recebimento Acme]]).
- Criar a nota do cliente em `40 CRM/Clientes` com `status: publicado`.
>>>>>>> reconcile/vault-merge-20260628

### 2. Coleta de informações (D+1 a D+3)
- Briefing preenchido pelo cliente.
- Acessos necessários (hospedagem, redes, materiais de marca).
- Definição do ponto focal e do canal de comunicação.

### 3. Kickoff (até D+5)
- Agendar e realizar reunião de kickoff (`tipo: reuniao`).
- Alinhar escopo, cronograma, marcos e cadência de updates.
- Registrar decisões e ações como tarefas na nota da reunião.

### 4. Setup do projeto (D+5 a D+7)
- Criar a nota do projeto em `30 Empresa/Projetos` com `area: empresa`.
- Vincular `cliente` e `objetivo` no frontmatter.
- Definir as primeiras tarefas com vencimento.

## ✅ Checklist de onboarding

- [ ] Contrato assinado e arquivado
- [ ] Primeira parcela registrada no financeiro
- [ ] Nota do cliente criada no CRM
- [ ] Briefing recebido
- [ ] Acessos coletados
- [ ] Kickoff realizado
- [ ] Nota do projeto criada e vinculada

## 📏 Indicadores

- Tempo médio até o kickoff: meta ≤ 5 dias úteis.
- Onboardings concluídos sem retrabalho de escopo: meta ≥ 90%.

## 🔗 Relacionados

- [[SOP - Fechar Venda]]
