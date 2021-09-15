import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const Subtitle = styled.div`
  margin: ${theme.margins.large};
  opacity: ${theme.opacity.basic};
`;

const Input = styled.input`
  margin: ${theme.margins.basic};
  ${theme.basicInput}
  height: 30px;
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

const CreateAccount = () => (
  <Container>
    <Subtitle>Create account</Subtitle>
    <Form>
      <Input placeholder="email" />
      <Input placeholder="password" />
      <Input placeholder="repeat password" />
      <SubmitButton>Create</SubmitButton>
    </Form>
  </Container>
);

export default CreateAccount;
