import React, { memo } from 'react';
import * as THREE from 'three';
import { speed, rotationSpeed } from '../../../parameters';

const GameObject = ({ ids, objects, id, map, objectId }) => (
  <mesh
    ref={(ref) => {
      const obsCur = objects.current;
      const obj = obsCur[objectId];
      if (ref && (!obj || (obj && !obj.elref))) {
        obsCur[objectId] = {
          controls: { left: 0, right: 0 },
          controlsOverChannels: { left: 0, right: 0 },
          controlsOverRelay: { left: 0, right: 0 },
          speed,
          rotationSpeed,
          backendPosition: { x: 0, y: 0, z: 1 },
          backendQuaternion: [0, 0, 0, 1],
          elref: ref,
          keyDowns: [],
          ...obj,
        };
        const o = obsCur[objectId];
        if (o.startPosition && o.startQuaternion) {
          o.elref.position.set(...o.startPosition);
          o.elref.quaternion.set(...o.startQuaternion);
        }
      }
    }}
  >
    <meshBasicMaterial attachArray="material" transparent opacity={0} />
    <meshBasicMaterial attachArray="material" transparent opacity={0} />
    <meshBasicMaterial attachArray="material" transparent opacity={0} />
    <meshBasicMaterial attachArray="material" transparent opacity={0} />
    <meshBasicMaterial
      attachArray="material"
      color={ids && objectId === id ? 'orange' : null}
      transparent
      map={map}
    />
    <meshBasicMaterial attachArray="material" transparent opacity={0} />
    <meshBasicMaterial attachArray="material" transparent opacity={0} />

    <boxGeometry
      args={[
        Math.min(1, map.image.width / map.image.height),
        Math.min(1, map.image.height / map.image.width),
        1,
      ]}
    />
  </mesh>
);

GameObject.displayName = 'GameObject';
const MemoGameObject = memo(
  GameObject,
  (prev, next) => prev.objectId === next.objectId,
);

export default MemoGameObject;