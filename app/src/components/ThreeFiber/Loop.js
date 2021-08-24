import React from 'react';
import { Quaternion } from 'three';
import { useFrame } from '@react-three/fiber';
import { radiansToDegrees } from '../../utils';
import {
  interpolationAlpha,
  sendInterval,
  relaySendInterval,
  sendIntervalMain,
  relaySendIntervalMain,
} from '../../parameters';
import {
  sendDataOnUnorderedChannels,
  sendDataOnRelay,
} from '../../messageHandler';

const Loop = ({ relay, channels, main, text, id, objectIds, objects }) => {
  const qua = new Quaternion();
  let nextSendTime = Date.now();
  let nextSendTimeRelay = Date.now();

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
      if (objectIds.current[i] && objects.current[objectIds.current[i]]) {
        const o = objects.current[objectIds.current[i]];
        o.elref.position.lerp(o.backendPosition, interpolationAlpha);
        o.elref.quaternion.slerp(
          qua.fromArray(o.backendQuaternion),
          interpolationAlpha,
        );
      }
    }
  };

  const getUpdateData = () => {
    const data = { type: 'update', update: {} };
    objectIds.current.forEach((oid) => {
      const o = objects.current[oid];
      if (o) {
        data.update[oid] = {
          keyDowns: o.keyDowns,
          position: o.position,
          quaternion: o.quaternion.toArray(),
          speed: o.speed,
          rotationSpeed: o.rotationSpeed,
        };
      }
    });
    return data;
  };

  const keyDownsData = {
    type: 'keyDowns',
    keyDowns: objects.current[id].keyDowns,
  };

  useFrame((state, delta) => {
    if (Date.now() > nextSendTime) {
      nextSendTime = Date.now() + main ? sendIntervalMain : sendInterval;
      if (main) {
        sendDataOnUnorderedChannels(getUpdateData(), channels);
      } else {
        sendDataOnUnorderedChannels(keyDownsData, channels);
      }
    }
    if (Date.now() > nextSendTimeRelay) {
      nextSendTimeRelay =
        Date.now() + main ? relaySendIntervalMain : relaySendInterval;
      if (main) {
        sendDataOnRelay(getUpdateData(), relay);
      } else {
        sendDataOnRelay(keyDownsData, relay);
      }
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
export default Loop;
