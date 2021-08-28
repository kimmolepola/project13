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
  const { id, main, ids, connectionMessage } = useContext(appContext);
  return (
    <Container>
      <div
        style={{
          flexDirection: 'column',
          display: 'flex',
          position: 'absolute',
          top: 0,
        }}
      >
        <div>{main && main === id ? 'you are the game host' : null}</div>
        <div>{`players: ${ids.length}`}</div>
        <div> {connectionMessage}</div>
      </div>

      <ChatContainer />
    </Container>
  );
};

export default Sidepanel;
