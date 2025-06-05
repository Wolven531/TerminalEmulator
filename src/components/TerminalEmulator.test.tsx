import { act } from 'react'
import { render, type RenderResult } from 'vitest-browser-react'
import {
	TerminalEmulator,
	type TerminalEmulatorProps,
} from './TerminalEmulator'

describe('TerminalEmulator', () => {
	const defaultProps: TerminalEmulatorProps = {
		value: '',
	}

	it.only('renders w/ default props w/o crashing', () => {
		expect(() => {
			render(<TerminalEmulator {...defaultProps} />)
		}).not.toThrow()
	})

	it('renders provided text properly', async () => {
		// vitest.useFakeTimers()

		let renderResult: RenderResult | null = null

		await act(async () => {
			renderResult = render(
				<TerminalEmulator value="sOmE iNiTiAl ValUe" />,
			)

			// await vitest.runOnlyPendingTimersAsync()
			// await vitest.runAllTimersAsync()

			// await vitest.advanceTimersByTimeAsync(5000)
		})

		// await act(async () => {
		// 	await vitest.runOnlyPendingTimersAsync()
		// 	await vitest.runAllTimersAsync()
		// 	await vitest.advanceTimersByTimeAsync(5000)

		// 	vitest.useRealTimers()
		// })

		// vitest.runAllTimers()
		// vitest.run

		expect(renderResult).not.toBeNull()

		const { getByRole } = renderResult as unknown as RenderResult

		const textBox = getByRole('textbox')

		expect(textBox).toBeVisible()
		expect(textBox).toHaveValue('sOmE iNiTiAl ValUe')

		// vitest.useRealTimers()
	})
})
