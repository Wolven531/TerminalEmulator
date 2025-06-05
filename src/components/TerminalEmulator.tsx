import {
	useEffect,
	useMemo,
	useState,
	type CSSProperties,
	type FC,
} from 'react'
import {
	DEFAULT_DELAY_BETWEEN_LINES,
	DEFAULT_DELAY_PER_CHARACTER,
} from '../constants'

export type TerminalEmulatorProps = {
	backgroundColor?: string | undefined
	color?: string | undefined
	cols?: number | undefined
	delayBetweenLines?: number | undefined
	delayPerCharacter?: number | undefined
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
	delayBetweenLines = DEFAULT_DELAY_BETWEEN_LINES,
	delayPerCharacter = DEFAULT_DELAY_PER_CHARACTER,
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

	// this effect is main logic loop of emulator, which renders characters
	// in an async manner
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

		/**
		 * This function waits for a time and then renders provided character
		 * via updating textInfo.currentText
		 *
		 * Note that function is defined inside useEffect because it
		 * requires and manipulates timerId
		 *
		 * @param {string} character Character to render
		 */
		const renderCharacter = async (character: string) => {
			const isNewLine = character === '\n'

			// create and wait for new Promise w/ delay for character, store
			// timerId for clean up purposes
			await new Promise<void>((resolve) => {
				timerId = setTimeout(() => {
					setTextInfo((prior) => ({
						...prior,
						currentText: prior.currentText.concat(character),
					}))

					resolve()
				}, delayPerCharacter)
			})

			if (delayBetweenLines > 0 && isNewLine) {
				clearTimeout(timerId)

				// create and wait for new Promise w/ delay for next line,
				// store timerId for clean up purposes
				await new Promise<void>((resolve) => {
					timerId = setTimeout(() => {
						// do NOT update state here since it is updated above;
						// just resolve promise (since delay time elapsed)
						resolve()
					}, delayBetweenLines)
				})
			}
		}

		const nextCharacter = textInfo.remainingText[0]

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
		// timeouts are cleared (prevents StrictMode errors as well)
		return () => {
			clearTimeout(timerId)
		}
	}, [
		delayBetweenLines,
		delayPerCharacter,
		textInfo.isRunning,
		textInfo.remainingText,
	])

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

export default TerminalEmulator
