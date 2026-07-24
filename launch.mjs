// Habitica MCP launcher — managed by the AuDHD-support lane (jay / Stashay).
// Do NOT put your token in this file. It loads your Habitica credentials from a
// secret note kept OUTSIDE the Cowork working folder, sets them as environment
// variables, then starts the real server in this same process (over the same stdio).
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// --- paths (edit only if you move things) ---
const SECRET_FILE  = 'C:/Users/Anna/Obsidian/private/00 secrets/habitica-token.md';
const SERVER_ENTRY = 'C:/dev_anna/forks/habitica-mcp-server/index.js';
// --------------------------------------------

let raw;
try {
  raw = readFileSync(SECRET_FILE, 'utf8');
} catch {
  console.error(
    `[habitica-launcher] Could not read the secret file at:\n  ${SECRET_FILE}\n` +
    `Create it with exactly two lines:\n` +
    `  HABITICA_USER_ID=your-user-id\n  HABITICA_API_TOKEN=your-api-token`
  );
  process.exit(1);
}

// Parse KEY=VALUE lines (blank lines and #-comments are ignored).
for (const line of raw.split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  const key = t.slice(0, eq).trim();
  const val = t.slice(eq + 1).trim();
  if (key) process.env[key] = val;
}

process.env.MCP_LANG ??= 'en';

// Hand off to the real server (it sets up the MCP stdio transport itself).
await import(pathToFileURL(SERVER_ENTRY).href);
