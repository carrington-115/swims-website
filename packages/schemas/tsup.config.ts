import { defineConfig } from "tsup";

// Dual CJS + ESM output is load-bearing here: the Blogs API compiles to
// CommonJS with classic node resolution, while the Next apps resolve with
// "bundler". The package.json also keeps legacy main/module/types fields,
// because node10 resolution does not read the "exports" map.
//
// Without "type": "module" in package.json, tsup writes CJS to index.js and
// ESM to index.mjs. The exports map has to name those exact files -- it
// previously claimed an index.cjs that is never emitted, which meant every
// `require("@swims/schemas")` failed and the API could not boot.

/*
 * `clean` is off in watch mode on purpose.
 *
 * `turbo run dev` starts every package's dev task in parallel, so this watcher
 * and the Blogs API boot at the same moment. tsup's watch startup wipes dist/
 * before its first rebuild, and the API -- which requires
 * @swims/schemas/dist/index.js at import time -- would hit that window and die
 * with MODULE_NOT_FOUND. Overwriting the files in place leaves no window.
 *
 * A one-shot `build` still cleans, which is where a stale artifact would
 * actually matter.
 */
export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: !options.watch,
  treeshake: true,
  target: "es2020",
}));
