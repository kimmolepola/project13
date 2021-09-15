import React, { useMemo, useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import Canvas from './components/Canvas';
import AppContext from './context/appContext';
import connect from './connection/connection';
import { subscribeToKeyboardEvents } from './controls';
import { sendDataOnOrderedChannelsAndRelay } from './messageHandler';
import UI from './components/UI';

const updatePeers = (idsNew, main, id, objectIds, objects, channels, relay) => {
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
const cleanup = (idsNew, objects) => {
  const objectsNew = {};
  idsNew.forEach((x) => {
    objectsNew[x] = objects.current[x];
  });
  // eslint-disable-next-line no-param-reassign
  objects.current = objectsNew;
};

const Game = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
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

  const resizeHandler = () => {
    setWindowHeight(window.innerHeight);
  };

  const debounceResizeHandler = useMemo(() => debounce(resizeHandler, 300), []);

  window.onresize = debounceResizeHandler;

  useEffect(() => {
    cleanup(ids, objects);
    updatePeers(ids, main, id, objectIds, objects, channels, relay);
  }, [ids, channels, relay]);

  useEffect(() => {
    let unsubscribe;
    if (id) {
      unsubscribe = subscribeToKeyboardEvents({
        id,
        objects,
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
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
    <>
      <Canvas
        windowHeight={windowHeight}
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
          windowHeight,
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

export default Game;
