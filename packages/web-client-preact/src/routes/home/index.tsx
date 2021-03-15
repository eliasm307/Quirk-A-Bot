import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import { CharacterSheet } from '@quirk-a-bot/data-model';

const Home: FunctionalComponent = () => {
	const csData = CharacterSheet.newDataObject({ id: 'preactTest' });
	console.warn({ csData });
	return (
		<div class={style.home}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			<pre>{JSON.stringify(csData, null, 2)}</pre>
		</div>
	);
};

export default Home;
