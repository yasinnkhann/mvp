import Head from 'next/head';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { auth, provider } from '../firebaseConfig.js';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

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
  // const signIn = () => {
  //   auth.signInWithPopup(provider).catch(alert);
  // };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <AolLogo src='https://cdn.worldvectorlogo.com/logos/aol-instant-messenger.svg' />

        <Button onClick={signIn} variant='outlined'>
          Sign in with Google
          <GoogleIcon src='https://logowik.com/content/uploads/images/985_google_g_icon.jpg' />
        </Button>
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

const GoogleIcon = styled.img`
  height: 2.5rem;
  width: 3rem;
`;

// import Head from 'next/head';
// import { Button } from '@material-ui/core';
// import styled from 'styled-components';
// import { auth, provider } from '../firebaseConfig.js';

// export default function login() {
//   const signIn = () => {
//     auth.signInWithPopup(provider).catch(alert);
//   };

//   return (
//     <Container>
//       <Head>
//         <title>Login</title>
//       </Head>

//       <LoginContainer>
//         <AolLogo src='https://cdn.worldvectorlogo.com/logos/aol-instant-messenger.svg' />

//         <Button onClick={signIn} variant='outlined'>
//           Sign in with Google
//           <GoogleIcon src='https://logowik.com/content/uploads/images/985_google_g_icon.jpg' />
//         </Button>
//       </LoginContainer>
//     </Container>
//   );
// }

// const Container = styled.div`
//   display: grid;
//   place-items: center;
//   height: 100vh;
//   background-color: whitesmoke;
// `;

// const LoginContainer = styled.div`
//   padding: 100px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   background-color: white;
//   border-radius: 5px;
//   box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
// `;

// const AolLogo = styled.img`
//   height: 200px;
//   width: 200px;
//   margin-bottom: 50px;
// `;

// const GoogleIcon = styled.img`
//   height: 2.5rem;
//   width: 3rem;
// `;
