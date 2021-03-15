import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import SignIn from '../routes/sign-in';
import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFoundPage from '../routes/notfound';
import Header from './header';

const App: FunctionalComponent = () => {
	const user = null;

	return (
		<div id="app">
			<Header />
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
	);
};

export default App;
