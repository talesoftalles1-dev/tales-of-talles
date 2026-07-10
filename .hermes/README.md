# .hermes/ — diretório do Hermes Agent no vault JARVIS

Paralelo ao `.claude/`. Guarda artefatos específicos do Hermes para este vault.

## Estrutura

```
.hermes/
├── README.md      este arquivo
└── skills/        skills do Hermes escopadas a este vault (paridade com .claude/skills/)
```

## Como o Hermes carrega contexto aqui

1. **Context file:** o Hermes lê `HERMES.md` na raiz do vault (prioridade sobre
   `AGENTS.md`), que aponta para o canon em `CLAUDE.md` + `70 Sistema/_Spec JARVIS.md`.
2. **Skills globais:** a maioria das skills JARVIS vive no diretório global do
   Hermes (`~/AppData/Local/hermes/skills/`) e carrega em qualquer sessão —
   não precisam ser duplicadas aqui.
3. **Skills locais:** coloque em `.hermes/skills/<nome>/SKILL.md` apenas o que
   for tão específico deste vault que não faça sentido global.

## Convenção anti-drift

Não duplique o canon. `HERMES.md` é um ponteiro fino; o contrato real está em
`CLAUDE.md`/`AGENTS.md` (o vault-lint vigia drift entre esses dois). Não crie
uma terceira cópia do contrato.
