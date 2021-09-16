import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import theme from '../theme';

const ButtonContainer = styled.div`
  display: flex;
`;

const Subtitle = styled.div`
  margin: ${theme.margins.large};
  opacity: ${theme.opacity.basic};
  word-break: normal;
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

const ForgottenPassword = ({ history }) => (
  <Container>
    <Subtitle>Enter your username or email</Subtitle>
    <Form>
      <Input placeholder="username or email" />
      <ButtonContainer>
        <Button
          color={theme.colors.elementHighlights.button1}
          background="transparent"
          onClick={() => history.push('/')}
        >
          Cancel
        </Button>
        <Button>Submit</Button>
      </ButtonContainer>
    </Form>
  </Container>
);

export default withRouter(ForgottenPassword);
