# Terminal Emulator

## Run example app

1. `npm i`
1. `npm run dev`

## Test codebase

1. `npm i`
1. `npm test`

## How I Setup This Repo

1. `npm create vite@latest terminal-emulator`
    - Follow prompts for a React + TypeScript project (no SWC needed)
2. `cd terminal-emulator`
3. `npm i axios sass-embedded --save`
4. `npm install @testing-library/react @vitest/browser @vitest/coverage-v8 axios-mock-adapter playwright vitest vitest-browser-react --save-dev`
5. Update `vite.config.ts` w/ test info

```typescript
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
```

6. Add types for compiler to `tsconfig.node.json` and `tsconfig.app.json` (inside `compilerOptions` in each file, just beneath `skipLibCheck` - add the line below)

```json
    "types": ["vitest/globals"],
```

7. Add basic test file sibling to component file
    1. Duplicate component file
    1. Change extension on new file from `.tsx` to `.test.tsx`
    1. Replace file contents with below code

```typescript
import { render } from 'vitest-browser-react'
import {
	TerminalEmulator,
	type TerminalEmulatorProps,
} from './TerminalEmulator'

describe('TerminalEmulator', () => {
	const defaultProps: TerminalEmulatorProps = {
		// initialValue: undefined,
	}

	it('renders w/ default props w/o crashing', () => {
		expect(() => {
			render(<TerminalEmulator {...defaultProps} />)
		}).not.toThrow()
	})
})
```
