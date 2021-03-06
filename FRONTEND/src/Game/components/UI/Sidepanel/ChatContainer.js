import React from 'react';
import styled from 'styled-components';
import Chat from './ChatContainer/Chat';
import InputForm from './ChatContainer/InputForm';
import theme from '../../../../theme';

const Container = styled.div`
  background: ${theme.colors.elementBackgrounds.verylight};
  box-shadow: ${theme.shadow};
  border: ${theme.borders.basic};
  border-radius: ${theme.borderRadius};
  display: flex;
  flex-direction: column-reverse;
  height: 65%;
`;

const ChatContainer = () => (
  <Container>
    <InputForm />
    <Chat />
  </Container>
);

export default ChatContainer;
