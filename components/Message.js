import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment';
import styled from 'styled-components';
import { auth } from '../firebaseConfig.js';

export default function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);

  return (
    <Container>
      {user === userLoggedIn?.email ? (
        <Sender>
          {message.message}
          <Timestamp>
            {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
          </Timestamp>
        </Sender>
      ) : (
        <Receiver>
          {message.message}
          <Timestamp>
            {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
          </Timestamp>
        </Receiver>
      )}
    </Container>
  );
}

const Container = styled.div``;

const MessageStyle = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageStyle)`
  margin-left: auto;
  background-color: dodgerblue;
  color: white;
`;

const Receiver = styled(MessageStyle)`
  background-color: yellow;
  text-align: left;
`;

const Timestamp = styled.span`
  color: {userLoggedIn.email === user ? 'white' : 'black'};
  padding: 10px;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
