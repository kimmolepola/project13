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
      {ids.map((x, i) => (
        <GameObject
          ids={ids}
          objects={objects}
          id={id}
          map={fighterImage}
          objectId={x}
          key={x}
        />
      ))}
    </>
  );
};

export default GameObjects;
