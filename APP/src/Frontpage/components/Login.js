import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import theme from '../../theme';
import { setToken, login } from '../services/auth.service';

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
  display: ${(props) => (props.show ? 'flex' : 'none')};
  flex-direction: column;
`;

const Login = ({ user, setUser, history }) => {
  const [validation, setValidation] = useState({
    state: 'open',
    login: null,
    username: null,
    password: null,
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setValidation({
      state: 'open',
      login: null,
      username: null,
      password: null,
    });
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newValidation = {
      state: 'open',
      login: null,
      username: username.length ? null : 'required',
      password: password.length ? null : 'required',
    };
    if (!newValidation.username && !newValidation.password) {
      newValidation.state = 'loading';
      setValidation(newValidation);
      const { data, error } = await login({ username, password });
      newValidation.login = error;
      newValidation.state = 'open';
      if (!error) {
        setUser(data);
        setUsername('');
        setPassword('');
      }
    }
    setValidation({ ...newValidation });
  };

  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleForgottenPasswordClick = () => {
    history.push('/forgottenpassword');
  };

  const handleCreateAccountClick = () => {
    history.push('/createaccount');
  };

  const handleGuestClick = () => {
    history.push('/play');
  };

  return (
    <Container show={!user}>
      <ErrorMessage error={validation.login}>{validation.login}</ErrorMessage>
      <Form onSubmit={handleSubmit}>
        <ErrorMessage error={validation.username}>
          {validation.username}
        </ErrorMessage>
        <Input
          autoCapitalize="none"
          error={validation.username}
          onChange={handleUsernameInput}
          value={username}
          placeholder="username or email"
        />
        <ErrorMessage error={validation.password}>
          {validation.password}
        </ErrorMessage>

        <Input
          type="password"
          error={validation.password}
          onChange={handlePasswordInput}
          value={password}
          placeholder="password"
        />
        <Button disabled={validation.state === 'loading'} type="submit">
          Log in
        </Button>
      </Form>
      <ClickableText
        color={theme.colors.elementHighlights.button1}
        onClick={handleForgottenPasswordClick}
      >
        Forgotten password?
      </ClickableText>
      <Line>&nbsp;</Line>
      <Button
        background={theme.colors.elementHighlights.button2}
        onClick={handleCreateAccountClick}
      >
        Create account
      </Button>
      <ClickableText
        color={theme.colors.elementHighlights.button1}
        onClick={handleGuestClick}
      >
        Sign in as a guest
      </ClickableText>
    </Container>
  );
};

export default withRouter(Login);
