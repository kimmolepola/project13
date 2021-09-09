import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import * as THREE from 'three';
import Objects from './Canvas/GameObjects';
import Loop from './Canvas/Loop';
import theme from '../../theme';

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
`;

const CanvasContainer = ({
  windowHeight,
  ids,
  relay,
  channels,
  main,
  id,
  objectIds,
  objects,
  text,
}) => (
  <Container windowHeight={windowHeight}>
    <Canvas
      camera={{
        fov: 75,
        near: 5,
        far: 11,
        position: [0, 0, 10],
      }}
    >
      <color attach="background" args={['bisque']} />
      <Loop
        relay={relay}
        channels={channels}
        main={main}
        text={text}
        id={id}
        objectIds={objectIds}
        objects={objects}
      />
      <Suspense fallback={null}>
        <Objects ids={ids} id={id} objectIds={objectIds} objects={objects} />
      </Suspense>
    </Canvas>
  </Container>
);

export default CanvasContainer;

/*
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}%);
  left: 0px;
  @media (min-width: ${theme.mobileWidth}px) {
    right: min(${theme.sidepanelMaxWidth}, ${theme.sidepanelWidthPercent}vw);
    bottom: 0px;
  }
*/
