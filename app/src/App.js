import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import Sidepanel from './components/React/Sidepanel';
import GameContainer from './components/ThreeFiber/GameContainer';
import AppContext from './context/appContext';
import addSocketListener from './events/socketEventsMain';

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export default function App({ socket }) {
  const [ownId, setOwnId] = useState();
  const text = useRef({});

  useEffect(() => {
    const removeListener = addSocketListener({ socket, setOwnId });
    return () => removeListener();
  }, [socket]);

  return (
    <AppContainer>
      <Canvas
        onCreated={(state) => {
          state.gl.setClearColor('lightyellow');
        }}
        camera={{
          fov: 75,
          near: 5,
          far: 11,
          position: [0, 0, 10],
        }}
      >
        <GameContainer ownObjectId={ownId} text={text} socket={socket} />
      </Canvas>
      <AppContext.Provider value={{ ownId, socket }}>
        <Sidepanel />
        <div ref={text} style={{ position: 'absolute', left: 40, top: 40 }}>
          hello
        </div>
      </AppContext.Provider>
    </AppContainer>
  );
}
