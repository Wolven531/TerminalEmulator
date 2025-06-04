import { useEffect, useState, type FC } from 'react'

export type TerminalEmulatorProps = {
	initialValue?: string | undefined
}

export const TerminalEmulator: FC<TerminalEmulatorProps> = ({
	initialValue = '',
}) => {
	const [text, setText] = useState(initialValue)

	useEffect(() => {
		console.info('[TerminalEmulator] mounted')
	}, [])

	return <>{text}</>
}

export default TerminalEmulator
