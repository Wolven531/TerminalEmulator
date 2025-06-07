import { useEffect, useState, type FC } from 'react'
import { TerminalEmulatorTextArea } from './TerminalEmulatorTextArea'

export type TerminalEditorProps = {
	isRunning?: boolean | undefined
	lines: string | string[]
	onLinesChanged?: (updatedLines: string) => void
	onRunningChanged?: (updatedIsRunningState: boolean) => void
}

export const TerminalEditor: FC<TerminalEditorProps> = ({
	isRunning: isRunningProp = true,
	lines: linesProp,
	onLinesChanged,
	onRunningChanged,
}) => {
	const [isRunning, setIsRunning] = useState(isRunningProp)
	const [lines, setLines] = useState(
		Array.isArray(linesProp) ? linesProp.join('\n') : linesProp,
	)
	const [newLine, setNewLine] = useState<string>('')

	const addLine = () => {
		if (newLine.length < 1) {
			return
		}

		const updatedLines = lines.concat('\n', newLine)

		setNewLine('')
		setLines(updatedLines)
		onLinesChanged?.(updatedLines)
	}

	const toggleRunning = () => {
		const updatedIsRunningState = !isRunning

		setIsRunning(updatedIsRunningState)
		onRunningChanged?.(updatedIsRunningState)
	}

	// this effect keeps the current lines value synced w/ linesProp
	useEffect(() => {
		setLines(Array.isArray(linesProp) ? linesProp.join('\n') : linesProp)
	}, [linesProp])

	return (
		<div>
			<TerminalEmulatorTextArea
				isRunning={isRunning}
				value={lines}
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					marginTop: 24,
					maxWidth: 250,
				}}
			>
				<input
					onChange={(evt) => {
						setNewLine(evt.currentTarget.value)
					}}
					onKeyUp={(evt) => {
						if (evt.key === 'Enter') {
							addLine()
						}
					}}
					placeholder="new line text"
					value={newLine}
				/>
				<button onClick={addLine}>Add Line</button>
				<button onClick={toggleRunning}>
					{isRunning ? 'Pause' : 'Resume'}
				</button>
			</div>
		</div>
	)
}

export default TerminalEditor
