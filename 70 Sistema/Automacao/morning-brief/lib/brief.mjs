import {
  compareTasks,
  formatDateBR,
  isBlocked,
  projectScore,
  todayISO,
  toDate,
  addDays,
} from "./priority.mjs";
import { isRecurringStale } from "./vault.mjs";

export function buildMorningBrief({ notes, tasks }, options = {}) {
  const today = options.today || todayISO();
  const tDate = toDate(today);

  const top3 = selectTop3(tasks, today);
  const risks = collectRisks(notes, tasks, today);
  const commercial = collectCommercial(notes, today);
  const projects = selectProjectsAttention(notes, today);
  const todaySection = collectToday(notes, tasks, today);

  return {
    date: today,
    top3,
    risks,
    commercial,
    projects,
    today: todaySection,
    text: formatBriefText({ today, top3, risks, commercial, projects, todaySection }),
  };
}

function selectTop3(tasks, today) {
  const tomorrow = addDays(toDate(today), 1);
  const eligible = tasks.filter(
    (t) => !t.done && t.due && toDate(t.due) < tomorrow && !isRecurringStale(t, today)
  );
  const todayFirst = eligible
    .filter((t) => t.due === today)
    .sort(compareTasks);
  const overdue = eligible
    .filter((t) => t.due !== today)
    .sort(compareTasks);
  return [...todayFirst, ...overdue]
    .slice(0, 3)
    .map((t, i) => ({
      rank: i + 1,
      text: t.text,
      due: t.due,
      source: t.sourceBasename,
    }));
}

function collectRisks(notes, tasks, today) {
  const items = [];

  for (const n of notes) {
    if (n.tipo !== "projeto" && n.tipo !== "objetivo") continue;
    if (["concluido", "arquivado", "abandonado"].includes(n.status)) continue;

    if (isBlocked(n)) {
      const dep = formatDependency(n.dependencia);
      items.push({
        kind: "ProjectBlocked",
        text: `${n.basename}${dep ? ` — bloqueado por ${dep}` : " — pausado"}`,
      });
    }

    if (n.tipo === "projeto" && n.status === "ativo" && n.prazo && toDate(n.prazo) < toDate(today)) {
      items.push({
        kind: "MissedDeadline",
        text: `${n.basename} — prazo vencido (${formatDateBR(n.prazo)})`,
      });
    }

    if (n.tipo === "projeto" && n.status === "ativo" && n.prazo) {
      const daysLeft = Math.round((toDate(n.prazo) - toDate(today)) / 86400000);
      if (daysLeft >= 0 && daysLeft <= 3 && n.progresso != null && n.progresso < 70) {
        items.push({
          kind: "ProjectAtRisk",
          text: `${n.basename} — ${n.progresso}% com prazo em ${daysLeft}d`,
        });
      }
    }
  }

  const overdueTasks = tasks
    .filter(
      (t) =>
        !t.done &&
        t.due &&
        toDate(t.due) < toDate(today) &&
        !isRecurringStale(t, today) &&
        t.sourceTipo !== "habito" &&
        !t.sourcePath.includes("/Habitos/")
    )
    .sort(compareTasks)
    .slice(0, 5);

  for (const t of overdueTasks) {
    items.push({
      kind: "MissedDeadline",
      text: `Tarefa atrasada: ${t.text} (${formatDateBR(t.due)})`,
    });
  }

  return dedupeByText(items);
}

function collectCommercial(notes, today) {
  const items = [];
  const horizon = addDays(toDate(today), 7);

  for (const n of notes) {
    if (n.tipo !== "cliente") continue;

    if (n.status === "lead") {
      items.push({
        kind: "LeadQualified",
        text: `${n.basename} — lead aguardando contacto${n.empresa ? ` (${n.empresa})` : ""}`,
      });
    }

    if (n.status === "ativo" && n.proximo_contato) {
      const pc = toDate(n.proximo_contato);
      if (pc <= horizon) {
        const overdue = pc < toDate(today);
        items.push({
          kind: overdue ? "RevenueRiskDetected" : "MeetingScheduled",
          text: `${n.basename} — ${overdue ? "follow-up vencido" : "próximo contacto"} ${formatDateBR(n.proximo_contato)}`,
        });
      }
    }

    if (n.status === "ativo" && n.valor && Number(n.valor) >= 10000 && n.proximo_contato) {
      const pc = toDate(n.proximo_contato);
      if (pc <= addDays(toDate(today), 3)) {
        items.push({
          kind: "RevenueRiskDetected",
          text: `Pipeline em risco: ${n.basename} (R$ ${Number(n.valor).toLocaleString("pt-BR")})`,
        });
      }
    }
  }

  return dedupeByText(items).slice(0, 5);
}

