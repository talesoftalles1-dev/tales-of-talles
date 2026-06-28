# Dashboard (Dataview)

## Projetos ativos
```dataview
table status, due, file.link as Project
from "wiki/projects"
where contains(status, "active") or !status
sort due asc
```

## Tarefas pendentes (global)
```dataview
task from "wiki"
where !completed
sort file.path
```

## Últimos Dailies
```dataview
table file.mtime as Updated, file.link as Daily
from "wiki/daily"
sort file.name desc
limit 10
```

## Resumo do Tracking (últimos 7 dias)
```dataview
table date, sum(duration) as "Total (min)"
from "wiki/tracking"
where date >= date(today) - dur(7 days)
group by date
sort date desc
```
