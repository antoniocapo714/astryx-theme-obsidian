import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  // GitHub Pages serves the demo under /<repo>/; the workflow sets DEMO_BASE.
  base: process.env.DEMO_BASE ?? '/',
  plugins: [react()],
  // Astryx themes ship as @scope rules. The default CSS minifier (esbuild)
  // drops @scope at-rules without a warning, and the theme disappears from the
  // production build. Lightning CSS keeps them.
  build: { cssMinify: 'lightningcss', cssTarget: ['chrome118', 'safari17', 'firefox128'] },
})
