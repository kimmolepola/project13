import React, { useContext } from 'react';
import styled from 'styled-components';
import theme from '../../theme';
import appContext from '../../context/appContext';
import { handlePressed, handleReleased } from '../../controls';

const Infotext = styled.div`
  text-shadow: white 0 0 1px;
  position: absolute;
  left: 40px;
  top: 40px;
`;

const Controls = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  @media (min-width: ${theme.mobileWidth}px) {
    display: none;
  }
`;

const Button = styled.button`
  opacity: 85%;
  color: royalblue;
  border-color: royalblue;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 30px;
  border-radius: 50%;
  margin: 7mm;
  width: 1cm;
  height: 1cm;
  background: transparent;
`;

const Container = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}vh);
  left: 0px;
  @media (min-width: ${theme.mobileWidth}px) {
    right: min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}vw);
    bottom: 0px;
  }
  display: flex;
`;

const CanvasOverlay = () => {
  const { id, objects, text } = useContext(appContext);

  const ControlButton = ({ control }) => (
    <Button
      onTouchStart={() => handlePressed(control, id, objects)}
      onTouchEnd={() => handleReleased(control, id, objects)}
      onMouseDown={() => handlePressed(control, id, objects)}
      onMouseUp={() => handleReleased(control, id, objects)}
    >
      {(() => {
        switch (control) {
          case 'left':
            return '\u21E6';
          case 'right':
            return '\u21E8';
          default:
            return null;
        }
      })()}
    </Button>
  );

  return (
    <Container>
      <Infotext ref={text} />
      <Controls>
        <ControlButton control="left" />
        <ControlButton control="right" />
      </Controls>
    </Container>
  );
};

export default CanvasOverlay;
