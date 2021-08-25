import React, { memo } from 'react';
import { speed, rotationSpeed } from '../../../parameters';

const GameObject = ({ ids, objects, id, map, objectId }) => (
  <mesh
    ref={(ref) => {
      if (!objects.current[objectId]) {
        // eslint-disable-next-line no-param-reassign
        objects.current[objectId] = {
          speed,
          rotationSpeed,
          backendPosition: { x: 0, y: 0, z: 1 },
          backendQuaternion: [0, 0, 0, 1],
          elref: ref,
          keyDowns: [],
        };
        console.log(
          'new object created:',
          objectId,
          'creates after deletion, fix this',
        );
      }
    }}
  >
    {console.log('render', objectId)}
    <planeGeometry
      args={[
        Math.min(1, map.image.width / map.image.height),
        Math.min(1, map.image.height / map.image.width),
      ]}
    />
    <meshBasicMaterial
      color={ids && objectId === id ? 'orange' : null}
      transparent
      map={map}
    />
  </mesh>
);

GameObject.displayName = 'GameObject';
const MemoGameObject = memo(
  GameObject,
  (prev, next) => prev.objectId === next.objectId,
);

export default MemoGameObject;
