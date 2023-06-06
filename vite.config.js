// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        about: new URL("./pages/about/index.html", import.meta.url).pathname,
        product: new URL("./pages/product/index.html", import.meta.url)
          .pathname,
        contact: new URL("./pages/contact/index.html", import.meta.url)
          .pathname,
      },
    },
  },
});
