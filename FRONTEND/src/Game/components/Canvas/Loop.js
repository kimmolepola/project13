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
} from '../../../networking/services/game.service';

const Loop = ({
  score,
  relay,
  channels,
  main,
  text,
  id,
  objectIds,
  objects,
}) => {
  /* eslint-disable no-param-reassign */
  const ownObj = objects.current[id];
  const qua = new Quaternion();
  let nextSendTime = Date.now();
  let nextSendTimeRelay = Date.now();
  let nextScoreTime = Date.now();

  const handleSelf = (delta) => {
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
    state.camera.translateY(3);
  };

  const handleText = (ownRef) => {
    const degree = Math.round(radiansToDegrees(-ownRef.rotation.z));
    const heading = degree < 0 ? degree + 360 : degree;
    text.current.textContent = `x: ${ownRef.position.x.toFixed(0)}
      y: ${ownRef.position.y.toFixed(0)}
      z: ${ownRef.position.z.toFixed(0)}
      heading: ${heading}
      speed: ${ownObj.speed.toFixed(1)}`;
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
          ? ownObj.controlsOverRelay.left
          : ownObj.controlsOverChannels.left,
        right: viaRelay
          ? ownObj.controlsOverRelay.right
          : ownObj.controlsOverChannels.right,
      },
    };
    if (viaRelay) {
      ownObj.controlsOverRelay.left = 0; // reset
      ownObj.controlsOverRelay.right = 0; // reset
    } else {
      ownObj.controlsOverChannels.left = 0; // reset
      ownObj.controlsOverChannels.right = 0; // reset
    }
    return controlsData;
  };

  useFrame((state, delta) => {
    if (ownObj) {
      if (Date.now() > nextScoreTime) {
        objectIds.current.forEach((x) => {
          if (objects.current[x]) {
            objects.current[x].score += 1;
          }
        });
        score.current.textContent = `Score: ${ownObj.score}`;
        nextScoreTime += 3700;
      }
      if (Date.now() > nextSendTime && ownObj) {
        nextSendTime =
          Date.now() + (main && main === id ? sendIntervalMain : sendInterval);
        if (main && main === id) {
          sendDataOnUnorderedChannels(getUpdateData(false), channels);
        } else {
          sendDataOnUnorderedChannels(getControlsData(false), channels);
        }
      }
      if (Date.now() > nextSendTimeRelay && ownObj) {
        nextSendTimeRelay =
          Date.now() +
          (main && main === id ? relaySendIntervalMain : relaySendInterval);
        if (main && main === id) {
          sendDataOnRelay(getUpdateData(true), relay);
        } else {
          sendDataOnRelay(getControlsData(true), relay);
        }
      }

      const ownRef = ownObj ? ownObj.elref : undefined;

      if (ownRef && ownRef.position) {
        handleSelf(delta);
        handleCamera(state, ownRef);
        handleText(ownRef);
      }
      handleObjects(delta);
    }
  });
  return <></>;
};
export default Loop;
