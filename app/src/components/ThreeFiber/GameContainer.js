import React, { useRef, useEffect, Suspense, useState } from 'react';
import Objects from './Objects';
import addKeyboardListeners from '../../events/keyboardEvents';
import Loop from './Loop';

const GameContainer = ({ id, channel, socket, objectIds, objects, text }) => {
  useEffect(() => {
    const removeListeners = [
      addKeyboardListeners({ channel, socket, objects, id }),
    ];
    return () => {
      removeListeners.forEach((x) => x());
    };
  }, []);

  return (
    <>
      <Loop text={text} id={id} objectIds={objectIds} objects={objects} />
      <Suspense fallback={null}>
        <Objects id={id} objectIds={objectIds} objects={objects} />
      </Suspense>
    </>
  );
};

export default GameContainer;
