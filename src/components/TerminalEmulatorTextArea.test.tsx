import { waitFor } from '@testing-library/react'
import { render } from 'vitest-browser-react'
import { LONG_TEST_TIMEOUT } from '../../test-utils'
import {
	TerminalEmulatorTextArea,
	type TerminalEmulatorTextAreaProps,
} from './TerminalEmulatorTextArea'

describe('TerminalEmulatorTextArea', () => {
	const defaultProps: TerminalEmulatorTextAreaProps = {
		delayPerCharacter: 10,
		value: '',
	}

	it('renders w/ default props w/o crashing', () => {
		expect(() => {
			render(<TerminalEmulatorTextArea {...defaultProps} />)
		}).not.toThrow()
	})

	it('renders w/ collection of strings w/o crashing', () => {
		expect(() => {
			render(
				<TerminalEmulatorTextArea
					{...defaultProps}
					value={['first line', 'second line']}
				/>,
			)
		}).not.toThrow()
	})

	it('renders when not running w/o crashing', () => {
		expect(() => {
			render(
				<TerminalEmulatorTextArea
					{...defaultProps}
					isRunning={false}
					value={['first line', 'second line']}
				/>,
			)
		}).not.toThrow()
	})

	it('rerenders w/ long strings w/o crashing', async () => {
		const { getByRole, rerender } = render(
			<TerminalEmulatorTextArea
				{...defaultProps}
				value={
					"This is the song that never ends. Yes it goes on and on, my friends. Some people started singing it not knowing what it was, but they'll continue singing it forever just because..."
				}
			/>,
		)

		await waitFor(
			() => {
				expect(getByRole('textbox')).toHaveValue(
					'This is the song that never ends. Yes it goes on and on, my friends. Some people started singing it not',
				)
			},
			{
				timeout: LONG_TEST_TIMEOUT,
			},
		)

		rerender(
			<TerminalEmulatorTextArea
				{...defaultProps}
				value={
					"This is the song that never ends. Yes it goes on and on, my friends. Some people started singing it not knowing what it was, but they'll continue singing it forever just because..."
				}
			/>,
		)

		await waitFor(
			() => {
				expect(getByRole('textbox')).toHaveValue(
					"This is the song that never ends. Yes it goes on and on, my friends. Some people started singing it not knowing what it was, but they'll continue singing it forever just because...",
				)
			},
			{
				timeout: LONG_TEST_TIMEOUT,
			},
		)
	})

	it('rerenders w/ brand new value running w/o crashing', async () => {
		const { getByRole, rerender } = render(
			<TerminalEmulatorTextArea
				{...defaultProps}
				value={'first render'}
			/>,
		)

		await waitFor(() => {
			expect(getByRole('textbox')).toHaveValue('first re')
		})

		rerender(
			<TerminalEmulatorTextArea
				{...defaultProps}
				value={'second'}
			/>,
		)

		await waitFor(() => {
			expect(getByRole('textbox')).toHaveValue('second')
		})
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

	it('renders provided lines properly one letter at a time w/ delay between lines', async () => {
		const totalText = ['Welcome', 'Glad to see you', '.....'].join('\n')

		const { getByRole } = render(
			<TerminalEmulatorTextArea
				delayBetweenLines={10}
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
