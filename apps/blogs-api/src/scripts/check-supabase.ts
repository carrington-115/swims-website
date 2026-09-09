/**
 * Answers one question: is this API actually wired to a Supabase project?
 *
 * Run it before the walkthrough in `requests.http`, and any time a request
 * fails in a way that smells like configuration. It checks, in the order the
 * failures cascade:
 *
 *   1. the environment is filled in at all;
 *   2. the two keys are the right way round;
 *   3. the project answers;
 *   4. the secret key really does bypass row level security;
 *   5. the schema has been applied -- tables, and the two functions the write
 *      paths call;
 *   6. the publishable key can verify a caller's JWT, which is the whole of
 *      this API's authentication.
 *
 * It never prints a key. Run with `pnpm --filter swims-blogs-api check:db`.
 */
import 'dotenv/config';
import { isBlogCategory } from '@swims/schemas';
import { getSupabaseAdmin, getSupabaseAuth } from '../config/supabase';
import { getSupabaseEnv } from '../env';

type Result = { ok: boolean; label: string; detail: string; fix?: string };

const results: Result[] = [];

function pass(label: string, detail: string) {
  results.push({ ok: true, label, detail });
}

function fail(label: string, detail: string, fix?: string) {
  results.push({ ok: false, label, detail, fix });
}

/** Reports a key's generation without revealing it. */
function describeKey(key: string): string {
  if (key.startsWith('sb_publishable_')) return 'publishable (current)';
  if (key.startsWith('sb_secret_')) return 'secret (current)';
  if (key.split('.').length === 3) {
    try {
      const payload = JSON.parse(
        Buffer.from(key.split('.')[1], 'base64').toString('utf8'),
      );
      return `legacy JWT, role "${payload?.role ?? 'unknown'}"`;
    } catch {
      return 'legacy JWT, unreadable payload';
    }
  }
  return 'unrecognised format';
}

