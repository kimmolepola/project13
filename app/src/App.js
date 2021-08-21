import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import Sidepanel from './components/React/Sidepanel';
import GameContainer from './components/ThreeFiber/GameContainer';
import AppContext from './context/appContext';
import setupNetworkEvents from './events/networkEvents';
import connect from './connection/connection';

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export default function App() {
  const [main, setMain] = useState([]);
  const [channels, setChannels] = useState([]);
  const [relay, setRelay] = useState();
  const [id, setId] = useState({});
  const [remotes, setRemotes] = useState({});
  const [messages, setMessages] = useState([]);
  const objects = useRef({});
  const objectIds = useRef([]);
  const text = useRef({});

  useEffect(() => {
    connect({ setMessages, setMain, setChannels, setRelay, setId, setRemotes });
  }, []);

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
        <GameContainer
          id={id}
          remotes={remotes}
          objectIds={objectIds}
          objects={objects}
          text={text}
        />
      </Canvas>
      <AppContext.Provider value={{ messages, channels, relay, id, remotes }}>
        <Sidepanel />
        <div ref={text} style={{ position: 'absolute', left: 40, top: 40 }}>
          hello
        </div>
      </AppContext.Provider>
    </AppContainer>
  );
}
