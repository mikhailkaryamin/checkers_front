/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const isMobile = mode === 'mobile';

  return {
    base: isMobile ? './' : '/checkers',
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        'src': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.tsx',
      css: false,
      include: ['**/*.test.{js,ts,jsx,tsx}'],
    }
  }
})
