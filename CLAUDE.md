# JARVIS — Sistema Operacional Pessoal e Empresarial (Obsidian)

Este vault é o **JARVIS**: um segundo cérebro que centraliza vida pessoal e empresarial. Ele se comporta como um software, não como um bloco de notas. Você (o LLM) é o mantenedor disciplinado deste sistema.

## Contrato

A arquitetura é definida em **`70 Sistema/_Spec JARVIS.md`** — leia-o antes de criar ou editar qualquer nota estruturada. Ele fixa: estrutura de pastas, esquema de propriedades por tipo, taxonomia de tags, convenções de tarefas e sintaxe. Nunca invente nomes de propriedade fora do spec; se precisar de um novo, adicione ao spec primeiro e propague aos templates/queries.

## Princípio central

**Propriedades (frontmatter) são a fonte da verdade para consultas. Pastas são só armazenamento.** Toda query Dataview filtra por `tipo`/`status`/`area`, nunca pelo caminho da pasta.

## Fluxo canônico raw → wiki → output

O vault agora tem uma camada operacional linear:

```
raw/      humano despeja captura bruta; IA lê e remove apenas depois de processar
wiki/     IA organiza memória estruturada, índices, projetos, agentes e conhecimento
output/   sistema entrega dashboards, relatórios e compilações sobrescrevíveis
```

Não misture territórios: não edite o bruto em `raw/` para "embelezar"; materialize em `wiki/`. Não trate `output/` como fonte de verdade; ele é regenerável. A migração física da estrutura numerada só acontece por plano dry-run aprovado.

## Estrutura (resumo)

```
raw/              captura bruta operada pelo humano
wiki/             domínio auto-maintained da IA
output/           entregas geradas
00 JARVIS/        dashboard + guia
10 Inbox/         captura
20 Pessoal/       projetos, diário, objetivos, hábitos, estudos, ideias
30 Empresa/       projetos, reuniões, documentação
40 CRM/           clientes, contatos
50 Financeiro/    pessoal, empresa (lançamentos)
60 Conhecimento/  wiki, IA/prompts, notas
70 Sistema/       templates, SOPs, checklists, automação, spec, guia de plugins
90 Arquivo/       encerrados
```

## Operações

- **Capturar** ideia/tarefa → dump novo vai para `raw/inbox.md`; captura estruturada legada pode continuar em `10 Inbox/` com `#captura`.
- **Criar nota estruturada** → use o template correspondente em `70 Sistema/Templates/` e preencha as propriedades do contrato.
- **Organizar por IA** → leia `raw/`, escreva em `wiki/`, atualize `wiki/_master_index.md`.
- **Entregar visão** → escreva compilações em `output/`; não use `output/` como memória canônica.
- **Responder consulta** → leia o Dashboard / MOC da área, depois as notas; filtre por propriedade.
- **Navegação** é sempre via `00 JARVIS/🤖 JARVIS.md` (Dashboard) e MOCs de área — nunca dependa de abrir pastas.

## Sub-sistema Wiki (LLM-wiki)

`60 Conhecimento/Wiki/` é uma base de conhecimento incremental (padrão "LLM Wiki"): fontes imutáveis em `Wiki/raw/`, páginas geradas em `Wiki/` (entities, concepts, sources, index.md, log.md). Mantenha-a conforme as instruções em `60 Conhecimento/Wiki/_Wiki — Como Manter.md` quando trabalhar nessa área.

## Idioma

Todo o conteúdo do vault é em **português (PT-BR)**. Mantenha esse padrão.
