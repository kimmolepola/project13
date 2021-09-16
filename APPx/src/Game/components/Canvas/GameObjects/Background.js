import React, { memo } from 'react';

const BackgroundComponent = ({ map }) => (
  <>
    <mesh>
      <planeGeometry args={[map.image.width, map.image.height]} />
      <meshBasicMaterial color="#e5e4e2" map={map} />
    </mesh>
  </>
);

BackgroundComponent.displayName = 'BackgroundComponent';
const MemoBackgroundComponent = memo(
  BackgroundComponent,
  (prev, next) => prev.map === next.map,
);

export default MemoBackgroundComponent;
