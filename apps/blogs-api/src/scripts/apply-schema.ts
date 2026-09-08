/**
 * Applies a SQL file to the linked Supabase project.
 *
 * The keys in `.env` cannot do this. `sb_secret_…` is a PostgREST API key: it
 * reads and writes rows through the REST layer and has no way to issue DDL.
 * Running `create table` needs either a Postgres connection (which means the
 * database password) or the Management API (which means a personal access
 * token). This script takes the second, because it needs no driver and no
 * network route to port 5432 -- just `fetch`.
 *
 *   1. Create a token at https://supabase.com/dashboard/account/tokens
 *   2. Put it in apps/blogs-api/.env as SUPABASE_ACCESS_TOKEN=sbp_...
 *      (.env is gitignored -- confirmed)
 *   3. pnpm --filter swims-blogs-api db:apply            # schema.sql
 *      pnpm --filter swims-blogs-api db:apply migrations/0002_….sql
 *
 * The token is account-wide, so it is worth deleting again once the schema is
 * in place. Everything in `schema.sql` is `if not exists` / `or replace` /
 * `drop policy if exists`, so applying it twice changes nothing.
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getSupabaseEnv } from '../env';

const MANAGEMENT_API = 'https://api.supabase.com';

/** `https://abcdefgh.supabase.co` -> `abcdefgh` */
function projectRef(url: string): string {
  const host = new URL(url).hostname;
  const ref = host.split('.')[0];

  if (!ref || ref === 'localhost') {
    throw new Error(`Could not read a project ref out of SUPABASE_URL (${url}).`);
  }

  return ref;
}

async function main() {
  const env = getSupabaseEnv();
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();

  if (!token) {
    console.error(
      'SUPABASE_ACCESS_TOKEN is not set.\n\n' +
        'The API keys in .env cannot create tables -- they are REST keys. To\n' +
        'apply SQL from here, create a personal access token at\n' +
        '  https://supabase.com/dashboard/account/tokens\n' +
        'and add it to apps/blogs-api/.env as:\n' +
        '  SUPABASE_ACCESS_TOKEN=sbp_...\n\n' +
        'Or paste the SQL into the dashboard SQL editor, which needs no token.',
    );
    process.exit(1);
  }

  if (!token.startsWith('sbp_')) {
    console.error(
      'SUPABASE_ACCESS_TOKEN does not look like a personal access token ' +
        '(sbp_...).\nA project API key will not work here: the Management API ' +
        'authenticates the account, not the project.',
    );
    process.exit(1);
  }

  const relativePath = process.argv[2] ?? 'schema.sql';
  const file = resolve(__dirname, '../../supabase', relativePath);

  let sql: string;
  try {
    sql = readFileSync(file, 'utf8');
  } catch {
    console.error(`Could not read ${file}`);
    process.exit(1);
  }

  const ref = projectRef(env.SUPABASE_URL);
  const statements = sql.split(';').filter(part => part.trim()).length;

  console.log(`\nApplying supabase/${relativePath}`);
  console.log(`  to project   ${ref}`);
  console.log(`  ${sql.split('\n').length} lines, roughly ${statements} statements\n`);

  const response = await fetch(`${MANAGEMENT_API}/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  const body = await response.text();

  if (!response.ok) {
    console.error(`Failed (${response.status}):\n${body}\n`);
    if (response.status === 401) {
      console.error('That token was rejected. Check it has not been revoked.');
    }
    process.exit(1);
  }

  console.log('Applied.\n');
  console.log('Next:');
  console.log('  pnpm --filter swims-blogs-api schema     # what the project now has');
  console.log('  pnpm --filter swims-blogs-api check:db   # expect all green\n');
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
