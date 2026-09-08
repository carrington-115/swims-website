/**
 * Preflight for `pnpm dev`: make this monorepo's three ports available.
 *
 * Turbo starts every app in parallel, so a single occupied port surfaces as a
 * bare `EADDRINUSE` from whichever app happened to lose the race, with no
 * indication of what is holding it. The usual culprit is an orphaned dev server
 * from an earlier run -- turbo tears down its own children when a task fails,
 * but not a process it never started, and closing a terminal leaves them too.
 *
 * An orphan belonging to *this repo* is stale by definition: nothing else could
 * legitimately be running this repo's dev server on this repo's dev port while
 * you are asking for a fresh one. Those are stopped automatically and reported.
 *
 * Anything else -- an unrelated service that happens to sit on 3000 -- is never
 * touched. It is reported, with the command to deal with it, and the run stops.
 *
 * Run automatically as the root `predev` script. `SKIP_PORT_CLEANUP=1` reports
 * without stopping anything.
 */
import { createServer } from 'node:net';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const PORTS = [
  { port: 3000, app: 'website' },
  { port: 3001, app: 'dashboard' },
  { port: 3002, app: 'blogs-api' },
];

const isWindows = process.platform === 'win32';
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cleanupDisabled = process.env.SKIP_PORT_CLEANUP === '1';

/** Windows paths vary in case, and the user's shell may differ from the repo's. */
function normalise(value) {
  return value.replace(/\\/g, '/').toLowerCase();
}

const repoNeedle = normalise(repoRoot);

function isFree(port) {
  return new Promise(resolve => {
    const server = createServer();
    server.once('error', error => resolve(error.code !== 'EADDRINUSE'));
    server.once('listening', () => server.close(() => resolve(true)));
    // The same host Next and Express bind, so the test matches the real thing.
    server.listen(port, '::');
  });
}

/** Best-effort PID lookup. Diagnostics only, so failure is silent. */
function findPid(port) {
  try {
    if (isWindows) {
      const out = execFileSync('netstat', ['-ano'], { encoding: 'utf8' });
      for (const line of out.split('\n')) {
        if (line.includes(`:${port}`) && line.includes('LISTENING')) {
          const pid = line.trim().split(/\s+/).pop();
          if (/^\d+$/.test(pid)) return pid;
        }
      }
      return null;
    }

    const out = execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t'], {
      encoding: 'utf8',
    });
    return out.trim().split('\n')[0] || null;
  } catch {
    return null;
  }
}

/** The process's full command line, or null when it cannot be read. */
function commandLine(pid) {
  try {
    if (isWindows) {
      const out = execFileSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-Command',
          `(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine`,
        ],
        { encoding: 'utf8' },
      );
      return out.trim() || null;
    }

    return execFileSync('ps', ['-o', 'command=', '-p', pid], { encoding: 'utf8' }).trim() || null;
  } catch {
    return null;
  }
}

/**
 * Does this process belong to this checkout?
 *
 * Matched on the repo path appearing in the command line, which covers both
 * `tsx ... src/app.ts` and Next's `start-server.js` because each is launched
 * from this repo's own node_modules. An unreadable command line counts as
 * foreign -- the safe answer when we cannot tell.
 */
function belongsToThisRepo(pid) {
  const command = commandLine(pid);
  return command !== null && normalise(command).includes(repoNeedle);
}

function stop(pid) {
  try {
    if (isWindows) {
      execFileSync('taskkill', ['/PID', pid, '/T', '/F'], { stdio: 'ignore' });
    } else {
      execFileSync('kill', ['-9', pid], { stdio: 'ignore' });
    }
    return true;
  } catch {
    return false;
  }
}

const sleep = ms => new Promise(done => setTimeout(done, ms));

// --- survey -----------------------------------------------------------------
const occupied = [];
for (const entry of PORTS) {
  if (!(await isFree(entry.port))) {
    const pid = findPid(entry.port);
    occupied.push({ ...entry, pid, ours: pid ? belongsToThisRepo(pid) : false });
  }
}

if (occupied.length === 0) process.exit(0);

const ours = occupied.filter(entry => entry.ours);
const foreign = occupied.filter(entry => !entry.ours);

// --- clear our own ----------------------------------------------------------
const stopped = [];
if (ours.length > 0 && !cleanupDisabled) {
  for (const entry of ours) {
    if (stop(entry.pid)) stopped.push(entry);
  }

  // Sockets take a moment to release after the process goes.
  for (let attempt = 0; attempt < 10; attempt++) {
    const remaining = [];
    for (const entry of stopped) {
      if (!(await isFree(entry.port))) remaining.push(entry);
    }
    if (remaining.length === 0) break;
    await sleep(200);
  }

  console.error(
    `Stopped ${stopped.length} stale dev ${stopped.length === 1 ? 'server' : 'servers'} from an ` +
      `earlier run: ${stopped.map(entry => `${entry.app} (pid ${entry.pid}, port ${entry.port})`).join(', ')}.`,
  );
}

// --- anything left is not ours to kill --------------------------------------
const blocked = cleanupDisabled ? occupied : foreign;

if (blocked.length === 0) process.exit(0);

const lines = ['', `Cannot start: ${blocked.length === 1 ? 'a port is' : 'ports are'} in use.`, ''];

for (const { port, app, pid } of blocked) {
  lines.push(`  ${port}  needed by ${app}${pid ? `  -- held by pid ${pid}` : ''}`);
}

lines.push(
  '',
  cleanupDisabled
    ? 'SKIP_PORT_CLEANUP=1 is set, so nothing was stopped automatically.'
    : 'These do not belong to this repo, so they were left alone. Stop them with:',
  '',
);

// One process can hold several of these ports, so the same command would
// otherwise be printed once per port.
const commands = new Set(
  blocked.map(({ port, pid }) =>
    isWindows
      ? `  taskkill /PID ${pid ?? `<pid on ${port}>`} /T /F`
      : `  kill ${pid ?? `$(lsof -tiTCP:${port} -sTCP:LISTEN)`}`,
  ),
);

lines.push(...commands, '');
lines.push('The port each app uses is fixed on purpose -- see the Ports table in AGENTS.md.', '');

console.error(lines.join('\n'));
process.exit(1);
