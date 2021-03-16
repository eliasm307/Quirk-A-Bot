import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import SignIn from '../routes/sign-in';
import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFoundPage from '../routes/not-found';
import Header from './header';
import { useContext } from 'preact/hooks';
import { UserContext } from '../providers/UserProvider';

export default function App() {
	const user = useContext(UserContext);

	return (
		<div id="app">
			<Header />
			<div style={{ marginTop: 100 }}>
				{user ? (
					<Router>
						<Route path="/" component={Home} />
						<Route path="/profile/" component={Profile} user="me" />
						<Route path="/profile/:user" component={Profile} />
						<NotFoundPage default />
					</Router>
				) : (
					<SignIn />
				)}
			</div>
		</div>
	);
}
