import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Canvas from './components/Canvas';
import AppContext from './context/appContext';
import connect from './connection/connection';
import { subscribeToKeyboardEvents } from './controls';
import { sendDataOnOrderedChannelsAndRelay } from './messageHandler';
import UI from './components/UI';
import theme from './theme';

const Container = styled.div`
  height: ${window.innerHeight}px;
  widht: 100vw;
  display: flex;
  flex-direction: column;
  @media (min-width: ${theme.mobileWidth}px) {
    flex-direction: row;
  }
`;

const App = () => {
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
  const text = useRef();

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
  }, [ids, channels, relay]);

  useEffect(() => {
    const unsubscribe = subscribeToKeyboardEvents({
      id,
      objects,
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    console.log(text);
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
    <>
      <Canvas
        ids={ids}
        relay={relay}
        channels={channels}
        main={main}
        id={id}
        objectIds={objectIds}
        objects={objects}
        text={text}
      />
      <AppContext.Provider
        value={{
          objects,
          main,
          ids,
          connectionMessage,
          setChatMessages,
          chatMessages,
          channels,
          relay,
          id,
          remotes,
          text,
        }}
      >
        <UI />
      </AppContext.Provider>
    </>
  );
};

export default App;