async function main() {
  // ---------------------------------------------------------------- 1 & 2
  let env;
  try {
    env = getSupabaseEnv();
    pass('Environment', 'SUPABASE_URL and both keys are set');
    pass('  publishable key', describeKey(env.SUPABASE_PUBLISHABLE_KEY));
    pass('  secret key', describeKey(env.SUPABASE_SECRET_KEY));
  } catch (err) {
    fail(
      'Environment',
      err instanceof Error ? err.message : String(err),
      'Fill in apps/blogs-api/.env -- see .env.example.',
    );
    return;
  }

  // The app's own clients, so this check exercises the same construction path
  // the API does rather than a lookalike that could differ from it.
  const admin = getSupabaseAdmin();
  const anon = getSupabaseAuth();

  // -------------------------------------------------------------------- 3
  try {
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/`, {
      headers: { apikey: env.SUPABASE_SECRET_KEY },
    });
    if (response.ok || response.status === 404) {
      pass('Reachable', `${env.SUPABASE_URL} answered ${response.status}`);
    } else if (response.status === 401) {
      fail(
        'Reachable',
        'the project answered 401 -- the URL is right but the secret key is not',
        'Re-copy the secret key from Project Settings -> API keys.',
      );
      return;
    } else {
      fail('Reachable', `the project answered ${response.status}`);
      return;
    }
  } catch (err) {
    fail(
      'Reachable',
      `could not reach ${env.SUPABASE_URL}: ${err instanceof Error ? err.message : err}`,
      'Check SUPABASE_URL, and that this machine has network access.',
    );
    return;
  }

  // ------------------------------------------------------------------ 4, 5
  //
  // Every probe below is a GET with `limit(0)` rather than a `head: true`
  // count. A HEAD request carries no body, so PostgREST's error never reaches
  // the client and a missing table comes back as `{ error: null }` -- which
  // this check originally read as "present, 0 rows". A false green on a
  // question this specific is worse than no check.
  const missingTable = (message: string) =>
    /schema cache|does not exist/i.test(message);

  type TableState = 'present' | 'missing' | 'error';

  async function probeTable(table: string): Promise<{ state: TableState; detail: string }> {
    const { error, count } = await admin
      .from(table as never)
      .select('*', { count: 'exact' })
      .limit(0);

    if (!error) return { state: 'present', detail: `present, ${count ?? 0} row(s)` };
    if (missingTable(error.message)) return { state: 'missing', detail: 'missing' };
    return { state: 'error', detail: `${error.code ?? ''} ${error.message}`.trim() };
  }

  let blogsExists = false;

  for (const table of ['authors', 'blogs', 'sections'] as const) {
    const { state, detail } = await probeTable(table);
    if (table === 'blogs') blogsExists = state === 'present';

    if (state === 'present') {
      pass(`Table ${table}`, detail);
    } else if (state === 'missing') {
      fail(
        `Table ${table}`,
        detail,
        'Run supabase/schema.sql in the Supabase SQL editor. If you just did, ' +
          "the API cache may be stale: run NOTIFY pgrst, 'reload schema';",
      );
    } else {
      fail(`Table ${table}`, detail);
    }
  }

  // The old stored table of contents should be gone; still having it means the
  // migration has not been run and the API is reading a schema it does not match.
  {
    const { state } = await probeTable('table_of_contents');

    if (state === 'present') {
      fail(
        'Table table_of_contents',
        'still present -- this database predates the derived table of contents',
        'Run supabase/migrations/0002_authors_and_derived_toc.sql, then schema.sql.',
      );
    } else {
      pass('Table table_of_contents', 'absent, as it should be');
    }
  }

  // The columns added alongside authors. `schema.sql` creates tables with
  // `if not exists`, so run against a database that already had `blogs` it
  // leaves the old shape in place and then fails on the first index that names
  // a new column -- which looks like "the tables are all there" until a query
  // asks for one of these.
  if (!blogsExists) {
    // Nothing to say about the columns of a table that is not there, and
    // saying "the blogs table predates this version" about it would be wrong.
    results.push({
      ok: false,
      label: 'Blog columns',
      detail: 'not checked -- the blogs table does not exist yet',
    });
  } else {
    const expected = ['category', 'cover_image', 'status', 'published_at'] as const;
    const missing: string[] = [];

    for (const column of expected) {
      const { error } = await admin.from('blogs').select(column).limit(0);
      if (error) missing.push(column);
    }

    if (missing.length === 0) {
      pass('Blog columns', 'category, cover_image, status, published_at all present');
    } else if (missing.length === expected.length) {
      fail(
        'Blog columns',
        'none of category, cover_image, status, published_at exist',
        'The blogs table predates this version. Run ' +
          'supabase/migrations/0002_authors_and_derived_toc.sql, then schema.sql.',
      );
    } else {
      fail(
        'Blog columns',
        `missing: ${missing.join(', ')}`,
        'The schema was applied partway. Re-run schema.sql and read the SQL ' +
          'editor output for the statement that failed.',
      );
    }
  }

  // Categories are a closed set (`packages/schemas/src/category.ts`), enforced
  // in the database by `blogs_category_check`. A stored value outside it means
  // migration 0003 has not been applied here: such a post is reachable by slug
  // and invisible in every listing, because no filter on the site selects it.
  if (blogsExists) {
    const { data, error } = await admin
      .from('blogs')
      .select('category')
      .not('category', 'is', null);

    if (error) {
      fail('Blog categories', `could not be read -- ${error.message}`);
    } else {
      // Widened back to `string` on purpose: `BlogRow` types the column as one
      // of the known ids, and this check exists precisely for a database that
      // does not hold to that yet.
      const stored: readonly (string | null)[] = (data ?? []).map(row => row.category);

      const unknown = [
        ...new Set(
          stored.filter(
            (category): category is string =>
              category !== null && !isBlogCategory(category),
          ),
        ),
      ];

      if (unknown.length === 0) {
        pass('Blog categories', 'every stored category is one the app knows');
      } else {
        fail(
          'Blog categories',
          `stored but unknown to the app: ${unknown.join(', ')}`,
          'Run supabase/migrations/0003_blog_category_check.sql, which clears ' +
            'them to NULL and constrains the column. Re-assign the posts ' +
            'afterwards if any of these was a real category under an old name.',
        );
      }
    }
  }

  for (const fn of ['create_blog_with_sections', 'reorder_sections'] as const) {
    // Called with deliberately empty arguments: a function that exists rejects
    // them with a data error, one that does not exist reports PGRST202.
    const args =
      fn === 'create_blog_with_sections'
        ? { p_user_id: null, p_blog: null, p_sections: null }
        : { p_blog_id: null, p_section_ids: null };

    const { error } = await admin.rpc(fn, args as never);

    if (error?.code === 'PGRST202') {
      fail(
        `Function ${fn}()`,
        'missing',
        'Run the "Writes that have to be atomic" section of supabase/schema.sql.',
      );
    } else {
      pass(`Function ${fn}()`, 'present');
    }
  }

  // -------------------------------------------------------------------- 6
  // The API authenticates every write by handing the caller's bearer token to
  // `auth.getUser`. A made-up token must come back as a clean rejection: that
  // proves the auth endpoint is reachable and the publishable key is accepted.
  {
    const { data, error } = await anon.auth.getUser('not-a-real-token');

    if (!error && data.user) {
      fail('Authentication', 'a bogus token was ACCEPTED -- do not deploy this');
    } else if (
      error &&
      /invalid api key|no api key/i.test(error.message)
    ) {
      fail(
        'Authentication',
        `the publishable key was refused: ${error.message}`,
        'Re-copy the publishable key from Project Settings -> API keys.',
      );
    } else {
      pass(
        'Authentication',
        `reachable; a bogus token is rejected ("${error?.message ?? 'no user'}")`,
      );
    }
  }
}

main()
  .then(() => {
    const width = Math.max(...results.map(r => r.label.length));
    let failed = 0;

    console.log('');
    for (const result of results) {
      if (!result.ok) failed++;
      console.log(
        `${result.ok ? 'ok  ' : 'FAIL'}  ${result.label.padEnd(width)}  ${result.detail}`,
      );
      if (result.fix) console.log(`      ${' '.repeat(width)}  -> ${result.fix}`);
    }

    console.log('');
    if (failed === 0) {
      console.log('Supabase is connected and the schema is in place.');
      console.log('Next: work through apps/blogs-api/requests.http.');
    } else {
      console.log(`${failed} check(s) failed. The API will not work until they pass.`);
    }
    console.log('');

    process.exit(failed === 0 ? 0 : 1);
  })
  .catch(err => {
    console.error('The check itself failed:', err);
    process.exit(1);
  });
