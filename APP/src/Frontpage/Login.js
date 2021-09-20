import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import theme from '../theme';
import { login } from './services/auth.service';

const ErrorMessage = styled.div`
  max-width: 5cm;
  display: ${(props) => (props.error ? '' : 'none')};
  margin: ${theme.margins.large} 0px 0px ${theme.margins.basic};
  font-size: 12px;
  color: red;
`;

const Line = styled.div`
  margin: 20px ${theme.margins.basic} 20px ${theme.margins.basic};
  border-top: ${theme.borders.basic};
  height: 1px;
`;

const ClickableText = styled.button`
  color: ${(props) => props.color};
  cursor: pointer;
  background: none;
  border: none;
  margin: ${theme.margins.large};
`;

const Button = styled.button`
  ${theme.basicButton}
  min-height: 30px;
  margin: ${theme.margins.basic};
  background-color: ${(props) =>
    props.background || theme.colors.elementHighlights.button1};
`;

const Input = styled.input`
  ${theme.basicInput}
  height: 30px;
  margin: ${theme.margins.basic};
  ${(props) => props.error && 'border-color: red;'}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: ${(props) => (props.user ? 'none' : 'flex')};
  flex-direction: column;
`;

const Login = ({ user, setUser, history }) => {
  const [validation, setValidation] = useState({
    login: null,
    username: null,
    password: null,
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setValidation({
      login: null,
      username: null,
      password: null,
    });
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newValidation = {
      create: null,
      username: username.length ? null : 'required',
      password: password.length ? null : 'required',
    };
    if (!newValidation.username && !newValidation.password) {
      const { data, error } = await login({ username, password });
      setUser(data);
      window.localStorage.setItem('loggedProject13User', JSON.stringify(data));
      newValidation.login = error;
    }
    setValidation(newValidation);
  };

  return (
    <Container user={user}>
      <Form onSubmit={handleSubmit}>
        <ErrorMessage error={validation.login}>{validation.login}</ErrorMessage>
        <Input
          error={validation.username}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="username or email"
        />
        <Input
          type="password"
          error={validation.passwordd}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="password"
        />
        <Button type="submit">Log in</Button>
      </Form>
      <ClickableText
        color={theme.colors.elementHighlights.button1}
        onClick={() => history.push('/forgottenpassword')}
      >
        Forgotten password?
      </ClickableText>
      <Line>&nbsp;</Line>
      <Button
        background={theme.colors.elementHighlights.button2}
        onClick={() => history.push('/createaccount')}
      >
        Create account
      </Button>
      <ClickableText
        color={theme.colors.elementHighlights.button1}
        onClick={() => history.push('/play')}
      >
        Sign in as a guest
      </ClickableText>
    </Container>
  );
};

export default withRouter(Login);
