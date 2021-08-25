import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import GameObject from './Objects/GameObject';
import Background from './Objects/Background';

export default function Objects({ id, objectIds, objects }) {
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
}
