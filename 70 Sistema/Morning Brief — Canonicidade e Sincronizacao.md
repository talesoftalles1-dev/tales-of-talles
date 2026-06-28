---
tipo: doc
status: referenciado
categoria: sistema
area: empresa
criado: 2026-06-27
atualizado: 2026-06-27
aliases:
  - Morning Brief — Canonicidade
  - Brief — Canonicidade e Sincronização
  - Morning Brief Sync
relacionado:
  - "[[70 Sistema/_Index]]"
  - "[[TALES OF TALLES OS — Master Evolution Report]]"
tags:
  - brief
  - ssot
  - vault
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.

# Morning Brief — Versão Canônica e Sincronização

::: Single Source of Truth (SSOT)
Toda a documentação relacionada ao Morning Brief deve referenciar a especificação canônica. Documentos derivados não podem introduzir regras próprias nem divergentes.
:::

## Onde está a versão canônica
A versão canônica do *Morning Brief* vive no Vault/Obsidian (OneDrive/`Documents/Jarvis` → path do Vault). O repositório GitHub `tales-of-talles` contém apenas referências arquiteturais e saídas regeneráveis (output/), não a fonte primária de edição.

## Papel do repositório GitHub
- Arquivo de *referência* e histórico (read-only para autoring primário).
- Contém entregáveis regeneráveis (ex.: `output/YYYY-MM-DD-morning-brief.txt`) e documentação que ajuda a operacionalizar o Brief.
- NÃO deve ser usado como ambiente primário de edição do conteúdo do Brief.

## Fonte de verdade atual
- Fonte primária (SSOT): Vault/Obsidian — `OneDrive/Documents/Jarvis` (Obsidian vault).
- Especificação canônica de implementação: `Automacao/_Morning Brief — Spec` (no Vault).
- Artefatos publicados no repo: `output/TALES OF TALLES OS — Master Evolution Report.md`, `output/YYYY-MM-DD-morning-brief.txt` (gerados).

## Como ocorre a sincronização (Vault ↔ Repo)
Recomenda-se um dos fluxos abaixo — o Operador escolhe qual executar conforme política de segurança e ferramentas disponíveis:

1) Fluxo automatizado (recomendado para CI leve):
   - Editar no Vault (Obsidian).
   - Rodar o script de publicação local (`generate.mjs` ou equivalente) que gera os artefatos em `output/`.
   - Commitar os arquivos gerados no repositório (via Obsidian Git plugin ou git manual) com mensagem clara: `chore(brief): publish morning brief YYYY-MM-DD`.

2) Fluxo Obsidian Git (quando disponível e autorizado):
   - Habilitar Obsidian Git no Vault com regra de autoria do Operador.
   - Push direto para o repositório (ou branch de publicação) apenas para arquivos de `output/` e notas _não sensíveis_.
   - O Operador revê e faz merge se necessário.

3) Fluxo manual (quando houver segredos ou revisão humana obrigatória):
   - Exportar do Vault para um arquivo local (Markdown/Texto).
   - O Operador cria o commit no repositório via interface GitHub (PR) ou commit direto conforme porte de mudança.

### Boas práticas de sincronização
- Nunca sincronizar segredos ou credenciais do Vault para o repositório. Use credential store/secret manager.
- Documentos-canônicos devem ser editados apenas no Vault; commits diretos no repo para regras/contratos somente via PR do Operador com justificativa.
- Incluir no commit message referência ao ID da Brief (data) e ao autor responsável.
- Usar `output/archived/` para versões arquivadas; não sobrescrever entradas históricas.

## Quando atualizar o repositório
- Apenas artefatos regeneráveis (outputs) e notas de arquitetura são publicados.
- Mudanças de contrato/Spec só pelo Operador mediante PR aprovado.

## Contato / Owners
- Operador: Talles (owner das keys e gates humanas)
- Executive Assistant (EA): responsável por orquestração e sanity checks

---

> Nota: este arquivo aponta para a fonte canônica no Vault. Se houver necessidade de incluir uma cópia editável no repo, criar um PR justificado e registrar o motivo em `_Contrato de Autoridade`.