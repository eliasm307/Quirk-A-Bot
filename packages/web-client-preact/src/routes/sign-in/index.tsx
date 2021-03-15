import { HTMLAttributes } from 'enzyme';
import { FunctionalComponent, h, JSX } from 'preact';
import { Route, Router, Link } from 'preact-router';
import { useState } from 'preact/hooks';

export default function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const signInWithEmailAndPasswordHandler = (
		event: JSX.TargetedMouseEvent<HTMLButtonElement>,
		email: string,
		password: string
	): void => {
		event.preventDefault();
	};

	const onChangeHandler = (event: JSX.TargetedEvent<HTMLInputElement, Event>): void => {
		const { target } = event;

		if (target instanceof EventTarget) {
			const { name, value } = target as HTMLAttributes;
			switch (name) {
				case 'userEmail':
					return setEmail(value as string);
				case 'userPassword':
					return setPassword(value as string);
				default:
					console.error(`Unknown html event target "${name}"`);
			}
		} else {
			console.warn('Unknown event', { event });
		}
	};

	return (
		<div className="mt-8">
			<h1 className="text-3xl mb-2 text-center font-bold">Sign In</h1>
			<div className="border border-blue-400 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
				{error !== null && <div className="py-4 bg-red-600 w-full text-white text-center mb-3">{error}</div>}
				<form className="">
					<label htmlFor="userEmail" className="block">
						Email:
					</label>
					<input
						type="email"
						className="my-1 p-1 w-full"
						name="userEmail"
						value={email}
						placeholder="E.g: faruq123@gmail.com"
						id="userEmail"
						onChange={onChangeHandler}
					/>
					<label htmlFor="userPassword" className="block">
						Password:
					</label>
					<input
						type="password"
						className="mt-1 mb-3 p-1 w-full"
						name="userPassword"
						value={password}
						placeholder="Your Password"
						id="userPassword"
						onChange={onChangeHandler}
					/>
					<button
						className="bg-green-400 hover:bg-green-500 w-full py-2 text-white"
						onClick={event => {
							signInWithEmailAndPasswordHandler(event, email, password);
						}}
					>
						Sign in
					</button>
				</form>
				<p className="text-center my-3">or</p>
				<button className="bg-red-500 hover:bg-red-600 w-full py-2 text-white">Sign in with Google</button>
				<p className="text-center my-3">
					Don't have an account?{' '}
					<Link href="/sign-up" className="text-blue-500 hover:text-blue-600">
						Sign up here
					</Link>{' '}
					<br />{' '}
					<Link href="/password-reset" className="text-blue-500 hover:text-blue-600">
						Forgot Password?
					</Link>
				</p>
			</div>
		</div>
	);
}
