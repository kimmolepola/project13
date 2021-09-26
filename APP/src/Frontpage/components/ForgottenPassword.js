import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import theme from '../../theme';
import { requestPasswordReset } from '../../networking/services/auth.service';

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
      return 'Email sent (check spam)';
    default:
      return 'Enter your username or email';
  }
};

const ForgottenPassword = ({ history }) => {
  const [validation, setValidation] = useState({
    dirty: false,
    state: 'open',
    request: null,
    username: null,
  });
  const [username, setUsername] = useState('');

  const resetValidation = () => {
    if (validation.dirty) {
      setValidation({
        dirty: false,
        state: 'open',
        request: null,
        username: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newValidation = {
      dirty: true,
      state: 'open',
      request: null,
      username: username.length ? null : 'required',
    };
    if (!newValidation.username) {
      newValidation.state = 'loading';
      setValidation(newValidation);
      const { data, error } = await requestPasswordReset({ username });
      newValidation.request = error;
      newValidation.state = error ? 'open' : 'success';
      setUsername('');
    }
    setValidation({ ...newValidation });
  };

  const handleUsernameInput = (e) => {
    resetValidation();
    setUsername(e.target.value);
  };

  const handleCancelClick = () => {
    history.push('/login');
  };

  return (
    <Container>
      <Subtitle>{stateText(validation.state)}</Subtitle>
      <ErrorMessage error={validation.request}>
        {validation.request}
      </ErrorMessage>
      <Form show={validation.state !== 'success'} onSubmit={handleSubmit}>
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
        <ButtonContainer>
          <Button
            onClick={handleCancelClick}
            color={theme.colors.elementHighlights.button1}
            background="transparent"
            type="button"
          >
            Cancel
          </Button>
          <Button disabled={validation.state === 'loading'} type="submit">
            Submit
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default withRouter(ForgottenPassword);
