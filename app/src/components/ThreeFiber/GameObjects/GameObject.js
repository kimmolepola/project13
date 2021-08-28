import React, { memo } from 'react';
import { speed, rotationSpeed } from '../../../parameters';

const GameObject = ({ ids, objects, id, map, objectId }) => (
  <mesh
    ref={(ref) => {
      if (ref && !objects.current[objectId]) {
        // eslint-disable-next-line no-param-reassign
        objects.current[objectId] = {
          controls: { left: 0, right: 0 },
          controlsOverChannels: { left: 0, right: 0 },
          controlsOverRelay: { left: 0, right: 0 },
          speed,
          rotationSpeed,
          backendPosition: { x: 0, y: 0, z: 1 },
          backendQuaternion: [0, 0, 0, 1],
          elref: ref,
          keyDowns: [],
        };
      }
    }}
  >
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
