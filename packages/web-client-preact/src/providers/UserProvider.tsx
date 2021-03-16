import { auth, FireBaseUser } from '@quirk-a-bot/firebase-utils';
import { ComponentChildren, createContext, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export const UserContext = createContext(null as FireBaseUser | null);

interface Props {
	children: ComponentChildren;
}

export default function UserProvider({ children }: Props): JSX.Element {
	const [user, setUser] = useState(null as FireBaseUser | null);

	// on mount, add auth state listener
	useEffect(() => {
		auth.onAuthStateChanged(userAuth => {
			setUser(userAuth);
		});
	}, []);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
