/**
 * The long-running host: bind a port, report why if that fails, shut down
 * cleanly.
 *
 * None of this applies on Vercel, where the platform owns the socket and hands
 * each request to the function in `api/index.ts`. That is the whole reason the
 * wiring lives in `app.ts` and the listen lives here.
 */
import { createApp } from './app';
import { getCorsOrigins, getPort, isProduction } from './env';

const app = createApp();
const port = getPort();

/*
 * Without this, a taken port surfaces as an unhandled EADDRINUSE stack trace
 * with no hint of which service is squatting on it -- which is exactly the
 * failure the fixed port map exists to make legible.
 */
let bindFailed = false;

function onListenError(error: NodeJS.ErrnoException) {
  bindFailed = true;

  if (error.code !== 'EADDRINUSE') throw error;

  console.error(
    [
      '',
      `Port ${port} is already in use, so the Blogs API did not start.`,
      '',
      'The monorepo pins one port per app: 3000 website, 3001 dashboard,',
      '3002 blogs-api. Something else is on this one. Find it with:',
      `  netstat -ano | findstr :${port}`,
      '',
    ].join('\n'),
  );
  process.exit(1);
}

export const server = app.listen(port);

// Registered before `listening` so a bind that fails immediately is handled
// whichever order the two events arrive in.
server.on('error', onListenError);

server.on('listening', () => {
  /*
   * Deferred by a tick, and skipped if the bind then fails.
   *
   * A dual-stack bind on Windows can emit `listening` for one family and
   * `error` for the other, which printed "listening on 3002" immediately above
   * "port 3002 is already in use" -- the two lines contradicting each other on
   * the one occasion the message matters. `onListenError` exits the process,
   * so when the bind really failed this callback never runs.
   */
  setImmediate(() => {
    if (bindFailed) return;

    console.log(
      `Blogs API listening on port ${port} (${isProduction() ? 'production' : 'development'})`,
    );
    console.log(`CORS origins: ${getCorsOrigins().join(', ')}`);
  });
});

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    console.log(`${signal} received, shutting down`);
    server.close(() => process.exit(0));
  });
}

export default app;
