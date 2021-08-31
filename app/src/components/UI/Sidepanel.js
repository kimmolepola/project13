import React, { useContext } from 'react';
import styled from 'styled-components';
import ChatContainer from './Sidepanel/ChatContainer';
import appContext from '../../context/appContext';
import theme from '../../theme';

const InfoBox = styled.div`
  color: ${theme.colors.medium};
  background: white;
  padding: 2px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  border-radius: ${theme.borderRadius};
`;

const Container = styled.div`
  position: absolute;
  top: calc(
    ${window.innerHeight}px -
      min(
        ${theme.sidepanelMaxWidth},
        ${(window.innerHeight / 100) * theme.sidepanelWidthPercent}px
      )
  );
  right: 0px;
  bottom: 0px;
  left: 0px;
  @media (min-width: ${theme.mobileWidth}px) {
    top: 0px;
    left: calc(
      100vw - min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}vw)
    );
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px;
  background: mistyrose;
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

/*
  position: absolute;
  top: calc(
    100vh - min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}%)
  );
  right: 0px;
  bottom: 0px;
  left: 0px;
    @media (min-width: ${theme.mobileWidth}px) {
    top: 0px;
    left: calc(
      100vw - min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}vw)
    );
  }

*/
