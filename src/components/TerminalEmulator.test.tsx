import { waitFor } from '@testing-library/react'
import { render } from 'vitest-browser-react'
import {
	TerminalEmulator,
	type TerminalEmulatorProps,
} from './TerminalEmulator'

describe('TerminalEmulator', () => {
	const defaultProps: TerminalEmulatorProps = {
		value: '',
	}

	it('renders w/ default props w/o crashing', () => {
		expect(() => {
			render(<TerminalEmulator {...defaultProps} />)
		}).not.toThrow()
	})

	it('renders provided text properly one letter at a time', async () => {
		const totalText = 'sOmE uLtImAtE eNd ValUe'

		const { getByRole } = render(<TerminalEmulator value={totalText} />)

		const textBox = getByRole('textbox')

		expect(textBox).toBeVisible()

		// ensure <= is used to include final character
		for (let a = 0; a <= totalText.length; a++) {
			await waitFor(() => {
				expect(textBox).toHaveValue(totalText.substring(0, a))
			})
		}

		expect(textBox).toHaveValue(totalText)
	})

	it('renders provided lines properly one letter at a time', async () => {
		const totalText = ['Welcome', 'Glad to see you', '.....'].join('\n')

		const { getByRole } = render(
			<TerminalEmulator
				delayBetweenLines={25}
				value={totalText}
			/>,
		)

		const textBox = getByRole('textbox')

		expect(textBox).toBeVisible()

		// ensure <= is used to include final character
		for (let a = 0; a <= totalText.length; a++) {
			await waitFor(() => {
				expect(textBox).toHaveValue(totalText.substring(0, a))
			})
		}

		expect(textBox).toHaveValue(totalText)
	})
})
