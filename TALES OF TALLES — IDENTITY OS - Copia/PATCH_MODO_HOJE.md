# 🟡 PATCH pronto — Modo "Hoje" (#9) + ativar Sync Notion

Código revisto, à espera do shell para aplicar **com `node --check`** no `tales-of-talles_FINAL.html`.
Quando o sandbox voltar, eu aplico, valido e entrego. Aqui fica para teres visibilidade.

---

## A) Modo "Hoje" — topo do Camp responde em 5s (3 ações)

**Onde:** logo a seguir ao relógio/countdown, antes do card da Missão, na página Camp.

### HTML (inserir no `<section data-page-id="camp">`, após o `#countdown-card`)
```html
<div class="hoje-bar" role="group" aria-label="Ações rápidas de hoje">
  <button type="button" class="hoje-act" id="hoje-treino">
    <span class="hoje-ico" aria-hidden="true">🏋️</span><span class="hoje-lbl">TREINO</span>
  </button>
  <button type="button" class="hoje-act" id="hoje-timer">
    <span class="hoje-ico" aria-hidden="true">⏱️</span><span class="hoje-lbl">TIMER</span>
  </button>
  <button type="button" class="hoje-act" id="hoje-registar">
    <span class="hoje-ico" aria-hidden="true">✓</span><span class="hoje-lbl">REGISTAR</span>
  </button>
</div>
```

### CSS (antes de `</style>`)
```css
.hoje-bar{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 12px}
.hoje-act{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 6px;border-radius:13px;
  background:var(--s2);border:1px solid var(--b1);color:var(--white);cursor:pointer;transition:transform .15s,border-color .2s,background .2s}
.hoje-act:active{transform:scale(.96)}
.hoje-act:hover{border-color:var(--gold2)}
.hoje-ico{font-size:20px;line-height:1}
.hoje-lbl{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:12px;letter-spacing:1.5px}
.hoje-act:focus-visible{outline:2px solid var(--gold2);outline-offset:2px}
```

### JS (dentro de `setupEventListeners()`, junto aos outros listeners)
```js
// Modo "Hoje" — 3 ações diretas
document.getElementById('hoje-treino')?.addEventListener('click',()=>{
  const m=document.querySelector('.mission-card');
  document.getElementById('btn-expand-all')?.click();
  m?.scrollIntoView({behavior:'smooth',block:'start'});
});
document.getElementById('hoje-timer')?.addEventListener('click',()=>{
  // VERIFICAR no apply: usar o trigger real do timer (fab-timer ou navTo)
  document.getElementById('fab-timer')?.click();
});
document.getElementById('hoje-registar')?.addEventListener('click',()=>{
  document.getElementById('btn-camp-day')?.scrollIntoView({behavior:'smooth',block:'center'});
});
```
> No apply confirmo o gatilho real do **Timer** lendo o código (id `fab-timer` ou função `openTimer`/`navTo`),
> e ajusto a 1 linha antes de validar. As outras 2 ações usam âncoras já existentes (`btn-expand-all`,
> `mission-card`, `btn-camp-day`).

**Validação:** extrair `<script>` → `node --check` → confirmar 0 erros → entregar.

---

## B) Ativar o Sync Notion (workflow já criado)

Workflow **TALES · Sync Notion (Diário do Camp)** já está no teu n8n:
https://talesoftalles.app.n8n.cloud/workflow/82WXvA3I5tVRQtoM

Para funcionar (1 vez):
1. https://www.notion.so/my-integrations → cria uma integração interna → copia o **Internal Integration Token**.
2. Abre a tua base **📔 Diário do Camp** → menu ⋯ → **Connections** → liga a integração (dá acesso à base).
3. No workflow (nó *Diário do Camp*) → cria a credencial **Notion API** `Notion (Diário do Camp)` e cola o token.
4. **Ativa** o workflow.

Depois, ligo o botão **SYNC NOTION** do app a este webhook (`/webhook/tales-notion-sync`) — é um ajuste de
JS pequeno que faço com validação quando o shell voltar.

---

## Estado dos workflows n8n (todos no teu projeto pessoal)
| Workflow | Estado | Precisa de |
|---|---|---|
| Sanji / Cariani / Muzy / Ilia (coaches) | ✅ ativo e testado | nada |
| Sanji lê a nota (Vision) | ✅ ativo | chave Anthropic (1x) |
| Visão Ilia/Cariani | ✅ ativo | mesma chave Anthropic |
| Sync Notion (Diário do Camp) | criado, por ativar | credencial Notion (1x) |
