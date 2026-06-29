/**
 * Logger de operação do JARVIS Morning Brief.
 *
 * A instrumentação de debug da sessão gsd-debug (POST para 127.0.0.1:7575 +
 * debug-<sessao>.log na raiz do vault) foi REMOVIDA para deixar a produção
 * limpa. `logDebug` e `initDebugLog` permanecem como no-ops para não quebrar
 * os call sites existentes. O log operacional real vive em logs/<data>.log
 * (ver appendRunLog em generate.mjs).
 */

export function initDebugLog() {
  /* no-op em produção */
}

export function logDebug() {
  /* no-op em produção — telemetria de debug removida */
}

export function logInfo(message) {
  const ts = new Date().toISOString();
  process.stderr.write(`[${ts}] ${message}\n`);
}
