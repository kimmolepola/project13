import React, { useContext } from 'react';
import styled from 'styled-components';
import theme from '../../../theme';
import appContext from '../../../context/appContext';
import { handlePressed, handleReleased } from '../../controls';

const Infotext = styled.div`
  padding: 5px;
  background: rgba(255, 255, 255, 0.75);
  white-space: pre-line;
  position: absolute;
  left: 20px;
  top: 20px;
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
  padding: 0px;
  display: flex;
  opacity: 85%;
  color: ${theme.colors.elementHighlights.button1};
  border-color: ${theme.colors.elementHighlights.button1};
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border-radius: 50%;
  margin: 7mm;
  width: 1cm;
  height: 1cm;
  background: transparent;
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
`;

const Container = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: min(
    ${theme.sidepanelMaxWidth},
    ${(props) => (props.windowHeight / 100) * theme.sidepanelWidthPercent}px
  );
  left: 0px;
  @media (min-width: ${theme.mobileWidth}px) {
    right: min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}vw);
    bottom: 0px;
  }
  display: flex;
`;

const CanvasOverlay = () => {
  const { windowHeight, id, objects, text } = useContext(appContext);

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
            return '\u2039';
          case 'right':
            return '\u203A';
          default:
            return null;
        }
      })()}
    </Button>
  );

  return (
    <Container windowHeight={windowHeight}>
      <Infotext ref={text} />
      <Controls>
        <ControlButton control="left" />
        <ControlButton control="right" />
      </Controls>
    </Container>
  );
};

export default CanvasOverlay;

// return '\u21E6';
