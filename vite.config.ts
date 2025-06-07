/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		browser: {
			enabled: true,
			instances: [{ browser: 'chromium' }],
			provider: 'playwright',
			ui: true,
		},
		coverage: {
			enabled: true,
			exclude: [
				'test-utils.tsx',
				'src/main.tsx',
				'src/App.tsx',
				'**/*.d.ts',
				'**/*.config.{js,ts}',
			],
			thresholds: {
				branches: 75,
				functions: 75,
				lines: 75,
				statements: 75,
			},
		},
		globals: true,
	},
})
