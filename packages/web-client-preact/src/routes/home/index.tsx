import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import { CharacterSheet } from '@quirk-a-bot/data-model';
import { UserContext } from '../../providers/UserProvider';
import { useContext } from 'preact/hooks';
import Router, { Link } from 'preact-router';
import { FireBaseUser } from '@quirk-a-bot/firebase-utils/src';

export default function Home() {
	const user = useContext(UserContext);
	const { photoURL, displayName, email } = user as FireBaseUser;
	const csData = CharacterSheet.newDataObject({ id: 'preactTest' });

	console.warn({ csData });
	return (
		<div class={style.home}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			{user ? (
				<div>
					<p>User signed in</p>
					<h2 className="text-2xl font-semibold">Display Name: {displayName}</h2>
					<h3 className="italic">Email: {email}</h3>
					<h3 className="italic">photoLink: {photoURL}</h3>
				</div>
			) : (
				<p>User not signed in</p>
			)}
			<pre>{JSON.stringify(csData, null, 2)}</pre>
		</div>
	);
}
