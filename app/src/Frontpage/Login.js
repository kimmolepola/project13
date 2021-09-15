import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import theme from '../theme';

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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Login = ({ history }) => (
  <Container>
    <Form>
      <Input placeholder="username or email" />
      <Input placeholder="password" />
      <Button onClick={() => history.push('/play')}>Log in</Button>
    </Form>
    <Link to="/forgottenpassword">
      <ClickableText color={theme.colors.elementHighlights.button1}>
        Forgotten password?
      </ClickableText>
    </Link>
    <Line>&nbsp;</Line>
    <Button
      background={theme.colors.elementHighlights.button2}
      onClick={() => history.push('/createaccount')}
    >
      Create account
    </Button>
    <ClickableText
      color={theme.colors.elementHighlights.button1}
      onClick={() => history.push('/play')}
    >
      Sign in as a guest
    </ClickableText>
  </Container>
);

export default withRouter(Login);
