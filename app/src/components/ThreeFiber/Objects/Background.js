import React, { memo } from 'react';

const BackgroundComponent = ({ map }) => (
  <mesh>
    <planeGeometry args={[map.image.width / 2, map.image.height / 2]} />
    <meshBasicMaterial map={map} />
  </mesh>
);

BackgroundComponent.displayName = 'BackgroundComponent';
const MemoBackgroundComponent = memo(
  BackgroundComponent,
  (prev, next) => prev.map === next.map,
);

export default MemoBackgroundComponent;
