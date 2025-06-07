import {
	useEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type FC,
} from 'react'
import {
	DEFAULT_DELAY_BETWEEN_LINES,
	DEFAULT_DELAY_PER_CHARACTER,
} from '../constants'

export type TerminalEmulatorTextAreaProps = {
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
	value: string | string[]
}

export const TerminalEmulatorTextArea: FC<TerminalEmulatorTextAreaProps> = ({
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
	// --- hooks and ref values first
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// create the normalized value first, as everything relies on this
	const normalizedValue = useMemo(
		() => (Array.isArray(value) ? value.join('\n') : value),
		[value],
	)

	// --- stateful values after hooks and refs
	const [textInfo, setTextInfo] = useState({
		currentText: initialValue,
		isRunning,
		remainingText: normalizedValue,
	})

	// --- memo values after stateful values

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

	// --- effect values last (other than constants)

	// this effect ensures that when initialValue prop or normalizedValue are changed,
	// everything except isRunning is reset
	useEffect(() => {
		setTextInfo((prior) => {
			const isBeingAppended = normalizedValue.startsWith(
				prior.currentText,
			)
			const startInd = isBeingAppended ? prior.currentText.length : 0
			const remainingText = normalizedValue.substring(startInd)

			return {
				...prior,
				currentText: isBeingAppended ? prior.currentText : initialValue,
				remainingText,
			}
		})
	}, [initialValue, normalizedValue])

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

		const nextCharacter = textInfo.remainingText?.[0]

		if (nextCharacter) {
			renderCharacter(nextCharacter).finally(() => {
				// scroll to bottom of textarea
				if (textareaRef.current) {
					textareaRef.current.scrollTop =
						textareaRef.current.scrollHeight
				}

				// after async render finishes, update remainingText
				setTextInfo((prior) => ({
					...prior,
					remainingText:
						prior.remainingText.length > 1
							? prior.remainingText.substring(1)
							: '',
				}))
			})
		}

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
			ref={textareaRef}
			rows={rows}
			style={mergedStyle}
			value={textInfo.currentText}
		/>
	)
}

export default TerminalEmulatorTextArea
