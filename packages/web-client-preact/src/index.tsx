import './style/index.css';
import App from './components/app';
import UserProvider from './providers/UserProvider';
import { h, JSX } from 'preact';

export default function Root() {
  let x;

	return (
		<UserProvider>
			<App />
		</UserProvider>
	);
}
