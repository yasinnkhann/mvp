import Head from 'next/head';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import Sidebar from '../../components/Sidebar.js';
import ChatScreen from '../../components/ChatScreen.js';
import { getRecipientsEmail } from '../../utils/getRecipientsEmail.js';
import { auth, db } from '../../firebaseConfig.js';
import {
  doc,
  getDocs,
  orderBy,
  collection,
  query,
  getDoc,
} from 'firebase/firestore';

export default function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientsEmail(chat.users, user)}</title>
      </Head>

      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const chatRef = doc(db, 'chats', context.query.id);
  // const chatRef = db.collection('chats').doc(context.query.id);

  const messagesRef = collection(chatRef, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  const messagesRes = await getDocs(q);

  // const messagesRes = await chatRef
  //   .collection('messages')
  //   .orderBy('timestamp', 'asc')
  //   .get();

  const messages = messagesRes.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map(messages => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const chatRes = await getDoc(chatRef);
  // const chatRes = await chatRef.get();

  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

// import Head from 'next/head';
// import styled from 'styled-components';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import Sidebar from '../../components/Sidebar.js';
// import ChatScreen from '../../components/ChatScreen.js';
// import { getRecipientsEmail } from '../../utils/getRecipientsEmail.js';
// import { auth, db } from '../../firebaseConfig.js';

// export default function Chat({ chat, messages }) {
//   const [user] = useAuthState(auth);

//   return (
//     <Container>
//       <Head>
//         <title>Chat with {getRecipientsEmail(chat.users, user)}</title>
//       </Head>

//       <Sidebar />
//       <ChatContainer>
//         <ChatScreen chat={chat} messages={messages} />
//       </ChatContainer>
//     </Container>
//   );
// }

// export async function getServerSideProps(context) {
//   const chatRef = db.collection('chats').doc(context.query.id);

//   const messagesRes = await chatRef
//     .collection('messages')
//     .orderBy('timestamp', 'asc')
//     .get();

//   const messages = messagesRes.docs
//     .map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }))
//     .map(messages => ({
//       ...messages,
//       timestamp: messages.timestamp.toDate().getTime(),
//     }));

//   const chatRes = await chatRef.get();

//   const chat = {
//     id: chatRes.id,
//     ...chatRes.data(),
//   };

//   return {
//     props: {
//       messages: JSON.stringify(messages),
//       chat,
//     },
//   };
// }

// const Container = styled.div`
//   display: flex;
// `;

// const ChatContainer = styled.div`
//   flex: 1;
//   overflow: scroll;
//   height: 100vh;

//   ::-webkit-scrollbar {
//     display: none;
//   }

//   -ms-overflow-style: none; /* IE and Edge */
//   scrollbar-width: none; /* Firefox */
// `;
