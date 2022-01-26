import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Avatar, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';
import { auth, db } from '../firebaseConfig.js';
import { getRecipientsEmail } from '../utils/getRecipientsEmail.js';

export default function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [recipientSnapshot] = useCollection(
    db.collection('users').where('email', '==', getRecipientsEmail(users, user))
  );

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientsEmail = getRecipientsEmail(users, user);

  const goToChat = () => {
    router.push(`/chat/${id}`);
  };

  const deleteChat = e => {
    e.stopPropagation();
    db.collection('chats').doc(id).delete();
  };

  return (
    <Container onClick={goToChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientsEmail[0].toUpperCase()}</UserAvatar>
      )}
      <span>{recipientsEmail}</span>
      <StyledIconButton>
        <DeleteIcon onClick={deleteChat} />
      </StyledIconButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  justify-content: space-between;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;

const StyledIconButton = styled(IconButton)`
  && {
    &:hover {
      background-color: salmon;
    }
  }
`;
