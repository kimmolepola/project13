import React, { useRef, useEffect, Suspense, useState } from 'react';
import Objects from './Objects';
import addKeyboardEventListeners from '../../events/keyboardEvents';
import addSocketEventListeners from '../../events/socketEventsForGame';
import Loop from './Loop';

const GameContainer = ({ ownObjectId, text, socket }) => {
  const objects = useRef({});
  const [allObjectIds, setAllObjectIds] = useState([]);

  useEffect(() => {
    const removeKeyboardEventListeners = addKeyboardEventListeners({
      socket,
      objects,
      ownObjectId,
    });
    return () => {
      removeKeyboardEventListeners();
    };
  }, [socket, ownObjectId]);

  useEffect(() => {
    // cleanup
    Object.keys(objects.current).forEach((x) => {
      if (!allObjectIds.includes(x)) {
        delete objects.current[x];
      }
    });
    //
    const removeSocketEventListeners = addSocketEventListeners({
      socket,
      objects,
      allObjectIds,
      setAllObjectIds,
    });
    return () => {
      removeSocketEventListeners();
    };
  }, [socket, ownObjectId, allObjectIds]);
  return (
    <>
      <Loop
        text={text}
        ownObjectId={ownObjectId}
        allObjectIds={allObjectIds}
        objects={objects}
      />
      <Suspense fallback={null}>
        <Objects
          ownObjectId={ownObjectId}
          allObjectIds={allObjectIds}
          objects={objects}
        />
      </Suspense>
    </>
  );
};

export default GameContainer;
