import React, { Suspense } from 'react';
import Objects from './Objects';
import Loop from './Loop';

const GameContainer = ({ id, objectIds, objects, text }) => (
  <>
    <Loop text={text} id={id} objectIds={objectIds} objects={objects} />
    <Suspense fallback={null}>
      <Objects id={id} objectIds={objectIds} objects={objects} />
    </Suspense>
  </>
);

export default GameContainer;
