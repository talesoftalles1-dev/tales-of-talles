---
tipo: doc
status: ativo
area: 70 Sistema
criado: 2026-07-02
atualizado: 2026-07-02
tags: [n8n, credenciais, onboarding]
---

# Inventário de Credenciais — n8n Self-Host

Estas são as credenciais necessárias para o self-host funcionar. Configura uma vez na UI do n8n (`http://localhost:5678 → Credentials → New`). Os nomes têm de corresponder EXACTAMENTE — os workflows já os referenciam por nome.

---

## 1 · Anthropic x-api-key

| Campo | Valor |
|---|---|
| **Tipo** | Header Auth |
| **Nome da credencial** | `Anthropic x-api-key` |
| **Header Name** | `x-api-key` |
| **Header Value** | `sk-ant-api03-...` |

Usada por: workflows `05`, `06`, `07` (visão dos coaches).

---

## 2 · Notion API

| Campo | Valor |
|---|---|
| **Tipo** | Notion API |
| **Nome da credencial** | `Notion API` |
| **Internal Integration Token** | `secret_...` |

Usada por: workflow `08` (Diário do Camp).

**Passo extra:** No Notion, abre a base de dados `📔 Diário do Camp` → `···` → `Add connections` → seleciona a integração.

---

## 3 · Microsoft OneDrive

| Campo | Valor |
|---|---|
| **Tipo** | Microsoft OneDrive OAuth2 |
| **Nome da credencial** | `Microsoft OneDrive` |
| **Client ID** | *(App registration Azure)* |
| **Client Secret** | *(App registration Azure)* |
| **Scope** | `Files.ReadWrite.All offline_access` |

Usada por: workflow `08` (nó Vault OneDrive — 3 uploads por dia).

**Como criar a App registration (5 min):**
1. portal.azure.com → Azure Active Directory → App registrations → New registration
2. Nome: `n8n-jarvis`, Supported account types: `Personal Microsoft accounts only`
3. Redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
4. Copia o **Application (client) ID**
5. Certificates & secrets → New client secret → copia o valor
6. API permissions → Add → Microsoft Graph → `Files.ReadWrite.All` → Grant admin consent

---

## 4 · OneDrive Folder IDs (pós-OAuth)

Após conectar a credencial Microsoft OneDrive, descobre os IDs das pastas de destino:

**Método rápido — n8n:**
1. Cria um workflow temporário: `Manual Trigger → Microsoft OneDrive (resource=folder, operation=getChildren, folderId="root")`
2. Executa — verás os itens na raiz do OneDrive com os seus IDs
3. Navega até `Documents/Jarvis/20 Pessoal/Saude/` repetindo com o `id` de cada pasta
4. Copia os 3 IDs finais

**Pastas de destino:**

| Pasta vault | Substitui no workflow `08` |
|---|---|
| `Documents/Jarvis/20 Pessoal/Saude/Treinos/` | `PREENCHER_ID_ONEDRIVE_TREINOS` |
| `Documents/Jarvis/20 Pessoal/Saude/Nutricao/` | `PREENCHER_ID_ONEDRIVE_NUTRICAO` |
| `Documents/Jarvis/20 Pessoal/Saude/Corporal/` | `PREENCHER_ID_ONEDRIVE_CORPORAL` |

Após ter os IDs, edita o nó `Projeção Vault` no workflow `08` e substitui os 3 placeholders.

---

## Resumo: O que tens de inserir

| # | O quê | Quando |
|---|---|---|
| 1 | Anthropic API key | Antes de ativar coaches (01–07) |
| 2 | Notion Integration Token | Antes de ativar sync (08) |
| 3 | OneDrive OAuth2 | Antes de ativar vault sync (08) |
| 4 | 3 Folder IDs no nó Projeção Vault | Após conectar OneDrive |
| 5 | WEBHOOK_URL no `.env` | Se usar túnel/domínio público |
