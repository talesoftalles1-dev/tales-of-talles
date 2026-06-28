# Projects — MOC

## Projetos abertos
```dataview
table status, due, file.link as Project
from "wiki/projects"
where !contains(status, "done")
sort due asc
```
