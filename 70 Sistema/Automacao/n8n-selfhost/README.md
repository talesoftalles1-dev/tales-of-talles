---
tipo: doc
status: publicado
categoria: sistema
area: sistema
criado: 2026-06-29
atualizado: 2026-06-29
relacionado:
  - "[[n8n Audit Report — 2026-06-29]]"
  - "[[Chapter 27 — Automations & n8n Bridge]]"
tags: [n8n, self-host, migracao]
---

# Migração n8n Cloud → Self-Hosted (TALES)

**Porquê:** o trial do n8n Cloud (`talesoftalles.app.n8n.cloud`) expirou — todas as execuções falham na plataforma. Self-host resolve sem custo. Ver [[n8n Audit Report — 2026-06-29]].

**O que está nesta pasta (pronto a usar):**
| Ficheiro | Função |
|---|---|
| `workflows/*.json` | Os 8 workflows exportados (timeout+retry; credenciais pré-ligadas por nome). |
| `.env` | Config + **chave de cifra já gerada** (não comitar). |
| `docker-compose.yml` | **Caminho recomendado** — self-host via Docker (local ou VM grátis). |
| `start-local.ps1` | npm (só funciona com Node 20/22 LTS + build tools — ver aviso abaixo). |
| `import-workflows.ps1` | Importa os 8 workflows via CLI. |

**Verificação feita (2026-06-29):** a lógica dos 4 coaches + nó de visão foi executada em Node contra o payload real do PWA → **5/5 OK** (ex.: Muzy=`RECUPERAR`@38%, Cariani=`CUIDADO` PEITO 80%). Os ficheiros também passaram na validação de schema do n8n. **A lógica migrada está correta**; falta apenas o runtime.

> ⚠️ **Esta máquina não corre o n8n por npm.** O `npm install -g n8n` falhou a compilar o módulo nativo `isolated-vm` (sandbox do nó Code) — não há Visual Studio Build Tools e o Node v26 é mais recente do que o n8n suporta (20/22). Por isso o **caminho recomendado é Docker** (imagem pré-compilada, sem compilação nativa).

---

## Caminho A — Docker (recomendado, sem compilação nativa)

**A1. Local** (depois de instalar o Docker Desktop — `winget install Docker.DockerDesktop`, requer admin + reinício):
```powershell
cd "70 Sistema/Automacao/n8n-selfhost"
docker compose up -d
docker compose exec n8n n8n import:workflow --separate --input=/workflows
```
Editor em `http://localhost:5678`.

**A2. VM grátis sempre-ligada (Oracle Cloud "Always Free" — sem cobrança):** cria a VM Ubuntu, instala Docker, copia esta pasta, define no `.env` o `WEBHOOK_URL=https://<dominio-ou-ip>/` e `N8N_PROXY_HOPS=1`, e `docker compose up -d`. Põe um reverse-proxy com HTTPS automático à frente (Caddy: 2 linhas). Alternativas com plano grátis: **Render / Railway / Fly.io** (imagem `docker.n8n.io/n8nio/n8n`, volume persistente, mesmas variáveis do `.env`).

---

## Caminho B — npm (só se evitares os bloqueios desta máquina)

Funciona **apenas** com:
1. **Node 20 ou 22 LTS** (não o 26). Instala com `nvm-windows` ou o instalador LTS.
2. Se mesmo assim o `isolated-vm` falhar, instala **Visual Studio Build Tools** (workload "Desktop development with C++").

Depois: `./start-local.ps1` (instala o n8n e arranca em `http://localhost:5678`); importa com `./import-workflows.ps1` (com o servidor parado) ou pela UI.

---

## Expor ao público (grátis, sem cartão) — Cloudflare Quick Tunnel

O PWA (GitHub Pages, HTTPS) não alcança `localhost`. Túnel rápido dá um URL HTTPS público:
```powershell
winget install --id Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:5678
```
Copia o `https://<algo>.trycloudflare.com`, põe-no no `.env` como `WEBHOOK_URL=https://<algo>.trycloudflare.com/`, **reinicia** o n8n (regista os webhooks nesse URL). Senão: o URL muda a cada reinício — mas o PWA repõe-se em 5 s (passo seguinte). Para URL estável → túnel nomeado (precisa de domínio) ou host do Caminho A2.

---

## Credenciais (uma vez, no self-host)

- **Anthropic** → *Credentials → New → "Header Auth"* · **Name: `Anthropic x-api-key`** · Header Name: `x-api-key` · Value: `sk-ant-...`. Os 3 workflows de visão já apontam para este nome → ligam-se sozinhos.
- **Notion** → *New → "Notion API"* · **Name: `Notion API`** · Internal Integration Token; partilha a base de dados do Diário com a integração.

## Apontar o PWA

App → card **🔗 Ligações · n8n** → cola o URL (do túnel/host) em *ENDEREÇO BASE DO n8n* → **Guardar** (fica em `localStorage`, sem redeploy). Para default permanente: troca `N8N_DEFAULT` em `index.html` (~linha 6129).

## Ativar e testar
Ativa os 4 coaches (sem credenciais) + os workflows que usas. Testa no app. Os `path` dos webhooks são preservados — só muda o domínio base.

## Segurança (antes de reativar os proxies de visão)
Os 3 webhooks de visão são abertos e gastam créditos Anthropic se descobertos. Protege com *Header Auth* (segredo partilhado) no nó Webhook e envia o header a partir do PWA. CORS: podes apertar de `*` para `https://talesoftalles1-dev.github.io`.

## Notas
- O 9º workflow do Cloud ("AI Agent workflow") é um scaffold vazio/inativo e **não** foi migrado.
- A chave Anthropic e o token Notion **não** foram extraídos do Cloud (segredos) — re-introduz uma vez.
- A `N8N_ENCRYPTION_KEY` no `.env` cifra as credenciais: **faz-lhe backup**.
