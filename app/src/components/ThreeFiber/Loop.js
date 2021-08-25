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
    for (let i = objectIds.current.length - 1; i > -1; i -= 1) {
      if (objects.current[objectIds.current[i]]) {
        const o = objects.current[objectIds.current[i]];
        if (o && o.elref) {
          if (main || true) { // eslint-disable-line
            for (let ii = o.keyDowns.length - 1; ii > -1; ii -= 1) {
              switch (o.keyDowns[ii]) {
                case 'ArrowLeft':
                  o.elref.rotateZ(o.rotationSpeed * delta);
                  break;
                case 'ArrowRight':
                  o.elref.rotateZ(-1 * o.rotationSpeed * delta);
                  break;
                default:
                  break;
              }
            }
            o.elref.translateY(o.speed * delta);
          }
          if (!main) {
            o.elref.position.lerp(o.backendPosition, interpolationAlpha);
            o.elref.quaternion.slerp(
              qua.fromArray(o.backendQuaternion),
              interpolationAlpha,
            );
          }
        }
      }
    }
  };

  const getUpdateData = () => {
    const data = { type: 'update', update: {} };
    objectIds.current.forEach((oid) => {
      const o =
        objects.current[oid] && objects.current[oid].elref
          ? objects.current[oid]
          : undefined;
      if (o) {
        data.update[oid] = {
          keyDowns: o.keyDowns,
          position: o.elref.position,
          quaternion: o.elref.quaternion.toArray(),
          speed: o.speed,
          rotationSpeed: o.rotationSpeed,
        };
      }
    });
    return data;
  };

  const getKeyDownsData = () => ({
    type: 'keyDowns',
    keyDowns: objects.current[id].keyDowns,
  });

  useFrame((state, delta) => {
    if (Date.now() > nextSendTime && objects.current[id]) {
      nextSendTime = Date.now() + (main ? sendIntervalMain : sendInterval);
      if (main) {
        sendDataOnUnorderedChannels(getUpdateData(), channels);
      } else {
        sendDataOnUnorderedChannels(getKeyDownsData(), channels);
      }
    }
    if (Date.now() > nextSendTimeRelay && objects.current[id]) {
      nextSendTimeRelay =
        Date.now() + (main ? relaySendIntervalMain : relaySendInterval);
      if (main) {
        sendDataOnRelay(getUpdateData(), relay);
      } else {
        sendDataOnRelay(getKeyDownsData(), relay);
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
