---
dominio: jarvis
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-07-02
cssclasses:
  - jarvis-dashboard-v2
tags:
  - sistema
---

<div class="jarvis-hud-container">

<div class="jarvis-hud-header">
  <span>JARVIS OS v2.0 // STATUS: OPERATIONAL</span>
  <span class="time">`= dateformat(date(now), "HH:mm:ss")` // `= dateformat(date(today), "dd.MM.yyyy")`</span>
</div>

<div class="jarvis-agent-grid">

<!-- COLUNA ESQUERDA: CANAIS -->
<div class="jarvis-lane">
  <div class="jarvis-lane-title">Channels</div>
  <div class="jarvis-item active">
    <span class="label">SLACK</span>
    <span class="status-dot"></span>
  </div>
  <div class="jarvis-item">
    <span class="label">WHATSAPP</span>
    <span class="status-dot"></span>
  </div>
  <div class="jarvis-item">
    <span class="label">EMAIL</span>
    <span class="sub-label">Syncing...</span>
  </div>
</div>

<!-- COLUNA CENTRAL: AGENTES (HUD) -->
<div class="jarvis-lane">
  <div class="jarvis-lane-title">Core Agents</div>
  
  <div class="jarvis-card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <span style="font-family: var(--jarvis-font-mono); font-weight: 800; color: var(--jarvis-accent);">E.A. // EXECUTIVE ASSISTANT</span>
      <span class="status-dot"></span>
    </div>
    <div style="font-size: 0.8rem; color: var(--jarvis-text-muted); margin-bottom: 10px;">
      Triagem concluída. 3 ações críticas identificadas para hoje.
    </div>
    <div class="jarvis-gauge-container">
      <div class="jarvis-gauge"><div class="jarvis-gauge-fill" style="width: 85%;"></div></div>
    </div>
  </div>

  <div class="jarvis-card" style="border-color: var(--jarvis-blue); opacity: 0.8;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <span style="font-family: var(--jarvis-font-mono); font-weight: 800; color: var(--jarvis-blue);">TOR // DEVELOPER</span>
      <span class="status-dot" style="background: var(--jarvis-blue); box-shadow: 0 0 5px var(--jarvis-blue);"></span>
    </div>
    <div style="font-size: 0.8rem; color: var(--jarvis-text-muted); margin-bottom: 10px;">
      Deploy do PWA concluído. Monitorando logs de performance.
    </div>
  </div>

  <div class="jarvis-card" style="border-color: var(--jarvis-amber); opacity: 0.8;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <span style="font-family: var(--jarvis-font-mono); font-weight: 800; color: var(--jarvis-amber);">BOBBY // SALES</span>
      <span class="status-dot" style="background: var(--jarvis-amber); box-shadow: 0 0 5px var(--jarvis-amber);"></span>
    </div>
    <div style="font-size: 0.8rem; color: var(--jarvis-text-muted); margin-bottom: 10px;">
      Aguardando resposta do lead Acme Corp.
    </div>
  </div>
</div>

<!-- COLUNA DIREITA: CONEXÕES -->
<div class="jarvis-lane">
  <div class="jarvis-lane-title">Connections</div>
  <div class="jarvis-item">
    <span class="label">NOTION</span>
    <span class="status-dot"></span>
  </div>
  <div class="jarvis-item">
    <span class="label">GITHUB</span>
    <span class="status-dot"></span>
  </div>
  <div class="jarvis-item">
    <span class="label">STRIPE</span>
    <span class="status-dot"></span>
  </div>
  <div class="jarvis-item">
    <span class="label">N8N</span>
    <span class="status-dot"></span>
  </div>
  <div class="jarvis-item">
    <span class="label">GOOGLE DRIVE</span>
    <span class="status-dot"></span>
  </div>
</div>

</div>

<div class="jarvis-card" style="margin-top: 20px;">
  <h2 style="margin-top: 0; font-size: 1rem; color: var(--jarvis-accent);">🎯 Top 3 Actions</h2>
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
    <h2 style="margin-top: 0; font-size: 1rem; color: var(--jarvis-red);">⚠ Risks & Blockers</h2>
    ```dataview
    TABLE WITHOUT ID
      file.link AS "Item",
      status AS "Status"
    WHERE (tipo = "projeto" OR tipo = "objetivo") AND status != "concluido" AND (status = "pausado" OR dependencia)
    LIMIT 3
    ```
  </div>
  
  <div class="jarvis-card">
    <h2 style="margin-top: 0; font-size: 1rem; color: var(--jarvis-blue);">📊 System Vitals</h2>
    ```dataviewjs
    const pages = dv.pages().where(p => !p.file.folder.includes("Templates"));
    const hoje = dv.luxon.DateTime.now().toISODate();
    const tarefasHoje = dv.pages().file.tasks.where(t => !t.completed && t.due && t.due.toISODate() <= hoje).length;
    
    dv.paragraph(`**Projetos Ativos:** ${pages.where(p => p.tipo == "projeto" && p.status == "ativo").length}`);
    dv.paragraph(`**Tarefas Atrasadas:** ${tarefasHoje}`);
    dv.paragraph(`**Saúde (Readiness):** 85%`);
    ```
  </div>
</div>

<div class="jarvis-card">
  <h2 style="margin-top: 0; font-size: 1rem; color: var(--jarvis-text-muted);">🧭 Navigation</h2>
  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
    [[🌱 Pessoal]] · [[🩺 Saúde & Performance]] · [[🏢 Yalt]] · [[🤝 CRM]] · [[💰 Financeiro]] · [[🧠 Conhecimento]] · [[📥 Inbox]] · [[wiki/_master_index|🧭 Master Index]]
  </div>
</div>

</div>
