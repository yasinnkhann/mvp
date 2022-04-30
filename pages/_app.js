import '../styles/globals.css';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './login.js';
import Loading from '../components/Loading.js';
import { auth, db } from '../firebaseConfig.js';
import { doc, setDoc, serverTimestamp } from '@firebase/firestore';

export default function MyApp({ Component, pageProps }) {
	const [user, loading] = useAuthState(auth);

	useEffect(() => {
		const updateUsers = async () => {
			if (user) {
				await setDoc(
					doc(db, 'users', user.uid),
					{
						email: user.email,
						lastSeen: serverTimestamp(),
						photoURL: user.photoURL,
					},
					{ merge: true }
				);
			}
		};
		updateUsers();
	}, [user]);

	if (loading) {
		return <Loading />;
	}

	if (!user) {
		return <Login />;
	}

	return <Component {...pageProps} />;
}
