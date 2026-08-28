import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        bench: resolve(process.cwd(), 'bench.html'),
        v0208: resolve(process.cwd(), 'v0208.html')
      }
    }
  }
});
