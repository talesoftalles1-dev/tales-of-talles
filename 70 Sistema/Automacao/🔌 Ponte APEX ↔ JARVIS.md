---
tipo: doc
status: rascunho
categoria: automacao
area: pessoal
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[🩺 Saúde & Performance]]"
  - "[[Ponte n8n ↔ JARVIS]]"
tags:
  - tema/saude
  - tema/ia
---

# 🔌 Ponte APEX ↔ JARVIS — Sincronização Saúde → Vault

> [!cyan] Princípio: integrar por **dados**, não por código
> O app **APEX / TALES OF TALLES** continua sendo um produto à parte (HTML PWA single-file, event-driven). O JARVIS **não** funde o codebase dele — apenas recebe os dados como notas. Isto respeita a anti-recomendação nº 1 da auditoria ("não fundir os dois codebases"). O app já faz **SYNC NOTION** ao fim de cada sessão; aqui definimos o **SYNC VAULT** equivalente.

## 🎯 O que sincroniza

Cada evento do app vira uma nota no vault (esquema em [[_Spec JARVIS]] §9), sempre com `fonte: apex`:

| Evento do app | Vira a nota | Pasta |
|---|---|---|
| `COMPLETE_GYM_EXERCISE` (Cariani) | `tipo: treino` (`modalidade: musculacao`) | `20 Pessoal/Saude/Treinos/` |
| `COMPLETE_BOXING_DRILL` (Ilia) | `tipo: treino` (`modalidade: boxe`) | `20 Pessoal/Saude/Treinos/` |
| Fecho nutricional do dia (Sanji) | `tipo: nutricao` | `20 Pessoal/Saude/Nutricao/` |
| `ADD_BODY_SCAN` / readiness (Muzy) | `tipo: corporal` | `20 Pessoal/Saude/Corporal/` |

> Pasta é só armazenamento — as queries do hub filtram por `tipo`. Se preferir, pode jogar tudo em `20 Pessoal/Saude/` sem subpastas.

## 🛣️ Caminho de entrega (escolher um)

| # | Caminho | Como funciona | Prós | Contras |
|---|---|---|---|---|
| **1 ⭐** | **n8n (Notion) → OneDrive (MS Graph)** | No workflow `tales-notion-sync` (instância `talesoftalles.app.n8n.cloud`), adicionar um ramo que, além do Notion, escreve o `.md` na pasta do vault via Microsoft Graph. Um SYNC → Notion **e** vault. | Reaproveita o sync que já existe; OneDrive sincroniza sozinho p/ o Obsidian | Precisa de credencial MS Graph no n8n |
| **2** | **App → SYNC VAULT (File System Access API)** | Botão novo no app que, rodando no PC, grava os `.md` direto na pasta do vault (sem nuvem). | Zero infra, 100% local e privado | Só funciona no desktop com permissão concedida; não no iPhone |
| **3** | **App/n8n → S3 → poller local** | Grava no S3 (credencial já existe) e um PowerShell agendado puxa p/ o vault. | Usa o que já há | Precisa de script local agendado |

> [!tip] Recomendação
> **Caminho 1** — é o mesmo padrão já recomendado em [[Ponte n8n ↔ JARVIS]] (opção B) e une os dois mundos num só clique de SYNC. Se quiser começar hoje sem mexer no n8n, use o **Caminho 2** no desktop.

---

## 📄 Formato exato que o SYNC deve emitir

Cada nota é Markdown com frontmatter idêntico ao §9. Exemplos canônicos:

**Treino (musculação):** arquivo `2026-06-27 Musculacao Inferior.md`
```markdown
---
tipo: treino
status: feito
data: 2026-06-27
modalidade: musculacao
coach: cariani
duracao_min: 64
volume_kg: 8200
rpe: 8
prs: ["Agachamento 120kg x5"]
kcal_gasto: 480
area: pessoal
fonte: apex
criado: 2026-06-27
atualizado: 2026-06-27
tags: [tema/saude]
---

# 🥋 2026-06-27 Musculacao Inferior
Sessão sincronizada do APEX. Volume 8200 kg · RPE 8.
```

**Nutrição (dia):** arquivo `2026-06-27 Nutricao.md`
```markdown
---
tipo: nutricao
status: fechado
data: 2026-06-27
kcal: 3120
proteina_g: 178
carbo_g: 360
gordura_g: 88
agua_l: 3.2
refeicoes: 5
aderencia: 96
area: pessoal
fonte: apex
criado: 2026-06-27
atualizado: 2026-06-27
tags: [tema/saude]
---

# 🍽️ 2026-06-27 Nutricao
```

