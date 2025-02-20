import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'istanbul',
        reportOnFailure: true,
        reporter: ['text', 'json', 'html'],
        reportsDirectory: 'dist/SortLab/coverage', // Setzt das Coverage-Verzeichnis auf den richtigen Pfad
      },
    },
  }),
)
