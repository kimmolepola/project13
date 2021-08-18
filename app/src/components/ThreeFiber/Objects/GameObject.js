import React, { memo } from 'react';

const GameObjectComponent = ({ objects, ownObjectId, map, id }) => (
  <mesh
    ref={(ref) => {
      if (!objects.current[id]) {
        // eslint-disable-next-line no-param-reassign
        objects.current[id] = {
          backendPosition: { x: 0, y: 0, z: 1 },
          backendQuaternion: [0, 0, 0, 1],
          elref: ref,
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
      color={id === ownObjectId ? 'orange' : null}
      transparent
      map={map}
    />
  </mesh>
);

GameObjectComponent.displayName = 'GameObjectComponent';
const MemoGameObjectComponent = memo(
  GameObjectComponent,
  (prev, next) => prev.id === next.id,
);

export default MemoGameObjectComponent;
