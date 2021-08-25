import React, { memo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import GameObject from './Objects/GameObject';
import Background from './Objects/Background';

const GameObjects = ({ ids, id, objectIds, objects }) => {
  const [fighterImage, image1] = useLoader(TextureLoader, [
    'fighter.png',
    'image1.jpeg',
  ]);

  return (
    <>
      <Background map={image1} />
      {objectIds.current.map((x) => {
        console.log('DOM render GameObject:', x);
        return (
          <GameObject
            objects={objects}
            id={id}
            map={fighterImage}
            objectId={x}
            key={x}
          />
        );
      })}
    </>
  );
};

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  const newA = [...a];
  const newB = [...b];
  newA.sort();
  newB.sort();

  for (let i = 0; i < newA.length; i += 1) {
    if (newA[i] !== newB[i]) return false;
  }
  return true;
};

GameObjects.displayName = 'GameObjects';
const MemoGameObjects = memo(GameObjects, (prev, next) =>
  arraysEqual(prev.ids, next.ids),
);

export default MemoGameObjects;
