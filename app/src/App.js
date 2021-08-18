import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import Sidepanel from './components/React/Sidepanel';
import GameContainer from './components/ThreeFiber/GameContainer';
import AppContext from './context/appContext';
import setupNetworkEvents from './events/networkEvents';

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export default function App({ id, channel, socket }) {
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState();
  const objects = useRef({});
  const objectIds = useRef([]);
  const text = useRef({});

  console.log('sendMessage:', sendMessage);

  useEffect(() => {
    const { removeListeners, sendMessage: sendMsg } = setupNetworkEvents({
      id,
      channel,
      socket,
      objectIds,
      objects,
    });
    console.log('sendMsg', sendMsg);
    setSendMessage(sendMsg);
    return () => {
      removeListeners();
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
          id={id}
          channel={channel}
          socket={socket}
          objectIds={objectIds}
          objects={objects}
          text={text}
        />
      </Canvas>
      <AppContext.Provider
        value={{ messages, sendMessage, id, channel, socket }}
      >
        <Sidepanel />
        <div ref={text} style={{ position: 'absolute', left: 40, top: 40 }}>
          hello
        </div>
      </AppContext.Provider>
    </AppContainer>
  );
}
