import { type FC } from 'react'
import { TerminalEmulator } from './components/TerminalEmulator'

// styles
import './App.css'

const initialLines = [
	'Welcome, sir or madam',
	'Loading interface..........',
	'Started up successfully',
]

export const App: FC = () => {
	return (
		<>
			<h3>App</h3>
			<TerminalEmulator value={initialLines.join('\n')} />
		</>
	)
}

export default App
