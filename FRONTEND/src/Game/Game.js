import React, { useMemo, useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import Canvas from './components/Canvas';
import AppContext from '../context/appContext';
import connect from '../networking/peerConnection';
import { subscribeToKeyboardEvents } from './controls';
import { sendDataOnOrderedChannelsAndRelay } from '../networking/services/game.service';
import { saveGameState } from '../networking/services/gameObject.service';
import UI from './components/UI';

const mainUpdatePeers = (
  idsNew,
  main,
  id,
  objectIds,
  objects,
  channels,
  relay,
) => {
  if (main && main === id) {
    const objectsNew = {};
    objectIds.current.forEach((x) => {
      const obj = objects.current[x];
      if (obj) {
        objectsNew[x] = {
          score: obj.score,
          startPosition: obj.elref ? obj.elref.position.toArray() : [0, 0, 1],
          startQuaternion: obj.elref
            ? obj.elref.quaternion.toArray()
            : [0, 0, 0, 1],
          controls: obj.controls,
          controlsOverChannels: obj.controlsOverChannels,
          controlsOverRelay: obj.controlsOverRelay,
          speed: obj.speed,
          rotationSpeed: obj.rotationSpeed,
          backendPosition: obj.backendPosition,
          backendQuaternion: obj.backendQuaternion,
          keyDowns: obj.keyDowns,
        };
      }
    });
    const arg = { type: 'updateObjects', ids: idsNew, objects: objectsNew };
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

const Game = ({ refreshUser, history, user }) => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [connectionMessage, setConnectionMessage] = useState();
  const [main, setMain] = useState();
  const [channels, setChannels] = useState({ ordered: [], unordered: [] });
  const [signaler, setSignaler] = useState();
  const [relay, setRelay] = useState();
  const [remotes, setRemotes] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [id, setId] = useState();
  const [ids, setIds] = useState([]);
  const objects = useRef({});
  const objectIds = useRef([]);
  const text = useRef();
  const score = useRef({ value: 0, textContent: 0 });

  const saveState = async () => {
    if (main && main === id && !id.includes('guest')) {
      const { error, data } = await saveGameState(
        objectIds.current.map((x) => ({
          playerId: x,
          score: objects.current[x].score,
        })),
      );
      if (error) {
        console.error(error);
      }
    }
    return true;
  };

  const disconnect = () => {
    Object.keys(remotes).forEach((x) => {
      if (remotes[x].pc) remotes[x].pc.close();
    });
    setRemotes({});
    if (relay) relay.disconnect();
    setRelay(undefined);
    if (signaler) signaler.disconnect();
    setSignaler(undefined);
  };

  const quit = async () => {
    if (main && main === id) {
      await saveState();
    }
    disconnect();
  };

  const resizeHandler = () => {
    setWindowHeight(window.innerHeight);
  };

  const debounceResizeHandler = useMemo(() => debounce(resizeHandler, 300), []);

  window.onresize = debounceResizeHandler;

  useEffect(() => {
    cleanup(ids, objects);
    mainUpdatePeers(ids, main, id, objectIds, objects, channels, relay);
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
    connect({
      objects,
      objectIds,
      user,
      setConnectionMessage,
      setIds,
      setId,
      setChatMessages,
      setMain,
      setChannels,
      setSignaler,
      setRelay,
      setRemotes,
    });
    return () => {
      quit();
    };
  }, []);

  return (
    <>
      <Canvas
        score={score}
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
          refreshUser,
          quit,
          history,
          score,
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
