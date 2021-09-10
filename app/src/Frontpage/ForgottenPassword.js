import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const Subtitle = styled.div`
.
`;

const Input = styled.input`
  width: 100%;
  ${theme.basicInput}
  height: 30px;
  margin: ${theme.margins.basic};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SubmitButton = styled.button`
  width: 100%;
  ${theme.basicButton}
  height: 30px;
  margin: ${theme.margins.basic};
`;

const Container = styled.div`
  display: ${(props) => (props.page === 'forgottenpassword' ? '' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ForgottenPassword = ({ page, setPage }) => (
  <Container page={page}>
    <Subtitle>Enter your email address</Subtitle>
    <Form>
      <Input />
      <SubmitButton>Submit</SubmitButton>
    </Form>
  </Container>
);

export default ForgottenPassword;
