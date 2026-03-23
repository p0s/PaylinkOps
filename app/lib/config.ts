export const AppConfig = {
  storePath: '.local/state.json',
  demoModeDefault: 'demo' as const,
  cliBinary: 'mp',
  cliBinaryCandidates: [
    '.local/npm-global/bin/mp',
    '/opt/homebrew/bin/mp',
    'mp',
  ],
  cliTimeoutMs: 20000,
  receiptsRetentionLimit: 500,
  ledgerSyncTolerance: 0.000001,
};
