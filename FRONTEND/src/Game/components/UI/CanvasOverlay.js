import React, { useContext } from 'react';
import styled from 'styled-components';
import theme from '../../../theme';
import appContext from '../../../context/appContext';
import { handlePressed, handleReleased } from '../../controls';

const Connecting = styled.div`
  position: absolute;
  top: max(calc(50% - 75px), 0px);
  right: max(calc(50% - 150px), 0px);
  bottom: max(calc(50% - 75px), 0px);
  left: max(calc(50% - 150px), 0px);
  background: ${theme.colors.elementBackgrounds.verylight};
  display: ${(props) => (props.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  transition: transform 3s;
`;

const Infotext = styled.div`
  display: ${(props) => (props.show ? '' : 'none')};
  padding: 5px;
  background: rgba(255, 255, 255, 0.75);
  white-space: pre-line;
  position: absolute;
  left: 20px;
  top: 20px;
`;

const ControlsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  @media (min-width: ${theme.mobileWidth}px) {
    display: none;
  }
`;

const Controls = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
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
  margin: 2mm 7mm 4mm 7mm;
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

const ObjectInfo = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
`;

const ObjectInfos = ({ objects }) => {
  console.log('objectInfos');
  return (
    <>
      {Object.keys(objects.current).map((x) => (
        <ObjectInfo
          key={x}
          ref={(ref) => {
            if (objects.current[x]) {
              const obj = objects.current[x];
              obj.objectInfoRef = ref;
            }
          }}
        />
      ))}
    </>
  );
};

const CanvasOverlay = () => {
  const { ids, windowHeight, id, objects, text } = useContext(appContext);

  const ControlButton = ({ control }) => (
    <Button
      onTouchStart={() => handlePressed(control, id, objects)}
      onTouchEnd={() => handleReleased(control, id, objects)}
      onMouseDown={() => handlePressed(control, id, objects)}
      onMouseUp={() => handleReleased(control, id, objects)}
    >
      {(() => {
        switch (control) {
          case 'up':
            return '\u2191';
          case 'down':
            return '\u2193';
          case 'left':
            return '\u2190';
          case 'right':
            return '\u2192';
          default:
            return null;
        }
      })()}
    </Button>
  );

  return (
    <Container windowHeight={windowHeight}>
      <ObjectInfos objects={objects} />
      <Connecting show={!ids.length}>Connecting...</Connecting>
      <Infotext show={ids.length} ref={text} />
      <ControlsContainer>
        <Controls>
          <ControlButton control="left" />
          <ButtonGroup>
            <ControlButton control="up" />
            <ControlButton control="down" />
          </ButtonGroup>
          <ControlButton control="right" />
        </Controls>
      </ControlsContainer>
    </Container>
  );
};

export default CanvasOverlay;

// return '\u21E6';
