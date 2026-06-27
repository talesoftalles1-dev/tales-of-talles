// sample/scripts/external_id.js
// Utility to generate a deterministic external_id for Vault notes
// based on repo path + note ID (e.g., file name without extension)
const crypto = require('crypto');
const path = require('path');
/**
 * Generate external_id hash
 * @param {string} repoRoot Absolute path to the repository root
 * @param {string} notePath Relative path to the note inside the repo
 * @returns {string} SHA‑256 hex string (first 12 chars) used as external_id
 */
function generateExternalId(repoRoot, notePath) {
  const absolute = path.resolve(repoRoot, notePath);
  const hash = crypto.createHash('sha256').update(absolute).digest('hex');
  // Shorten for readability – still unique enough for our scale
  return hash.substring(0, 12);
}
// Example usage (for testing)
if (require.main === module) {
  const repoRoot = process.argv[2] || process.cwd();
  const notePath = process.argv[3];
  if (!notePath) {
    console.error('Usage: node external_id.js <repoRoot> <notePath>');
    process.exit(1);
  }
  console.log('external_id:', generateExternalId(repoRoot, notePath));
}
module.exports = { generateExternalId };
