// scripts/bootstrap_jarvis_os.js
const fs = require('fs');
const path = require('path');

// Define volumes and chapters
const volumes = [
  { dir: '00 Sistema', chapters: [
    'Chapter 01 — Executive Assistant.md',
    'Chapter 02 — Prioritization Formula.md',
    'Chapter 03 — Adaptive Agenda.md',
    'Chapter 04 — Agent Orchestration.md',
    'Chapter 05 — Decision Surface & Dashboard.md',
    'Chapter 06 — Contracts & Taxonomy.md',
  ]},
  { dir: '10 Inbox', chapters: [
    'Chapter 07 — Capture & Triage.md',
    'Chapter 08 — Processing Rules.md',
  ]},
  { dir: '20 Pessoal', chapters: [
    'Chapter 09 — Health & Performance.md',
    'Chapter 10 — Goals & Progress.md',
    'Chapter 11 — Training Logs.md',
    'Chapter 12 — Nutrition & Body.md',
  ]},
  { dir: '30 Empresa', chapters: [
    'Chapter 13 — Projects & Releases.md',
    'Chapter 14 — Commercial Ops (Yalt).md',
    'Chapter 15 — Partnerships & Legal.md',
    'Chapter 16 — Marketing & Growth.md',
  ]},
  { dir: '40 CRM', chapters: [
    'Chapter 17 — CRM Data Model.md',
    'Chapter 18 — Sync & MCP Contracts.md',
    'Chapter 19 — Outreach & ESP Strategy.md',
  ]},
  { dir: '50 Financeiro', chapters: [
    'Chapter 20 — Revenue Ops.md',
    'Chapter 21 — Billing & Forecasting.md',
    'Chapter 22 — Budgets & KPIs.md',
  ]},
  { dir: '60 Conhecimento', chapters: [
    'Chapter 23 — Vault Structure & Dataviews.md',
    'Chapter 24 — Templates & Skills.md',
    'Chapter 25 — Archives & Migration.md',
    'Chapter 26 — Search & Indexing.md',
  ]},
  { dir: '70 Sistema', chapters: [
    'Chapter 27 — Automations & n8n Bridge.md',
    'Chapter 28 — Security & Secrets Runbook.md',
    'Chapter 29 — Agent Roster & Authority.md',
    'Chapter 30 — Monitoring & Alerts.md',
    'Chapter 31 — Bootstrap & Maintenance.md',
  ]},
];

// Canonical frontmatter template generator
function frontmatter(volumeDir, chapterFile, title) {
  const now = new Date().toISOString();
  return `---\n` +
         `tipo: chapter\n` +
         `status: backlog\n` +
         `area: ${volumeDir}\n` +
         `title: ${title}\n` +
         `created: ${now}\n` +
         `---\n\n# ${title}\n\n*Draft content goes here.*\n`;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

volumes.forEach(v => {
  const volPath = path.join(process.cwd(), v.dir);
  ensureDir(volPath);
  v.chapters.forEach(ch => {
    const filePath = path.join(volPath, ch);
    if (!fs.existsSync(filePath)) {
      const title = ch.replace('.md','').replace('Chapter ','');
      const content = frontmatter(v.dir, ch, title);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
});

console.log('Bootstrap completed: directories and chapter files generated.');
