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
  /* eslint-disable no-param-reassign */
  const qua = new Quaternion();
  let nextSendTime = Date.now();
  let nextSendTimeRelay = Date.now();

  const handleSelf = (ownObj, delta) => {
    for (let ii = ownObj.keyDowns.length - 1; ii > -1; ii -= 1) {
      switch (ownObj.keyDowns[ii]) {
        case 'left':
          ownObj.controls.left += delta;
          ownObj.controlsOverChannels.left += delta;
          ownObj.controlsOverRelay.left += delta;
          break;
        case 'right':
          ownObj.controls.right += delta;
          ownObj.controlsOverChannels.right += delta;
          ownObj.controlsOverRelay.right += delta;
          break;
        default:
          break;
      }
    }
  };

  const handleCamera = (state, ownRef) => {
    state.camera.position.x = ownRef.position.x;
    state.camera.position.y = ownRef.position.y;
    state.camera.rotation.z = ownRef.rotation.z;
  };

  const handleText = (ownRef) => {
    const degree = Math.round(radiansToDegrees(-ownRef.rotation.z));
    const heading = degree < 0 ? degree + 360 : degree;
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
          Object.keys(o.controls).forEach((x) => {
            if (o.controls[x] > 0) {
              const division = o.controls[x] / delta;
              if (division >= 1) {
                // while pressing key, if delta on user has been same or more than delta here
                switch (x) {
                  case 'left':
                    o.elref.rotateZ(o.rotationSpeed * delta * o.controls[x]);
                    break;
                  case 'right':
                    o.elref.rotateZ(
                      -1 * o.rotationSpeed * delta * o.controls[x],
                    );
                    break;
                  default:
                    break;
                }
                o.controls[x] -= delta * o.controls[x];
              } else {
                // while pressing key, if delta on user has been less than delta here
                switch (x) {
                  case 'left':
                    o.elref.rotateZ(
                      o.rotationSpeed * delta * o.controls[x] * division,
                    );
                    break;
                  case 'right':
                    o.elref.rotateZ(
                      -1 * o.rotationSpeed * delta * o.controls[x] * division,
                    );
                    break;
                  default:
                    break;
                }
                o.controls[x] -= delta * division;
              }
            }
          });
          o.elref.translateY(o.speed * delta);
          if (main !== id) {
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

  const getUpdateData = (viaRelay) => {
    const data = { type: 'update', update: {} };
    objectIds.current.forEach((oid) => {
      const o =
        objects.current[oid] && objects.current[oid].elref
          ? objects.current[oid]
          : undefined;
      if (o) {
        data.update[oid] = {
          controlsOverNetwork: viaRelay
            ? o.controlsOverRelay
            : o.controlsOverChannels,
          position: o.elref.position,
          quaternion: o.elref.quaternion.toArray(),
          speed: o.speed,
          rotationSpeed: o.rotationSpeed,
        };
        if (viaRelay) {
          o.controlsOverRelay = { left: 0, right: 0 }; // reset
        } else {
          o.controlsOverChannels = { left: 0, right: 0 }; // reset
        }
      }
    });
    return data;
  };

  const getControlsData = (viaRelay) => {
    const controlsData = {
      type: 'controlsOverNetwork',
      controlsOverNetwork: {
        left: viaRelay
          ? objects.current[id].controlsOverRelay.left
          : objects.current[id].controlsOverChannels.left,
        right: viaRelay
          ? objects.current[id].controlsOverRelay.right
          : objects.current[id].controlsOverChannels.right,
      },
    };
    if (viaRelay) {
      objects.current[id].controlsOverRelay.left = 0; // reset
      objects.current[id].controlsOverRelay.right = 0; // reset
    } else {
      objects.current[id].controlsOverChannels.left = 0; // reset
      objects.current[id].controlsOverChannels.right = 0; // reset
    }
    return controlsData;
  };

  useFrame((state, delta) => {
    if (Date.now() > nextSendTime && objects.current[id]) {
      nextSendTime =
        Date.now() + (main && main === id ? sendIntervalMain : sendInterval);
      if (main && main === id) {
        sendDataOnUnorderedChannels(getUpdateData(false), channels);
      } else {
        sendDataOnUnorderedChannels(getControlsData(false), channels);
      }
    }
    if (Date.now() > nextSendTimeRelay && objects.current[id]) {
      nextSendTimeRelay =
        Date.now() +
        (main && main === id ? relaySendIntervalMain : relaySendInterval);
      if (main && main === id) {
        sendDataOnRelay(getUpdateData(true), relay);
      } else {
        sendDataOnRelay(getControlsData(true), relay);
      }
    }

    const ownRef = objects.current[id] ? objects.current[id].elref : undefined;

    if (ownRef && ownRef.position) {
      handleSelf(objects.current[id], delta);
      handleCamera(state, ownRef);
      handleText(ownRef);
    }
    handleObjects(delta);
  });
  return <></>;
};
export default Loop;
