import { defineConfig } from "tsup";

// Dual CJS + ESM output is load-bearing here: the Blogs API compiles to
// CommonJS with classic node resolution, while the Next apps resolve with
// "bundler". The package.json also keeps legacy main/module/types fields,
// because node10 resolution does not read the "exports" map.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2020",
});
