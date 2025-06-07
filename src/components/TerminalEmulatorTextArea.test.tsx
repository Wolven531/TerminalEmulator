import { waitFor } from '@testing-library/react'
import { render } from 'vitest-browser-react'
import {
	TerminalEmulatorTextArea,
	type TerminalEmulatorTextAreaProps,
} from './TerminalEmulatorTextArea'

describe('TerminalEmulatorTextArea', () => {
	const defaultProps: TerminalEmulatorTextAreaProps = {
		value: '',
	}

	it('renders w/ default props w/o crashing', () => {
		expect(() => {
			render(<TerminalEmulatorTextArea {...defaultProps} />)
		}).not.toThrow()
	})

	it('renders provided text properly one letter at a time', async () => {
		const totalText = 'sOmE uLtImAtE eNd ValUe'

		const { getByRole } = render(
			<TerminalEmulatorTextArea value={totalText} />,
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

	it('renders provided lines properly one letter at a time', async () => {
		const totalText = ['Welcome', 'Glad to see you', '.....'].join('\n')

		const { getByRole } = render(
			<TerminalEmulatorTextArea
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
