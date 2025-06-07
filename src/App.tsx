import type { FC } from 'react'
import { TerminalEditor } from './components/TerminalEditor'
// import { TerminalEmulatorTextArea } from './components/TerminalEmulatorTextArea'
// import { FancyTerminalEmulator } from './components/FancyTerminalEmulator'

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
			<TerminalEditor lines={initialLines} />
			{/* <TerminalEmulatorTextArea value={initialLines} /> */}
			{/* <FancyTerminalEmulator value={initialLines} /> */}
		</>
	)
}

export default App
