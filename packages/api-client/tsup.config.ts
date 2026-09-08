import { defineConfig } from "tsup";

/*
 * `clean` is off in watch mode on purpose.
 *
 * `turbo run dev` starts every package's dev task in parallel, so this watcher
 * comes up at the same moment as the apps that consume it. tsup's watch startup
 * wipes dist/ before its first rebuild, and anything resolving this package at
 * import time would hit that window and die with MODULE_NOT_FOUND. Overwriting
 * the files in place leaves no window.
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
  external: ["@swims/schemas"],
}));
