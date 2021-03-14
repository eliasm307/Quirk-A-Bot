import './App.css';



import { CharacterSheet } from '@quirk-a-bot/data-model';

import logo from './logo.svg';

const data = CharacterSheet.newDataObject({ id: '' });

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Editx <code>src/App.js</code> and save to reload.
				</p>
				<p>Charactersheet data: {JSON.stringify(data)}</p>
				<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
