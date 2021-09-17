import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import theme from '../theme';
import { requestPasswordReset } from './services/auth.service';

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

const ForgottenPassword = ({ history }) => {
  const [validation, setValidation] = useState({
    sent: false,
    request: null,
    username: null,
  });
  const [username, setUsername] = useState('');

  useEffect(() => {
    setValidation((x) => ({
      sent: x.sent,
      request: null,
      username: null,
    }));
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newValidation = {
      sent: false,
      request: null,
      username: username.length ? null : 'required',
    };
    if (!newValidation.username) {
      const { data, error } = await requestPasswordReset({ username });
      newValidation.request = error;
      if (!error) {
        newValidation.sent = true;
        setUsername('');
      }
    }
    setValidation(newValidation);
  };

  return (
    <Container>
      <Subtitle>
        {validation.sent
          ? 'Email sent (check spam)'
          : 'Enter your username or email'}
      </Subtitle>
      <ErrorMessage error={validation.request}>
        {validation.request}
      </ErrorMessage>
      <Form show={!validation.sent} onSubmit={handleSubmit}>
        <ErrorMessage error={validation.username}>
          {validation.username}
        </ErrorMessage>
        <Input
          error={validation.username}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="username or email"
        />
        <ButtonContainer>
          <Button
            color={theme.colors.elementHighlights.button1}
            background="transparent"
            onClick={() => history.push('/login')}
          >
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default withRouter(ForgottenPassword);
