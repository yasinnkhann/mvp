import { Avatar, Button } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import SearchIcon from '@material-ui/icons/Search';
import Chat from './Chat.js';
import { auth, db } from '../firebaseConfig.js';
import { collection, query, where, addDoc } from '@firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Sidebar() {
	const [user] = useAuthState(auth);

	const userChatRef = query(
		collection(db, 'chats'),
		where('users', 'array-contains', user?.email)
	);

	const [chatsSnapshot] = useCollection(userChatRef);

	const chatAlreadyExists = recipientEmail =>
		!!chatsSnapshot?.docs.find(
			chat =>
				chat.data().users.find(user => user === recipientEmail)?.length > 0
		);

	const addUsers = async () => {
		const input = prompt(
			'Please enter the email of whom you wish to speak to:'
		);

		if (!input) {
			return;
		}

		if (
			EmailValidator.validate(input) &&
			!chatAlreadyExists(input) &&
			input !== user.email
		) {
			await addDoc(collection(db, 'chats'), {
				users: [user.email, input],
			});
		}
	};

	return (
		<Container>
			<Header>
				<UserAvatar src={user.photoURL} onClick={() => signOut(auth)} />
				{/* <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} /> */}
			</Header>

			<Search>
				<SearchInput placeholder='Search in chat...' />
				<SearchIcon />
			</Search>

			<SidebarButton onClick={addUsers}>Start a new chat</SidebarButton>

			{chatsSnapshot?.docs.map(chat => (
				<Chat key={chat.id} id={chat.id} users={chat.data().users} />
			))}
		</Container>
	);
}

const Container = styled.div`
	flex: 0.45;
	border-right: 1px solid whitesmoke;
	height: 100vh;
	min-width: 300px;
	max-width: 350px;
	overflow-y: scroll;

	::-webkit-scrollbar {
		display: none;
	}

	-ms-overflow-style: none;
	scrollbar-width: none;
`;

const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background-color: white;
	z-index: 1;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
	cursor: pointer;

	:hover {
		opacity: 0.8;
	}
`;

const Search = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;
	border-radius: 2px;
`;

const SearchInput = styled.input`
	outline-width: 0;
	border: none;
	flex: 1;
`;

const SidebarButton = styled(Button)`
	width: 100%;

	&&& {
		border-top: 1px solid whitesmoke;
		border-bottom: 1px solid whitesmoke;
	}
`;
