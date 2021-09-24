import React, { useContext } from 'react';
import styled from 'styled-components';
import ChatContainer from './Sidepanel/ChatContainer';
import appContext from '../../../context/appContext';
import theme from '../../../theme';

const Text = styled.div`
  margin: ${theme.margins.basic};
  opacity: ${theme.opacity.basic};
  font-family: ${theme.fontFamily};
  font-size: 16px;
  color: ${theme.colors.elementHighlights.button1};
  font-weight: bold;
  user-select: none;
`;

const Button = styled.button`
  margin-bottom: ${theme.margins.large};
  align-self: flex-end;
  font-family: ${theme.fontFamily};
  font-size: 10px;
  height: 20px;
  width: 40px;
  ${theme.basicButton}
  background-color: transparent;
  color: ${theme.colors.elementHighlights.button1};
  font-weight: bold;
`;

const InfoBox = styled.div`
  margin-bottom: ${theme.margins.basic};
  color: ${theme.colors.elementBackgrounds.medium};
  background: white;
  padding: 2px;
  font-family: ${theme.fontFamily};
  font-size: 12px;
  border-radius: ${theme.borderRadius};
  cursor: default;
`;

const Container = styled.div`
  position: absolute;
  top: calc(
    ${(props) => props.windowHeight}px -
      min(
        ${theme.sidepanelMaxWidth},
        ${(props) => (props.windowHeight / 100) * theme.sidepanelWidthPercent}px
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
  background: ${theme.colors.mainBackground};
`;

const Sidepanel = () => {
  const {
    saveState,
    disconnect,
    history,
    score,
    windowHeight,
    id,
    main,
    ids,
    connectionMessage,
  } = useContext(appContext);

  const handleQuit = () => {
    saveState();
    disconnect();
    history.push('/');
  };

  return (
    <Container windowHeight={windowHeight}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Text>Project13</Text>
          <Button onClick={handleQuit}>Quit</Button>
        </div>
        <InfoBox>
          <div>{main && main === id ? 'you are the game host' : null}</div>
          <div>{`players: ${ids.length}`}</div>
          <div> {connectionMessage}</div>
        </InfoBox>
        <InfoBox>
          <p />
          <p />
          <div ref={score} />
          <p />
          <p />
        </InfoBox>
      </div>
      <ChatContainer />
    </Container>
  );
};

export default Sidepanel;
