import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

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
  ${theme.secondaryButton}
  height: 30px;
  margin: ${theme.margins.basic};
`;

const Container = styled.div`
  display: ${(props) => (props.page === 'createaccount' ? '' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CreateAccount = ({ page, setPage }) => (
  <Container page={page}>
    <Form>
      <Input />
      <Input />
      <SubmitButton>Create</SubmitButton>
    </Form>
  </Container>
);

export default CreateAccount;
