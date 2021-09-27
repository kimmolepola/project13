import React, { memo } from 'react';

const GameObject = ({ ids, objects, id, map, objectId }) => (
  <mesh
    ref={(ref) => {
      const obj = objects.current[objectId];
      if (ref && obj && !obj.elref) {
        obj.elref = ref;
        obj.elref.position.set(...obj.startPosition);
        obj.elref.quaternion.set(...obj.startQuaternion);
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
