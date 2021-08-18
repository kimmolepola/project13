import React from 'react';
import styled from 'styled-components';
import ChatContainer from './Sidepanel/ChatContainer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 300px;
  padding: 3px;
  background: pink;
`;

const Sidepanel = () => (
  <Container>
    <ChatContainer />
  </Container>
);

export default Sidepanel;
