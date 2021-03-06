import { useState, useRef } from 'react';
import TimeAgo from 'timeago-react';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Avatar, IconButton } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import styled from 'styled-components';
import Message from './Message.js';
import { auth, db } from '../firebaseConfig.js';
import { getRecipientsEmail } from '../utils/getRecipientsEmail.js';
import {
	collection,
	doc,
	orderBy,
	query,
	where,
	setDoc,
	addDoc,
	serverTimestamp,
} from '@firebase/firestore';

export default function ChatScreen({ chat, messages }) {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const [text, setText] = useState('');
	const inputFile = useRef(null);
	const endOfMessageRef = useRef(null);

	const chatRef = doc(db, 'chats', router.query.id);
	const [messagesSnapshot] = useCollection(
		query(collection(chatRef, 'messages'), orderBy('timestamp', 'asc'))
	);

	const [recipientSnapshot] = useCollection(
		query(
			collection(db, 'users'),
			where('email', '==', getRecipientsEmail(chat.users, user))
		)
	);

	const scrollToBottom = () => {
		endOfMessageRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	const showMessages = () => {
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map(message => (
				<Message
					key={message.id}
					user={message.data().user}
					message={{
						...message.data(),
						timestamp: message.data().timestamp?.toDate().getTime(),
					}}
				/>
			));
		} else {
			return JSON.parse(messages).map(message => (
				<Message key={message.id} user={message.user} message={message} />
			));
		}
	};

	const sendMessage = async e => {
		e.preventDefault();

		const userRef = doc(db, 'users', user.uid);

		await setDoc(
			userRef,
			{
				lastSeen: serverTimestamp(),
			},
			{ merge: true }
		);

		const chatRef = doc(db, 'chats', router.query.id);
		const messagesRef = collection(chatRef, 'messages');
		await addDoc(messagesRef, {
			timestamp: serverTimestamp(),
			message: text,
			user: user.email,
			photoURL: user.photoURL,
		});

		setText('');
		scrollToBottom();
	};

	const handleAttachBtn = e => {
		inputFile.current.click();
	};

	const recipient = recipientSnapshot?.docs?.[0]?.data();
	const recipientEmail = getRecipientsEmail(chat.users, user);

	return (
		<Container>
			<Header>
				{recipient ? (
					<Avatar src={recipient?.photoURL} />
				) : (
					<Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
				)}

				<HeaderInfo>
					<h3>{recipientEmail}</h3>
					{recipientSnapshot ? (
						<span>
							Last active:{' '}
							{recipient?.lastSeen?.toDate() ? (
								<TimeAgo datetime={recipient?.lastSeen?.toDate()} />
							) : (
								'Unavailable'
							)}
						</span>
					) : (
						<span>Loading Last active...</span>
					)}
				</HeaderInfo>
			</Header>

			<MessageContainer>
				{showMessages()}
				{/* test */}
				{scrollToBottom()}
				<EndOfMessage ref={endOfMessageRef} />
			</MessageContainer>

			<InputContainer>
				<input
					type='file'
					id='file'
					ref={inputFile}
					style={{ display: 'none' }}
				/>
				<IconButton onClick={handleAttachBtn}>
					<AttachFileIcon />
				</IconButton>
				<Input value={text} onChange={e => setText(e.target.value)} />
				<IconButton hidden disabled={!text} type='submit' onClick={sendMessage}>
					<SendIcon style={{ color: text ? '#00bcd4' : 'grey' }} />
				</IconButton>
			</InputContainer>
		</Container>
	);
}

const Container = styled.div``;

const Header = styled.div`
	position: sticky;
	background-color: white;
	z-index: 100;
	top: 0;
	display: flex;
	padding: 11px;
	height: 80px;
	align-items: center;
	border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
	margin-left: 15px;
	flex: 1;

	> h3 {
		margin-bottom: 3px;
	}

	> span {
		font-size: 14px;
		color: gray;
	}
`;

const MessageContainer = styled.div`
	padding: 30px;
	min-height: 75vh;
	background: floralwhite;
`;

const EndOfMessage = styled.div`
	margin-bottom: 50px;
`;

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;
`;

const Input = styled.input`
	flex: 1;
	outline: 0;
	border: none;
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 20px;
	margin-left: 15px;
	margin-right: 15px;
`;
