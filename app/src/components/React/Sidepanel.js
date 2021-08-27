import React, { useContext } from 'react';
import styled from 'styled-components';
import ChatContainer from './Sidepanel/ChatContainer';
import appContext from '../../context/appContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 300px;
  padding: 3px;
  background: pink;
`;

const Sidepanel = () => {
  const { connectionMessage } = useContext(appContext);
  return (
    <Container>
      <div style={{ position: 'absolute', top: 0 }}>{connectionMessage}</div>
      <ChatContainer />
    </Container>
  );
};

export default Sidepanel;
