import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const Line = styled.div`
  margin: 20px;
  height: 1px;
  border-top: ${theme.borders.basic};
  width: 100%;
`;

const ClickableText = styled.button`
  color: ${(props) => props.color};
  cursor: pointer;
  background: none;
  border: none;
  margin: ${theme.margins.large};
`;

const CreateButton = styled.button`
  ${theme.basicButton}
  width: 100%;
  height: 30px;
  margin: 2px;
  background-color: ${(props) => props.color};
`;

const LoginButton = styled.button`
  ${theme.basicButton}
  width: 100%;
  height: 30px;
  margin: 2px;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  margin: 2px;
`;

const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  max-width: 90%;
  width: 6cm;
  display: ${(props) => (props.page === 'login' ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Login = ({ page, setPage }) => (
  <Container page={page}>
    <LoginForm>
      <Input />
      <Input />
      <LoginButton onClick={() => setPage('game')}>Log in</LoginButton>
    </LoginForm>
    <ClickableText
      color={theme.colors.elementHighlights.button1}
      onClick={() => setPage('forgottenpassword')}
    >
      Forgotten password?
    </ClickableText>
    <Line>&nbsp;</Line>
    <CreateButton
      color={theme.colors.elementHighlights.button2}
      onClick={() => setPage('createaccount')}
    >
      Create account
    </CreateButton>
    <ClickableText
      color={theme.colors.elementHighlights.button1}
      onClick={() => setPage('game')}
    >
      Sign in as a guest
    </ClickableText>
  </Container>
);

export default Login;

/*

const Input = styled.input`
  opacity: 70%;
  box-sizing: border-box;
  width: 100%;
  ${theme.basicInput}
  height: 30px;
  margin: 20px;
`;

      <LoginButton onClick={() => setPage('game')}>Log in</LoginButton>


 <ClickableText
      color={theme.colors.elementHighlights.button1}
      onClick={() => setPage('forgottenpassword')}
    >
      Forgotten password?
    </ClickableText>
    <Line>&nbsp;</Line>
    <CreateButton onClick={() => setPage('createaccount')}>
      Create account
    </CreateButton>
    <ClickableText
      color={theme.colors.elementHighlights.button1}
      onClick={() => setPage('game')}
    >
      Sign in as a guest
    </ClickableText>
*/
