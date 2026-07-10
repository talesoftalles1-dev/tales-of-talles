// yalt-dashboard/lib/render.mjs
// Função PURA: dados -> string HTML. Sem fetch, sem fs.
// Estilo: dark premium JARVIS (ver 70 Sistema/🎨 Tema e Visual.md).
// Paleta: bg #0B0E14 · surface #11151F · accent ciano #22D3EE

const C = {
  bg: "#0B0E14",
  surface: "#11151F",
  surface2: "#161B27",
  accent: "#22D3EE",
  accentSoft: "#36C5F0",
  amber: "#F5A524",
  success: "#22C55E",
  danger: "#EF4444",
  text: "#E6EDF3",
  muted: "#8B98A9",
};

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function metric(num, label, color) {
  const style = color ? ` style="color:${color}"` : "";
  return `<div class="metric"><span class="num"${style}>${esc(num)}</span><span class="label">${esc(label)}</span></div>`;
}

function stageCard(name, count, max) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return `<div class="stage">
    <div class="stage-name">${esc(name)}</div>
    <div class="stage-num">${esc(count)}</div>
    <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
  </div>`;
}

function bandRow(label, count, color) {
  return `<div class="band">
    <span class="band-label">${esc(label)}</span>
    <span class="band-num" style="color:${color}">${esc(count)}</span>
  </div>`;
}

