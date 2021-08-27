import React, { Suspense } from 'react';
import Objects from './GameObjects';
import Loop from './Loop';

const GameContainer = ({
  ids,
  relay,
  channels,
  main,
  id,
  objectIds,
  objects,
  text,
}) => (
  <>
    <Loop
      relay={relay}
      channels={channels}
      main={main}
      text={text}
      id={id}
      objectIds={objectIds}
      objects={objects}
    />
    <Suspense fallback={null}>
      <Objects ids={ids} id={id} objectIds={objectIds} objects={objects} />
    </Suspense>
  </>
);

export default GameContainer;