**Corporal (scan):** arquivo `2026-06-27 Corporal.md`
```markdown
---
tipo: corporal
data: 2026-06-27
peso_kg: 77.4
gordura_pct: 12.1
readiness: 82
sono_h: 7.5
fadiga: 2
area: pessoal
fonte: apex
criado: 2026-06-27
atualizado: 2026-06-27
tags: [tema/saude]
---

# 🩺 2026-06-27 Corporal
```

> Regra de idempotência: para `nutricao` e `corporal` há **uma nota por dia** — o sync deve **sobrescrever** a do dia (mesmo nome de arquivo), não duplicar. `treino` pode ter várias por dia (nome inclui a modalidade).

---

## 🧩 Gerador de nota (reutilizável no app ou no n8n Function node)

```javascript
// buildVaultNote(ev) → { filename, markdown }
// ev: objeto do evento já normalizado pelo reducer do APEX
function buildVaultNote(ev) {
  const today = ev.data || new Date().toISOString().slice(0, 10);
  const yaml = (o) => Object.entries(o)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? JSON.stringify(v) : v}`)
    .join("\n");

  if (ev.type === "treino") {
    const fm = {
      tipo: "treino", status: "feito", data: today,
      modalidade: ev.modalidade, coach: ev.modalidade === "boxe" ? "ilia" : "cariani",
      duracao_min: ev.duracao_min ?? 0, volume_kg: ev.volume_kg ?? 0,
      distancia_km: ev.distancia_km ?? 0, rpe: ev.rpe ?? 0,
      prs: ev.prs ?? [], kcal_gasto: ev.kcal_gasto ?? 0,
      area: "pessoal", fonte: "apex", criado: today, atualizado: today, tags: ["tema/saude"],
    };
    const nome = `${today} ${ev.titulo || ev.modalidade}`;
    return { filename: `${nome}.md`, markdown: `---\n${yaml(fm)}\n---\n\n# 🥋 ${nome}\nSincronizado do APEX.\n` };
  }

  if (ev.type === "nutricao") {
    const fm = {
      tipo: "nutricao", status: "fechado", data: today,
      kcal: ev.kcal ?? 0, proteina_g: ev.proteina_g ?? 0, carbo_g: ev.carbo_g ?? 0,
      gordura_g: ev.gordura_g ?? 0, agua_l: ev.agua_l ?? 0, refeicoes: ev.refeicoes ?? 0,
      aderencia: ev.aderencia ?? 0, area: "pessoal", fonte: "apex",
      criado: today, atualizado: today, tags: ["tema/saude"],
    };
    return { filename: `${today} Nutricao.md`, markdown: `---\n${yaml(fm)}\n---\n\n# 🍽️ ${today} Nutricao\n` };
  }

  if (ev.type === "corporal") {
    const fm = {
      tipo: "corporal", data: today, peso_kg: ev.peso_kg, gordura_pct: ev.gordura_pct ?? "",
      readiness: ev.readiness ?? 0, sono_h: ev.sono_h ?? 0, fadiga: ev.fadiga ?? 0,
      area: "pessoal", fonte: "apex", criado: today, atualizado: today, tags: ["tema/saude"],
    };
    return { filename: `${today} Corporal.md`, markdown: `---\n${yaml(fm)}\n---\n\n# 🩺 ${today} Corporal\n` };
  }
}
```

### Caminho 2 — botão "SYNC VAULT" no app (desktop)

```javascript
// Uma vez: pedir a pasta do vault e guardar o handle
async function escolherPastaVault() {
  const dir = await window.showDirectoryPicker(); // aponte para .../Jarvis/20 Pessoal/Saude
  // (persistir o handle via IndexedDB para não pedir toda vez)
  return dir;
}
async function syncVault(dirHandle, eventos) {
  for (const ev of eventos) {
    const nota = buildVaultNote(ev);
    if (!nota) continue;
    const fh = await dirHandle.getFileHandle(nota.filename, { create: true });
    const w = await fh.createWritable();
    await w.write(nota.markdown);
    await w.close();
  }
}
```

> [!warning] O que você precisa decidir/fazer
> 1. **Escolher o caminho** (1, 2 ou 3). Recomendo o **1**.
> 2. Caminho 1: autorizar adicionar **credencial Microsoft Graph** no n8n e o ramo "→ OneDrive" no workflow `tales-notion-sync` (aditivo, não toca os 42 workflows da Yalt).
> 3. Confirmar a pasta de destino: `OneDrive/Documents/Jarvis/20 Pessoal/Saude/`.
> 4. Rodar um SYNC de teste e conferir o hub [[🩺 Saúde & Performance]] renderizando.

## 🔗 Relacionados

- Contrato de dados: [[_Spec JARVIS]] §9 · Hub: [[🩺 Saúde & Performance]] · Ponte comercial: [[Ponte n8n ↔ JARVIS]]
