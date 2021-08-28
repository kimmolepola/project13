import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import Sidepanel from './components/React/Sidepanel';
import GameContainer from './components/ThreeFiber/GameContainer';
import AppContext from './context/appContext';
import connect from './connection/connection';
import subscribeToKeyboardEvents from './keyboardEvents';
import { sendDataOnOrderedChannelsAndRelay } from './messageHandler';

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export default function App() {
  const [connectionMessage, setConnectionMessage] = useState();
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

  useEffect(() => {
    const updatePeers = (idsNew) => {
      if (main && main === id) {
        const objectsNew = {};
        objectIds.current.forEach((x) => {
          const obj = objects.current[x];
          if (obj) {
            objectsNew[x] = {
              startQuaternion: obj.elref.quaternion.toArray(),
              startPosition: obj.elref.position.toArray(),
            };
          }
        });
        const arg = { type: 'setObjects', ids: idsNew, objects: objectsNew };
        sendDataOnOrderedChannelsAndRelay(arg, channels, relay);
      }
    };
    const cleanup = (idsNew) => {
      const objectsNew = {};
      idsNew.forEach((x) => {
        objectsNew[x] = objects.current[x];
      });
      objects.current = objectsNew;
    };
    cleanup(ids);
    updatePeers(ids);
  }, [ids, channels]);

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
      setConnectionMessage,
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
        value={{
          main,
          ids,
          connectionMessage,
          setChatMessages,
          chatMessages,
          channels,
          relay,
          id,
          remotes,
        }}
      >
        <Sidepanel />
        <div ref={text} style={{ position: 'absolute', left: 40, top: 40 }}>
          hello
        </div>
      </AppContext.Provider>
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '30%',
          bottom: '30%',
          left: '30%',
          background: 'white',
          display:
            main === id || relay || channels.ordered.length ? 'none' : 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>Connecting...</div>
      </div>
    </AppContainer>
  );
}