function selectProjectsAttention(notes, today) {
  return notes
    .filter((n) => n.tipo === "projeto" && n.status === "ativo" && !isBlocked(n))
    .map((n) => ({ note: n, score: projectScore(n, today) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ note, score }) => ({
      name: note.basename,
      score,
      prazo: note.prazo,
      progresso: note.progresso,
      area: note.area,
    }));
}

function collectToday(notes, tasks, today) {
  const items = [];

  for (const n of notes) {
    if (n.tipo === "reuniao" && n.data === today) {
      items.push({
        kind: "MeetingScheduled",
        text: n.basename.replace(/^\d{4}-\d{2}-\d{2}\s*/, ""),
        meta: n.cliente ? String(n.cliente).replace(/[\[\]"]/g, "") : "",
      });
    }
  }

  const todayTasks = tasks
    .filter(
      (t) =>
        !t.done &&
        ((t.due && t.due === today) || (t.scheduled && t.scheduled === today))
    )
    .sort(compareTasks);

  const seenToday = new Set();
  for (const t of todayTasks) {
    const key = t.text.toLowerCase();
    if (seenToday.has(key)) continue;
    seenToday.add(key);
    items.push({
      kind: "TaskCreated",
      text: t.text,
    });
  }

  return items;
}

function formatBriefText({ today, top3, risks, commercial, projects, todaySection }) {
  const lines = [];
  lines.push("🌅 JARVIS Morning Brief");
  lines.push(`📆 ${formatDateBR(today)} · ${today}`);
  lines.push("");

  lines.push("🎯 Top 3 Actions");
  if (top3.length === 0) {
    lines.push("• — nenhuma ação crítica para hoje —");
  } else {
    for (const t of top3) {
      lines.push(`${t.rank}. ${t.text}  📅 ${formatDateBR(t.due)}`);
    }
  }
  lines.push("");

  lines.push("⚠ Risks & Blockers");
  if (risks.length === 0) {
    lines.push("• — nada travado —");
  } else {
    for (const r of risks) {
      lines.push(`• ${r.text}`);
    }
  }
  lines.push("");

  lines.push("💼 Commercial Signals");
  if (commercial.length === 0) {
    lines.push("• — sem sinais comerciais urgentes —");
  } else {
    for (const c of commercial) {
      lines.push(`• ${c.text}`);
    }
  }
  lines.push("");

  lines.push("🏗 Projects Requiring Attention");
  if (projects.length === 0) {
    lines.push("• — nenhum projeto prioritário —");
  } else {
    for (const p of projects) {
      const prazo = p.prazo ? ` · prazo ${formatDateBR(p.prazo)}` : "";
      const prog = p.progresso != null ? ` · ${p.progresso}%` : "";
      lines.push(`• ${p.name}${prog}${prazo} (score ${p.score})`);
    }
  }
  lines.push("");

  lines.push("📅 Today");
  if (todaySection.length === 0) {
    lines.push("• — agenda livre —");
  } else {
    for (const item of todaySection) {
      const suffix = item.meta ? ` · ${item.meta}` : "";
      lines.push(`• ${item.text}${suffix}`);
    }
  }

  return lines.join("\n");
}

function formatDependency(dep) {
  if (!dep) return "";
  if (Array.isArray(dep)) return dep.map(stripLink).join(", ");
  return stripLink(String(dep));
}

function stripLink(s) {
  return s.replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/"/g, "");
}

function dedupeByText(items) {
  const seen = new Set();
  return items.filter((i) => {
    if (seen.has(i.text)) return false;
    seen.add(i.text);
    return true;
  });
}
