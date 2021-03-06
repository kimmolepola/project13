import React, { memo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';
import GameObject from './GameObjects/GameObject';
import Background from './GameObjects/Background';

const GameObjects = ({ ids, id, objectIds, objects }) => {
  const [fighterImage, image1] = useLoader(TextureLoader, [
    'fighter.png',
    'image1.jpeg',
  ]);

  image1.wrapS = THREE.MirroredRepeatWrapping;
  image1.wrapT = THREE.MirroredRepeatWrapping;
  image1.repeat.set(120, 120);

  return (
    <>
      <Background map={image1} />
      {objectIds.current.map((x, i) => (
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

GameObjects.displayName = 'GameObjects';
const MemoGameObjects = memo(
  GameObjects,
  (prev, next) => prev.ids === next.ids,
);

export default MemoGameObjects;