// data = {
//   generatedAt,            // ISO
//   leadStats: {...},       // do getLeadStats
//   teamStats: [...]|null,  // do getTeamStats (pode ser null se falhou)
//   funnel: { to-prospect, approaching, send-proposal, negociation, later }, // contagem por status
//   followup: { b0_7, b8_30, b31_90, b90plus }, // contagens agregadas por faixa
// }
export function renderDashboard(data) {
  const { generatedAt, leadStats = {}, teamStats = null, funnel = {}, followup = {} } = data;

  // Linha principal: pipeline ativo (5 estágios)
  const activeStages = [
    ["A prospectar", funnel["to-prospect"] ?? 0],
    ["Abordando", funnel["approaching"] ?? 0],
    ["Proposta", funnel["send-proposal"] ?? 0],
    ["Negociação", funnel["negociation"] ?? 0],
    ["Depois", funnel["later"] ?? 0],
  ];
  const activeMax = Math.max(1, ...activeStages.map((s) => s[1]));
  const activeTotal = activeStages.reduce((a, s) => a + s[1], 0);

  // Linha secundária: contexto (não confundir com "em andamento")
  const ctx = [
    ["Novo (backlog)", leadStats.new ?? 0, C.muted],
    ["Inadequado", leadStats.inadequate ?? 0, C.muted],
    ["Fechado", leadStats.closed ?? 0, C.success],
    ["Perdido", leadStats.lost ?? 0, C.danger],
    ["Base total", leadStats.total ?? 0, C.muted],
  ];

  // Follow-up health (só contagens por faixa — sem nome/empresa)
  const bands = [
    ["0–7 dias", followup.b0_7 ?? 0, C.success],
    ["8–30 dias", followup.b8_30 ?? 0, C.accent],
    ["31–90 dias", followup.b31_90 ?? 0, C.amber],
    ["90+ dias", followup.b90plus ?? 0, C.danger],
  ];

  const teamSection = teamStats
    ? `<section>
        <h2>Equipe</h2>
        <div class="team-grid">
          ${teamStats
            .map(
              (m) =>
                `<div class="team-card">
                  <div class="team-name">${esc(m.name ?? m.agent ?? "—")}</div>
                  <div class="team-stats">
                    ${metric(m.leads ?? m.total_leads ?? 0, "leads")}
                    ${metric(m.closed ?? m.closed_leads ?? 0, "fechados", C.success)}
                  </div>
                </div>`
            )
            .join("")}
        </div>
      </section>`
    : `<section>
        <h2>Equipe</h2>
        <p class="muted-note">Estatísticas de equipe indisponíveis no snapshot atual (API de team stats falhou).</p>
      </section>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Yalt — Pipeline Comercial</title>
<style>
  :root { --bg:${C.bg}; --surface:${C.surface}; --surface2:${C.surface2};
    --accent:${C.accent}; --text:${C.text}; --muted:${C.muted}; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text);
    font-family: Inter, "SF Pro", system-ui, -apple-system, sans-serif;
    line-height:1.5; padding:32px 20px; }
  .wrap { max-width:960px; margin:0 auto; }
  header { border-bottom:1px solid #1e2532; padding-bottom:16px; margin-bottom:28px; }
  h1 { margin:0 0 6px; font-size:24px; font-weight:700;
    background:linear-gradient(90deg,var(--accent),var(--accentSoft));
    -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .updated { color:var(--muted); font-size:13px; }
  .updated strong { color:var(--accent); font-weight:600; }
  section { margin-bottom:34px; }
  h2 { font-size:14px; text-transform:uppercase; letter-spacing:.08em;
    color:var(--muted); margin:0 0 14px; font-weight:600; }
  .metrics { display:flex; flex-wrap:wrap; gap:14px; }
  .metric { background:var(--surface); border:1px solid #1e2532; border-radius:12px;
    padding:16px 20px; min-width:120px; }
  .metric .num { display:block; font-size:30px; font-weight:700; color:var(--accent); }
  .metric .label { display:block; font-size:12px; color:var(--muted); margin-top:2px; }
  .funnel { display:flex; flex-direction:column; gap:8px; }
  .stage { display:flex; align-items:center; gap:14px; }
  .stage-name { width:120px; font-size:13px; color:var(--text); flex-shrink:0; }
  .stage-num { width:42px; text-align:right; font-weight:700; font-size:16px; color:var(--accent); }
  .bar { flex:1; height:10px; background:var(--surface); border-radius:6px; overflow:hidden; }
  .bar-fill { height:100%; background:linear-gradient(90deg,var(--accent),var(--accentSoft)); border-radius:6px; }
  .context { display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; }
  .ctx-chip { background:transparent; border:1px solid #1e2532; border-radius:20px;
    padding:5px 14px; font-size:12px; color:var(--muted); }
  .ctx-chip b { color:var(--text); font-weight:600; }
  .team-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; }
  .team-card { background:var(--surface); border:1px solid #1e2532; border-radius:12px; padding:16px; }
  .team-name { font-weight:600; margin-bottom:10px; }
  .team-stats { display:flex; gap:14px; }
  .bands { display:flex; flex-direction:column; gap:6px; }
  .band { display:flex; justify-content:space-between; padding:10px 14px;
    background:var(--surface); border-radius:8px; font-size:14px; }
  .band-num { font-weight:700; }
  .muted-note { color:var(--muted); font-size:13px; font-style:italic; }
  footer { margin-top:40px; padding-top:16px; border-top:1px solid #1e2532;
    color:var(--muted); font-size:12px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Yalt — Pipeline Comercial</h1>
    <div class="updated">última atualização: <strong>${esc(generatedAt)}</strong> · snapshot estático</div>
  </header>

  <section>
    <h2>Funil ativo (${esc(activeTotal)} leads trabalhados)</h2>
    <div class="funnel">
      ${activeStages.map((s) => stageCard(s[0], s[1], activeMax)).join("")}
    </div>
    <div class="context">
      ${ctx.map((c) => `<span class="ctx-chip">${esc(c[0])}: <b style="color:${c[2]}">${esc(c[1])}</b></span>`).join("")}
    </div>
  </section>

  <section>
    <h2>Saúde de follow-up (contagens por faixa)</h2>
    <div class="bands">
      ${bands.map((b) => bandRow(b[0], b[1], b[2])).join("")}
    </div>
  </section>

  ${teamSection}

  <footer>
    Dashboard interno JARVIS · dados de snapshot do CRM Yalt · sem dado nominal de lead · gerado por 70 Sistema/Automacao/yalt-dashboard/generate.mjs
  </footer>
</div>
</body>
</html>`;
}

export { C as COLORS };
