import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const Line = styled.div`
  margin: 20px;
  height: 1px;
  border-top: ${theme.borders.basic};
  width: 100%;
`;

const ClickableText = styled.button`
  color: ${(props) => props.color};
  cursor: pointer;
  background: none;
  border: none;
  margin: ${theme.margins.large};
`;

const Title = styled.div`
  color: ${theme.colors.mainText};
  font-family: ${theme.fontFamily};
  font-size: 26px;
  margin-bottom: 26px;
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

const CreateButton = styled.button`
  width: 100%;
  ${theme.secondaryButton}
  height: 30px;
  margin: ${theme.margins.basic};
`;

const LoginButton = styled.button`
  width: 100%;
  ${theme.basicButton}
  height: 30px;
  margin: ${theme.margins.basic};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: ${(props) => (props.page === 'frontpage' ? 'flex' : 'none')};
  background: ${theme.colors.mainBackground};
`;

const Frontpage = ({ page, setPage }) => {
  console.log('asdf');
  return (
    <>
      <Container page={page}>
        <Content>
          <Title>Project13</Title>
          <Form>
            <Input />
            <Input />
            <LoginButton>Log in</LoginButton>
          </Form>
          <ClickableText
            color={theme.colors.elementHighlights.button1}
            onClick={() => setPage('game')}
          >
            Forgotten password?
          </ClickableText>
          <Line>&nbsp;</Line>
          <CreateButton>Create account</CreateButton>
          <ClickableText
            color={theme.colors.elementHighlights.button1}
            onClick={() => setPage('game')}
          >
            Sign in as a guest
          </ClickableText>
        </Content>
      </Container>
    </>
  );
};

export default Frontpage;
