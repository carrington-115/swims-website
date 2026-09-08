/**
 * Prints the schema as the live Supabase project actually has it.
 *
 * Source is PostgREST's own OpenAPI document at `/rest/v1/`, which is built
 * from the database catalog. That makes it the authority on the question that
 * matters here -- not "what does schema.sql say", but "what can this API
 * actually see" -- and it is also what goes stale when the schema cache needs
 * reloading, so an empty listing here and a populated one in the SQL editor
 * localises the problem precisely.
 *
 * Run with `pnpm --filter swims-blogs-api schema`. It never prints a key.
 */
import 'dotenv/config';
import { getSupabaseEnv } from '../env';

type OpenApiProperty = {
  type?: string;
  format?: string;
  description?: string;
  maxLength?: number;
};

type OpenApiDefinition = {
  required?: string[];
  properties?: Record<string, OpenApiProperty>;
};

type OpenApiDocument = {
  definitions?: Record<string, OpenApiDefinition>;
  paths?: Record<string, unknown>;
};

/** The tables and functions this version of the API expects to find. */
const EXPECTED_TABLES = ['authors', 'blogs', 'sections'] as const;
const EXPECTED_FUNCTIONS = ['create_blog_with_sections', 'reorder_sections'] as const;
/** Dropped in 0002. Its presence means the migration has not been run. */
const RETIRED_TABLES = ['table_of_contents'] as const;

async function main() {
  const env = getSupabaseEnv();

  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: env.SUPABASE_SECRET_KEY,
      authorization: `Bearer ${env.SUPABASE_SECRET_KEY}`,
      accept: 'application/openapi+json',
    },
  });

  if (!response.ok) {
    console.error(`Could not read the schema: ${env.SUPABASE_URL} answered ${response.status}`);
    process.exit(1);
  }

  const doc = (await response.json()) as OpenApiDocument;
  const definitions = doc.definitions ?? {};
  const tables = Object.keys(definitions).sort();

  // PostgREST exposes a function as a POST path under /rpc/.
  const functions = Object.keys(doc.paths ?? {})
    .filter(path => path.startsWith('/rpc/'))
    .map(path => path.slice('/rpc/'.length))
    .sort();

  console.log(`\nSchema at ${env.SUPABASE_URL}\n${'='.repeat(60)}`);

  if (tables.length === 0) {
    console.log('\nNo tables are exposed. The schema has not been applied.');
  }

  for (const table of tables) {
    const definition = definitions[table];
    const properties = definition.properties ?? {};
    const required = new Set(definition.required ?? []);
    const names = Object.keys(properties);
    const width = Math.max(...names.map(n => n.length), 1);

    console.log(`\n${table}`);
    for (const name of names) {
      const property = properties[name];
      const type = property.format ?? property.type ?? 'unknown';
      // PostgREST records keys and foreign keys in the description.
      const note = property.description?.replace(/\s+/g, ' ').trim() ?? '';
      // PostgREST states the foreign key twice: once in prose and once as an
      // <fk .../> element it uses itself. Read the element, which is the
      // structured one, and drop the prose rather than printing raw markup.
      const fk = /<fk table='([^']+)' column='([^']+)'\s*\/>/.exec(note);

      const flags = [
        required.has(name) ? 'not null' : '',
        /Primary Key/i.test(note) ? 'PK' : '',
        fk ? `FK -> ${fk[1]}.${fk[2]}` : '',
      ]
        .filter(Boolean)
        .join(', ');

      console.log(`  ${name.padEnd(width)}  ${type.padEnd(26)}${flags}`);
    }
  }

  console.log(`\n${'-'.repeat(60)}\nFunctions`);
  if (functions.length === 0) {
    console.log('  (none)');
  }
  for (const fn of functions) {
    console.log(`  ${fn}()`);
  }

  console.log(`\n${'-'.repeat(60)}\nAgainst what this API expects`);

  for (const table of EXPECTED_TABLES) {
    console.log(`  ${tables.includes(table) ? 'ok     ' : 'MISSING'}  table ${table}`);
  }
  for (const table of RETIRED_TABLES) {
    console.log(
      `  ${tables.includes(table) ? 'STALE  ' : 'ok     '}  table ${table} (should be absent)`,
    );
  }
  for (const fn of EXPECTED_FUNCTIONS) {
    console.log(`  ${functions.includes(fn) ? 'ok     ' : 'MISSING'}  function ${fn}()`);
  }

  const unexpected = tables.filter(
    t =>
      !EXPECTED_TABLES.includes(t as (typeof EXPECTED_TABLES)[number]) &&
      !RETIRED_TABLES.includes(t as (typeof RETIRED_TABLES)[number]),
  );
  if (unexpected.length > 0) {
    console.log(`\n  Also exposed, and not part of this API: ${unexpected.join(', ')}`);
  }

  console.log('');
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
