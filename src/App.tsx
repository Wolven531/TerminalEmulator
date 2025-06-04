import { type FC } from 'react'
import { TerminalEmulator } from './components/TerminalEmulator'

// styles
import './App.css'

export const App: FC = () => {
	return (
		<>
			<h3>App</h3>
			<TerminalEmulator />
		</>
	)
}

export default App
