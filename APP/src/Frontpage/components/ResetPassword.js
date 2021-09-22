import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, withRouter } from 'react-router-dom';
import theme from '../../theme';
import { resetPassword } from '../services/auth.service';

const ErrorMessage = styled.div`
  max-width: 5cm;
  display: ${(props) => (props.error ? '' : 'none')};
  margin: ${theme.margins.large} 0px 0px ${theme.margins.basic};
  font-size: 12px;
  color: red;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const Subtitle = styled.div`
  margin: ${theme.margins.large} ${theme.margins.basic};
  opacity: ${theme.opacity.basic};
  word-break: normal;
`;

const Input = styled.input`
  margin: ${theme.margins.basic};
  ${theme.basicInput}
  height: 30px;
  ${(props) => props.error && 'border-color: red;'}
`;

const Form = styled.form`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  flex-direction: column;
`;

const Button = styled.button`
  margin: ${theme.margins.basic};
  flex: 1;
  ${theme.basicButton}
  height: 30px;
  background-color: ${(props) =>
    props.background || theme.colors.elementHighlights.button1};
  color: ${(props) => props.color || 'white'};
`;

const Container = styled.div`
  flex-direction: column;
`;

const stateText = (state) => {
  switch (state) {
    case 'loading':
      return 'Please wait...';
    case 'success':
      return 'Password changed. You can now log in using your new password.';
    default:
      return 'Enter new password';
  }
};

const ResetPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const [validation, setValidation] = useState({
    state: 'open',
    request: null,
    username: null,
  });
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  useEffect(() => {
    if (password.length || repeatPassword.length) {
      setValidation((x) => ({
        state: x.state,
        request: null,
        password: null,
        repeatPassword: null,
      }));
    }
  }, [password, repeatPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submit');
    const newValidation = {
      state: 'open',
      request: null,
      password: password !== '' ? null : 'invalid password',
      repeatPassword: password === repeatPassword ? null : 'password mismatch',
    };
    if (!newValidation.password && !newValidation.repeatPassword) {
      newValidation.state = 'loading';
      setValidation(newValidation);
      const { data, error } = await resetPassword({
        password,
        token: query.get('token'),
        userId: query.get('id'),
      });
      newValidation.request = error;
      newValidation.state = error ? 'open' : 'success';
      setPassword('');
      setRepeatPassword('');
    }
    setValidation({ ...newValidation });
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordInput = (e) => {
    setRepeatPassword(e.target.value);
  };

  return (
    <Container>
      <Subtitle>{stateText(validation.state)}</Subtitle>
      <ErrorMessage error={validation.request}>
        {validation.request}
      </ErrorMessage>
      <Form show={validation.state !== 'success'} onSubmit={handleSubmit}>
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
        <ErrorMessage error={validation.repeatPassword}>
          {validation.repeatPassword}
        </ErrorMessage>

        <Input
          type="password"
          error={validation.repeatPassword}
          onChange={handleRepeatPasswordInput}
          value={repeatPassword}
          placeholder="repeat password"
        />
        <ButtonContainer>
          <Button disabled={validation.state === 'loading'} type="submit">
            Submit
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default withRouter(ResetPassword);
