/* =======================
   VITE
   ======================= */

import { defineConfig } from 'vite';

/* === MULTIPÁGINA (TODA PÁGINA NOVA ENTRA AQUI E NO SITEMAP.XML) === */
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        principal: 'index.html',
        portfolio: 'portfolio/index.html',
        depoimentos: 'depoimentos/index.html',
        erro: '404.html',
      },
    },
  },
});
