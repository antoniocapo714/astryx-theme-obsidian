import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'test',
  testMatch: /.*\.e2e\.ts/,
  use: { baseURL: 'http://localhost:4300' },
  webServer: {
    command: 'bunx vite build demo && bunx vite preview demo --port 4300 --strictPort',
    url: 'http://localhost:4300',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } }],
})
