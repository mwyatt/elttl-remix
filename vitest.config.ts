import {defineConfig} from 'vitest/config'
import path from "node:path";

export default defineConfig({
  test: {
    root: ".",
    environment: 'node',
    setupFiles: ["app/test/setup-env.ts"],
    include: ['app/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    globals: true,
    maxWorkers: 1,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/**/*.{js,ts,jsx,tsx}'],
      exclude: ['**/*.d.ts', 'build/**']
    }
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "~": path.resolve(__dirname, "app"),
      "@": path.resolve(__dirname, "app")
    },
  }
})