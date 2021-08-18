import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import GameObject from './Objects/GameObject';
import Background from './Objects/Background';

export default function Objects({ ownObjectId, allObjectIds, objects }) {
  const [fighterImage, image1] = useLoader(TextureLoader, [
    'fighter.png',
    'image1.jpeg',
  ]);

  return (
    <>
      <Background map={image1} />
      {allObjectIds.map((x) => (
        <GameObject
          objects={objects}
          ownObjectId={ownObjectId}
          map={fighterImage}
          id={x}
          key={x}
        />
      ))}
    </>
  );
}
