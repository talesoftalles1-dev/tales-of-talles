---
tipo: doc
status: publicado
area: sistema
criado: 2026-07-02
atualizado: 2026-07-02
tags: [n8n, self-host, onboarding, launch]
---

# JARVIS n8n — Launch Package

> Objectivo: Docker instalado + credenciais inseridas = sistema funcional em menos de 30 min.

---

## Pré-requisitos

- [ ] Windows com Docker Desktop instalado (`winget install Docker.DockerDesktop` — requer admin + reinício)
- [ ] Acesso à conta Microsoft (OneDrive pessoal com o vault sincronizado)
- [ ] Chaves: Anthropic API key + Notion Integration Token

---

## Passo 1 — Preparar o `.env`

```powershell
cd "C:\Users\talle\OneDrive\Documents\Jarvis\70 Sistema\Automacao\n8n-selfhost"
Copy-Item .env.example .env
```

Edita o `.env`:
1. Gera a chave de cifra: `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`
2. Cola em `N8N_ENCRYPTION_KEY=`
3. (Opcional) Se tiveres domínio/túnel: descomenta `WEBHOOK_URL=https://...` e `N8N_PROXY_HOPS=1`

---

## Passo 2 — Iniciar o n8n

```powershell
docker compose up -d
```

Aguarda ~20 s e abre `http://localhost:5678`. Cria a conta de owner (email + password — fica local, não sai da máquina).

---

## Passo 3 — Importar os workflows

```powershell
docker compose exec n8n n8n import:workflow --separate --input=/workflows
```

9 workflows importados (8 coaches/sync + 1 Morning Brief). Verificação: menu Workflows → deves ver a lista com todos inativos.

---

## Passo 4 — Inserir credenciais

Segue o guia em `CREDENTIALS.md`. Ordem mínima:

1. `Anthropic x-api-key` (Header Auth)
2. `Notion API` (Internal Integration Token)
3. `Microsoft OneDrive` (OAuth2 — ver guia para criar App registration)
4. Após OneDrive conectado: descobrir os 3 Folder IDs e editar o nó `Projeção Vault` no workflow `08`

---

## Passo 5 — Ativar workflows

Activa apenas o que tens credenciais:

| Workflow | Credencial necessária | Activar agora? |
|---|---|---|
| 01 Ilia (boxe) | nenhuma | ✅ |
| 02 Muzy (recuperação) | nenhuma | ✅ |
| 03 Cariani (musculação) | nenhuma | ✅ |
| 04 Sanji (nutrição) | nenhuma | ✅ |
| 05–07 Visão | Anthropic | Após inserir key |
| 08 Sync Notion + Vault | Notion API + OneDrive | Após inserir ambas |

---

## Passo 6 — Apontar o PWA ao self-host

No Tales of Talles app → card **🔗 Ligações · n8n** → cola `http://localhost:5678` (ou o URL do túnel) → **Guardar**.

Para acesso externo (iPhone/fora de casa): instala o túnel Cloudflare:
```powershell
winget install --id Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:5678
```
Copia o `https://<algo>.trycloudflare.com`, atualiza `WEBHOOK_URL` no `.env`, reinicia: `docker compose restart`.

---

## Passo 7 — Testar

1. Abre o Tales of Talles app → termina uma sessão → clica **SYNC**
2. Verifica no Notion: nova linha no `📔 Diário do Camp`
3. Verifica no vault: `20 Pessoal/Saude/Treinos/`, `Nutricao/`, `Corporal/` — nova nota com `fonte: apex`

---

## Estrutura de ficheiros

```
n8n-selfhost/
├── docker-compose.yml      ← runtime (não editar)
├── .env.example            ← template (copiar para .env)
├── .env                    ← segredos (não commitar)
├── LAUNCH-PACKAGE.md       ← este ficheiro
├── CREDENTIALS.md          ← guia de credenciais
├── README.md               ← documentação detalhada
├── import-workflows.ps1    ← script de import (alternativa ao CLI)
├── start-local.ps1         ← npm path (bloqueado no Node 26)
└── workflows/
    ├── 01-tales-ilia.json
    ├── 02-tales-muzy.json
    ├── 03-tales-cariani.json
    ├── 04-tales-sanji.json
    ├── 05-tales-vision.json
    ├── 06-tales-meal-vision.json
    ├── 07-tales-sanji-vision.json
    └── 08-tales-notion-sync.json   ← Notion + Vault OneDrive
```

---

## O que falta depois do launch

| Item | Estado |
|---|---|
| Morning Brief · Slack delivery | Reconectar OAuth no n8n (`70 Sistema/Automacao/_Morning Brief — Runbook.md`) |
| OneDrive folder IDs | Descobrir via workflow temporário (ver CREDENTIALS.md §4) |
| WEBHOOK_URL | Preencher se usar túnel ou domínio fixo |
| Yalt · Cowork integration | Ver `30 Empresa/Yalt/_Integrações Yalt.md` |
