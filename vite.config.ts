import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/checkers',
  plugins: [react(),svgr()],
  resolve: {
    alias: {
      'src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
