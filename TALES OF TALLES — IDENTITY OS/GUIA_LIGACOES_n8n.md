# 🔗 Ligações n8n — TALES OF TALLES

Tu não precisas de mexer no n8n. Está tudo montado, **ativo e testado** por mim.

## ✅ 4 agentes a funcionar (1 workflow por coach) — SEM precisar de chave nenhuma

Cada um recebe o teu estado do dia e devolve a fala do coach. Já os testei e responderam certo:

| Agente | Workflow | Webhook |
|---|---|---|
| 🧑‍🍳 Sanji (Nutrição) | TALES · Sanji | `/webhook/tales-sanji` |
| 🦾 Cariani (Biomecânica) | TALES · Cariani | `/webhook/tales-cariani` |
| 🩺 Muzy (Recuperação) | TALES · Muzy | `/webhook/tales-muzy` |
| 🥊 Ilia (Striking) | TALES · Ilia | `/webhook/tales-ilia` |

Base: `https://talesoftalles.app.n8n.cloud`. O app já está ligado: quando abres o Camp,
ele pergunta aos 4 agentes no n8n e usa a resposta deles no Corner Team. Se o n8n estiver
fora do ar, o app usa a inteligência local na hora (nunca fica em branco).

**Não tens de fazer nada para estes funcionarem.** Já estão ativos.

## ⭐ Workflow extra (opcional) — Sanji lê a foto da nota por IA

Há um 5º workflow, `TALES · Sanji lê a nota (Vision)`, que usa o Claude para LER a foto do
talão do mercado. Esse — e SÓ esse — precisa da tua chave da Anthropic, porque envolve a IA real:

1. Abre o workflow → nó **Claude Vision** → cria credencial **Header Auth** `Anthropic x-api-key`
   (Name: `x-api-key`, Value: a tua `sk-ant-…` de console.anthropic.com).
2. Já está ativo; assim que adicionares a chave, o botão "🔍 Ler nota com IA" no app funciona.

Se não adicionares a chave, a leitura da nota cai no modo manual (marcar o que compraste) —
que funciona à mesma.

## ⭐ Workflow extra — Visão Ilia/Cariani (avaliação por foto/vídeo)

`TALES · Visão (Ilia/Cariani)` (`/webhook/tales-vision`) — já ativo. As avaliações por foto/vídeo
do app agora vão por aqui (deixaram de chamar a Anthropic diretamente do telemóvel). Usa a **mesma
credencial** `Anthropic x-api-key` do workflow da nota — adicionas a chave uma vez e serve os dois.

## 💾 Backup (novo no app)
Na aba **Carreira → 💾 BACKUP & SAÚDE**: Exportar (guarda um JSON com todo o teu progresso),
Importar (restaura) e **Health Check** (mostra se armazenamento, IndexedDB, n8n e PWA estão OK).
Exporta de vez em quando — é o teu seguro.

## 🔧 Se mudares de instância n8n
Cola o novo endereço no painel **🔗 LIGAÇÕES** na página Camp do app. Mais nada.
