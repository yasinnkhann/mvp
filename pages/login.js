import Head from 'next/head';
import styled from 'styled-components';
import { auth, provider } from '../firebaseConfig.js';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import GoogleButton from 'react-google-button';

export default function login() {
	const signIn = () => {
		signInWithPopup(auth, provider)
			.then(res => {
				const credential = GoogleAuthProvider.credentialFromResult(res);
				const token = credential.accessToken;
				const user = res.user;
			})
			.catch(err => console.error(err));
	};

	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>

			<LoginContainer>
				<AolLogo src='https://cdn.worldvectorlogo.com/logos/aol-instant-messenger.svg' />
				<GoogleButton onClick={signIn} />
			</LoginContainer>
		</Container>
	);
}

const Container = styled.div`
	display: grid;
	place-items: center;
	height: 100vh;
	background-color: whitesmoke;
`;

const LoginContainer = styled.div`
	padding: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: white;
	border-radius: 5px;
	box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const AolLogo = styled.img`
	height: 200px;
	width: 200px;
	margin-bottom: 50px;
`;
