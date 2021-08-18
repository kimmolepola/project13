import React from 'react';
import styled from 'styled-components';
import Chat from './ChatContainer/Chat';
import InputForm from './ChatContainer/InputForm';
import theme from '../../../theme';

const Container = styled.div`
  background: ${theme.colors.verylight};
  box-shadow: ${theme.shadow};
  border: ${theme.borderWidth} solid ${theme.colors.light};
  border-radius: ${theme.borderRadius};
  display: flex;
  flex-direction: column-reverse;
  height: 33%;
`;

const ChatContainer = () => (
  <Container>
    <InputForm />
    <Chat />
  </Container>
);

export default ChatContainer;
