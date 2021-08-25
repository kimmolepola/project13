import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import Sidepanel from './components/React/Sidepanel';
import GameContainer from './components/ThreeFiber/GameContainer';
import AppContext from './context/appContext';
import connect from './connection/connection';
import subscribeToKeyboardEvents from './keyboardEvents';

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export default function App() {
  const [main, setMain] = useState();
  const [channels, setChannels] = useState({ ordered: [], unordered: [] });
  const [relay, setRelay] = useState();
  const [remotes, setRemotes] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [id, setId] = useState();
  const [ids, setIds] = useState([]);
  const objects = useRef({});
  const objectIds = useRef([]);
  const text = useRef({});

  console.log('objectIds:', objectIds.current);
  console.log('objects:', objects.current);

  useEffect(() => {
    const unsubscribe = subscribeToKeyboardEvents({
      id,
      objects,
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const signalingSocket = connect({
      objects,
      objectIds,
      setIds,
      setId,
      setChatMessages,
      setMain,
      setChannels,
      setRelay,
      setRemotes,
    });
    return () => {
      Object.keys(remotes).forEach((x) => {
        if (remotes[x].pc) remotes[x].pc.close();
      });
      setRemotes({});
      if (relay) relay.disconnect();
      setRelay(undefined);
      if (signalingSocket) signalingSocket.disconnect();
    };
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
          ids={ids}
          relay={relay}
          channels={channels}
          main={main}
          id={id}
          objectIds={objectIds}
          objects={objects}
          text={text}
        />
      </Canvas>
      <AppContext.Provider
        value={{ setChatMessages, chatMessages, channels, relay, id, remotes }}
      >
        <Sidepanel />
        <div ref={text} style={{ position: 'absolute', left: 40, top: 40 }}>
          hello
        </div>
      </AppContext.Provider>
    </AppContainer>
  );
}
