import {
	useEffect,
	useMemo,
	useState,
	type CSSProperties,
	type FC,
} from 'react'

export type TerminalEmulatorProps = {
	backgroundColor?: string | undefined
	color?: string | undefined
	cols?: number | undefined
	delay?: number | undefined
	fontFamily?: string | undefined
	fontSize?: string | number | undefined
	initialValue?: string | undefined
	isRunning?: boolean | undefined
	letterSpacing?: string | number | undefined
	lineHeight?: string | number | undefined
	padding?: string | number | undefined
	readOnly?: boolean | undefined
	rows?: number | undefined
	style?: CSSProperties | undefined
	value: string
}

export const TerminalEmulator: FC<TerminalEmulatorProps> = ({
	backgroundColor = '#222',
	color = '#0ff',
	cols = 80,
	delay = DELAY_PER_CHARACTER,
	fontFamily = 'monospace',
	fontSize = '1em',
	initialValue = '',
	isRunning = true,
	letterSpacing = 4,
	lineHeight = '2em',
	padding = 8,
	readOnly = true,
	rows = 10,
	style = {},
	value,
}) => {
	const [textInfo, setTextInfo] = useState({
		currentText: initialValue,
		isRunning,
		remainingText: value,
	})

	// this memoized value ensures styles are kept in sync w/ prop updates
	const mergedStyle = useMemo(
		() => ({
			backgroundColor,
			color,
			fontFamily,
			fontSize,
			letterSpacing,
			lineHeight,
			padding,
			...style,
		}),
		[
			backgroundColor,
			color,
			fontFamily,
			fontSize,
			letterSpacing,
			lineHeight,
			padding,
			style,
		],
	)

	// this effect ensures that when initialValue or value props are changed,
	// everything except isRunning is reset
	useEffect(() => {
		setTextInfo((prior) => ({
			...prior,
			currentText: initialValue,
			remainingText: value,
		}))
	}, [initialValue, value])

	// this effect ensures that when isRunning prop is changed, isRunning state
	// stays synced
	useEffect(() => {
		setTextInfo((prior) => ({
			...prior,
			isRunning,
		}))
	}, [isRunning])

	// this effect is the main logic loop of the emulator, which renders
	// characters in an async manner
	useEffect(() => {
		if (!textInfo.isRunning) {
			return
		}

		if (textInfo.remainingText.length < 1) {
			setTextInfo((prior) => ({
				...prior,
				isRunning: false,
			}))
			return
		}

		let timerId: NodeJS.Timeout
		const nextCharacter = textInfo.remainingText[0]
		const renderCharacter = async (character: string) => {
			// create and wait for new Promise w/ delay for character, store
			// timerId for clean up purposes
			await new Promise<void>((resolve) => {
				timerId = setTimeout(() => {
					setTextInfo((prior) => ({
						...prior,
						currentText: prior.currentText.concat(character),
					}))

					resolve()
				}, delay)
			})
		}

		renderCharacter(nextCharacter).finally(() => {
			// after async render finishes, update remainingText
			setTextInfo((prior) => ({
				...prior,
				remainingText:
					prior.remainingText.length > 1
						? prior.remainingText.substring(1)
						: '',
			}))
		})

		// this clean up function ensures that if re-render occurs, any pending
		// character timeouts are cleared (prevents StrictMode errors as well)
		return () => {
			clearTimeout(timerId)
		}
	}, [delay, textInfo.isRunning, textInfo.remainingText])

	return (
		<textarea
			cols={cols}
			readOnly={readOnly}
			rows={rows}
			style={mergedStyle}
			value={textInfo.currentText}
		/>
	)
}

const DELAY_PER_CHARACTER = 50

export default TerminalEmulator
