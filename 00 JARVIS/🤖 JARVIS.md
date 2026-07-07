---
dominio: jarvis
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-07-06
cssclasses:
<<<<<<< HEAD
  - jarvis-dashboard-v2
tags: []
=======
  - jarvis-dashboard
tags:
  - tema/sistema
>>>>>>> reconcile/vault-merge-20260628
---

<div class="jarvis-hud-container">

<div class="jarvis-hud-header">
  <span>JARVIS OS v2.1 // STATUS: OPERACIONAL</span>
  <span class="time">`= dateformat(date(now), "HH:mm:ss")` // `= dateformat(date(today), "dd.MM.yyyy")`</span>
</div>

<div class="jarvis-agent-grid">

<!-- COLUNA ESQUERDA: CANAIS -->
<div class="jarvis-lane">
  <div class="jarvis-lane-title">Canais</div>
  <div class="jarvis-item active">
    <span class="label">OBSIDIAN</span>
    <span class="status-dot"></span>
  </div>
  <div class="jarvis-item">
    <span class="label">SLACK #daily</span>
    <span class="sub-label">entrega pendente (OAuth)</span>
  </div>
  <div class="jarvis-item">
    <span class="label">CLAUDE CODE</span>
    <span class="status-dot"></span>
  </div>
</div>

<!-- COLUNA CENTRAL: AGENTES (estado real → [[agent_roster]]) -->
<div class="jarvis-lane">
  <div class="jarvis-lane-title">Agentes</div>

  <div class="jarvis-card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <span style="font-family: var(--jarvis-font-mono); font-weight: 800; color: var(--jarvis-accent);">E.A. // JARVIS</span>
      <span class="status-dot"></span>
    </div>
    <div style="font-size: 0.8rem; color: var(--jarvis-text-muted); margin-bottom: 10px;">
      Dashboard diário às 07:00 → <a class="internal-link" href="output/daily_dashboard.md">daily_dashboard</a>. Orquestra os 9 Estagiários.
    </div>
  </div>

  <div class="jarvis-card" style="border-color: var(--jarvis-blue); opacity: 0.9;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <span style="font-family: var(--jarvis-font-mono); font-weight: 800; color: var(--jarvis-blue);">TOR // DEV</span>
      <span class="status-dot" style="background: var(--jarvis-blue); box-shadow: 0 0 5px var(--jarvis-blue);"></span>
    </div>
    <div style="font-size: 0.8rem; color: var(--jarvis-text-muted); margin-bottom: 10px;">
      Sob demanda (E4, Claude Code).
    </div>
  </div>

  <div class="jarvis-card" style="border-color: var(--jarvis-amber); opacity: 0.9;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <span style="font-family: var(--jarvis-font-mono); font-weight: 800; color: var(--jarvis-amber);">BOBBY // COMERCIAL</span>
      <span class="status-dot" style="background: var(--jarvis-amber); box-shadow: 0 0 5px var(--jarvis-amber);"></span>
    </div>
    <div style="font-size: 0.8rem; color: var(--jarvis-text-muted); margin-bottom: 10px;">
      n8n congelado (self-host pronto). CRM via skill segue ativo.
    </div>
  </div>

  <div style="font-size: 0.75rem; color: var(--jarvis-text-muted); margin-top: 6px;">
    Estado completo e honesto: [[agent_roster|Agent Roster]]
  </div>
</div>

<!-- COLUNA DIREITA: INTEGRAÇÕES REAIS -->
<div class="jarvis-lane">
  <div class="jarvis-lane-title">Integrações</div>
  <div class="jarvis-item active">
    <span class="label">GITHUB</span>
    <span class="status-dot"></span>
  </div>
  <div class="jarvis-item active">
    <span class="label">ONEDRIVE</span>
    <span class="status-dot"></span>
  </div>
  <div class="jarvis-item">
    <span class="label">N8N</span>
    <span class="sub-label">self-host aguardando deploy</span>
  </div>
  <div class="jarvis-item">
    <span class="label">APEX (dados §9)</span>
    <span class="status-dot"></span>
  </div>
</div>

</div>

<div class="jarvis-card" style="margin-top: 20px;">
  <h2 style="margin-top: 0; font-size: 1rem; color: var(--jarvis-accent);">🎯 Top 3 Ações</h2>
  ```tasks
  not done
  due before tomorrow
  sort by priority, due
  limit 3
  hide backlink
  short mode
  ```
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
  <div class="jarvis-card">
    <h2 style="margin-top: 0; font-size: 1rem; color: var(--jarvis-red);">⚠ Riscos & Bloqueios</h2>
    ```dataview
    TABLE WITHOUT ID
      file.link AS "Item",
      status AS "Status"
    WHERE (tipo = "projeto" OR tipo = "objetivo") AND status != "concluido" AND (status = "pausado" OR dependencia)
    LIMIT 3
    ```
  </div>

  <div class="jarvis-card">
    <h2 style="margin-top: 0; font-size: 1rem; color: var(--jarvis-blue);">📊 Vitais do Sistema</h2>
    ```dataviewjs
    const hoje = dv.luxon.DateTime.now().toISODate();
    const tarefasAtrasadas = dv.pages().file.tasks.where(t => !t.completed && t.due && t.due.toISODate() <= hoje).length;
    const projetosAtivos = dv.pages().where(p => p.tipo == "projeto" && p.status == "ativo").length;
    const lastCorporal = dv.pages().where(p => p.tipo == "corporal").sort(p => p.data, 'desc').first();
    const inboxRaw = await dv.io.load("raw/inbox.md");
    const capturas = inboxRaw ? inboxRaw.split("\n").filter(l => l.trim().startsWith("- ") || l.trim().startsWith("* ")).length : 0;

    dv.paragraph(`**Projetos ativos:** ${projetosAtivos}`);
    dv.paragraph(`**Tarefas até hoje:** ${tarefasAtrasadas}`);
    dv.paragraph(`**Capturas no inbox:** ${capturas}`);
    dv.paragraph(`**Readiness (MUZY):** ${lastCorporal && lastCorporal.readiness != null ? lastCorporal.readiness + "%" : "— (sem registro)"}`);
    ```
  </div>
</div>

<div class="jarvis-card">
  <h2 style="margin-top: 0; font-size: 1rem; color: var(--jarvis-text-muted);">🧭 Navegação</h2>
  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
    [[🌱 Pessoal]] · [[🩺 Saúde & Performance]] · [[🏢 Yalt]] · [[🤝 CRM]] · [[💰 Financeiro]] · [[🧠 Conhecimento]] · [[📥 Inbox]] · [[wiki/_master_index|🧭 Master Index]] · [[📖 Guia do Sistema]]
  </div>
</div>

</div>
