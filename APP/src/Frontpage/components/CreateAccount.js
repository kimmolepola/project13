import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../../theme';
import { setToken, signup } from '../services/auth.service';

const ErrorMessage = styled.div`
  max-width: 5cm;
  display: ${(props) => (props.error ? '' : 'none')};
  margin: ${theme.margins.large} 0px 0px ${theme.margins.basic};
  font-size: 12px;
  color: red;
`;

const Subtitle = styled.div`
  margin: ${theme.margins.large} ${theme.margins.basic};
  opacity: ${theme.opacity.basic};
`;

const Input = styled.input`
  margin: ${theme.margins.basic};
  ${theme.basicInput}
  height: 30px;
  ${(props) => props.error && 'border-color: red;'}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled.button`
  ${theme.secondaryButton}
  height: 30px;
  margin: ${theme.margins.basic};
`;

const Container = styled.div`
  flex-direction: column;
`;

const CreateAccount = ({ user, history, setUser }) => {
  const [validation, setValidation] = useState({
    state: 'open',
    create: null,
    email: null,
    password: null,
    repeatPassword: null,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  useEffect(() => {
    const doit = () => {
      if (user) {
        history.push('/');
      }
    };
    doit();
  }, [user]);

  useEffect(() => {
    setValidation({
      state: 'open',
      create: null,
      email: null,
      password: null,
      repeatPassword: null,
    });
  }, [email, password, repeatPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newValidation = {
      state: 'open',
      create: null,
      email: email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
        ? null
        : 'invalid email address',
      password: password !== '' ? null : 'invalid password',
      repeatPassword: password === repeatPassword ? null : 'password mismatch',
    };
    if (
      !newValidation.email &&
      !newValidation.password &&
      !newValidation.repeatPassword
    ) {
      newValidation.state = 'loading';
      setValidation(newValidation);
      const { data, error } = await signup({ email, password });
      newValidation.create = error;
      newValidation.state = 'open';
      if (!error) {
        setUser(data);
      }
    }
    setValidation({ ...newValidation });
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordInput = (e) => {
    setRepeatPassword(e.target.value);
  };

  return (
    <Container>
      <Subtitle>
        {validation.state !== 'loading' ? 'Create account' : 'Creating...'}
      </Subtitle>
      <Form onSubmit={handleSubmit}>
        <ErrorMessage error={validation.create}>
          {validation.create}
        </ErrorMessage>
        <ErrorMessage error={validation.email}>{validation.email}</ErrorMessage>
        <Input
          type="email"
          error={validation.email}
          onChange={handleEmailInput}
          value={email}
          placeholder="email"
        />
        <ErrorMessage error={validation.password}>
          {validation.password}
        </ErrorMessage>
        <Input
          error={validation.password}
          onChange={handlePasswordInput}
          type="password"
          value={password}
          placeholder="password"
        />
        <ErrorMessage error={validation.repeatPassword}>
          {validation.repeatPassword}
        </ErrorMessage>
        <Input
          error={validation.repeatPassword}
          onChange={handleRepeatPasswordInput}
          type="password"
          value={repeatPassword}
          placeholder="repeat password"
        />
        <SubmitButton disabled={validation.state === 'loading'} type="submit">
          Create
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateAccount;
