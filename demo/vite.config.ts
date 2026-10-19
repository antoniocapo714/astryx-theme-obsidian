import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  // GitHub Pages serves the demo under /<repo>/; the workflow sets DEMO_BASE.
  base: process.env.DEMO_BASE ?? '/',
  plugins: [
    react(),
    // Publish the repository's llms.txt with the showcase, from the one source.
    { name: 'llms-txt', closeBundle: () => copyFileSync(new URL('../llms.txt', import.meta.url), new URL('./dist/llms.txt', import.meta.url)) },
  ],
  // Astryx themes ship as @scope rules. The default CSS minifier (esbuild)
  // drops @scope at-rules without a warning, and the theme disappears from the
  // production build. Lightning CSS keeps them.
  build: { cssMinify: 'lightningcss', cssTarget: ['chrome118', 'safari17', 'firefox128'] },
})
