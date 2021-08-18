import React from 'react';
import { Quaternion } from 'three';
import { useFrame } from '@react-three/fiber';
import { radiansToDegrees } from '../../utils';
import { interpolationAlpha } from '../../parameters';

const loop = ({ text, id, objectIds, objects }) => {
  const qua = new Quaternion();
  let next = Date.now();

  const handleCamera = (state, ownRef) => {
    /* eslint-disable no-param-reassign */
    state.camera.position.x = ownRef.position.x;
    state.camera.position.y = ownRef.position.y;
    state.camera.rotation.z = ownRef.rotation.z;
    /* eslint-enable */
  };

  const handleText = (ownRef) => {
    const degree = Math.round(radiansToDegrees(-ownRef.rotation.z));
    const heading = degree < 0 ? degree + 360 : degree;
    // eslint-disable-next-line no-param-reassign
    text.current.textContent = `
      x: ${ownRef.position.x.toFixed(0)}
      y: ${ownRef.position.y.toFixed(0)}
      z: ${ownRef.position.z.toFixed(0)}
      heading: ${heading}
      `;
  };

  const handleObjects = (delta) => {
    for (let i = objectIds.length - 1; i > -1; i -= 1) {
      if (objectIds[i] && objects.current[objectIds[i]]) {
        const o = objects.current[objectIds[i]];
        o.elref.position.lerp(o.backendPosition, interpolationAlpha);
        o.elref.quaternion.slerp(
          qua.fromArray(o.backendQuaternion),
          interpolationAlpha,
        );
      }
    }
  };

  useFrame((state, delta) => {
    if (Date.now() > next) {
      next = Date.now() + 10000;
      // console.log('all ids:', allObjectIds);
      // console.log('all objects:', Object.keys(objects.current));
    }
    const ownRef = objects.current[id] ? objects.current[id].elref : undefined;

    handleObjects(delta);
    if (ownRef && ownRef.position) {
      handleCamera(state, ownRef);
      handleText(ownRef);
    }
  });
  return <></>;
};
export default loop;
