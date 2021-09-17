import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../theme';
import { signup } from './services/auth.service';

const ErrorMessage = styled.div`
  max-width: 5cm;
  display: ${(props) => (props.error ? '' : 'none')};
  margin: ${theme.margins.large} 0px 0px ${theme.margins.basic};
  font-size: 12px;
  color: red;
`;

const Subtitle = styled.div`
  margin: ${theme.margins.large};
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

const CreateAccount = ({ setUser }) => {
  const [validation, setValidation] = useState({
    create: null,
    email: null,
    password: null,
    repeatPassword: null,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  useEffect(() => {
    setValidation({
      create: null,
      email: null,
      password: null,
      repeatPassword: null,
    });
  }, [email, password, repeatPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newValidation = {
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
      const { data, error } = await signup({ email, password });
      setUser(data);
      window.localStorage.setItem('loggedProject13User', JSON.stringify(data));
      newValidation.create = error;
    }
    setValidation(newValidation);
  };

  return (
    <Container>
      <Subtitle>Create account</Subtitle>
      <Form>
        <ErrorMessage error={validation.create}>
          {validation.create}
        </ErrorMessage>
        <ErrorMessage error={validation.email}>{validation.email}</ErrorMessage>
        <Input
          error={validation.email}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="email"
        />
        <ErrorMessage error={validation.password}>
          {validation.password}
        </ErrorMessage>
        <Input
          error={validation.password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
          placeholder="password"
        />
        <ErrorMessage error={validation.repeatPassword}>
          {validation.repeatPassword}
        </ErrorMessage>
        <Input
          error={validation.repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          type="password"
          value={repeatPassword}
          placeholder="repeat password"
        />
        <SubmitButton type="submit" onClick={handleSubmit}>
          Create
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateAccount;
