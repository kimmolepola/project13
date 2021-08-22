import React, { useRef, useEffect, Suspense, useState } from 'react';
import Objects from './Objects';
import addKeyboardListeners from '../../keyboardEvents';
import Loop from './Loop';

const GameContainer = ({ id, remotes, objectIds, objects, text }) => {
  useEffect(() => {
    const removeListeners = addKeyboardListeners({ remotes, objects, id });
    return () => {
      removeListeners();
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
