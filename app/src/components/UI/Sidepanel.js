import React, { useContext } from 'react';
import styled from 'styled-components';
import ChatContainer from './Sidepanel/ChatContainer';
import appContext from '../../context/appContext';
import theme from '../../theme';

const InfoBox = styled.div`
  background: white;
  padding: 2px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  border-radius: ${theme.borderRadius};
`;

const Container = styled.div`
  display: flex;
  position: absolute;
  top: calc(
    100vh - min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}vh)
  );
  right: 0px;
  bottom: 0px;
  left: 0px;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px;
  background: pink;
  @media (min-width: ${theme.mobileWidth}px) {
    top: 0px;
    left: calc(
      100vw - min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}vw)
    );
  }
`;

const Sidepanel = () => {
  const { id, main, ids, connectionMessage } = useContext(appContext);

  return (
    <Container>
      <InfoBox>
        <div>{main && main === id ? 'you are the game host' : null}</div>
        <div>{`players: ${ids.length}`}</div>
        <div> {connectionMessage}</div>
      </InfoBox>
      <ChatContainer />
    </Container>
  );
};

export default Sidepanel;
