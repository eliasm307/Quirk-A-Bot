import { auth } from '@quirk-a-bot/firebase-utils';
import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import { useContext } from 'preact/hooks';
import { UserContext } from '../../providers/UserProvider';
import style from './style.css';

const Header: FunctionalComponent = () => {
	const user = useContext(UserContext);

	return (
		<header style={{ display: 'block' }} class={style.header}>
			<h1>Preact App</h1>
			<nav>
				<Link activeClassName={style.active} href="/">
					Home
				</Link>
				<Link activeClassName={style.active} href="/profile">
					Me
				</Link>
				<Link activeClassName={style.active} href="/profile/john">
					John
				</Link>
				{user && <button onClick={() => auth.signOut()}>Sign Out</button>}
			</nav>
		</header>
	);
};

export default Header;
