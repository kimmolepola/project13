import { sendMessage } from './messageHandler';

const validKeys = ['ArrowLeft', 'ArrowRight'];

const subscribeToKeyboardEvents = ({ id, objects }) => {
  const handleKeyDown = (e) => {
    if (validKeys.includes(e.code)) {
      objects.current[id].keyDowns.push(e.code);
    }
  };

  const handleKeyUp = (e) => {
    if (e.repeat) return;
    if (validKeys.includes(e.code)) {
      const index = objects.current[id].keyDowns.findIndex((x) => x === e.code);
      if (index !== -1) objects.current[id].keyDowns.splice(index, 1);
    }
  };
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('keydown', handleKeyDown);
  return () => {
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('keydown', handleKeyDown);
  };
};
export default subscribeToKeyboardEvents;

/*
import { sendMessage } from './networkMessages';

const validKeys = ['ArrowLeft', 'ArrowRight'];

const subscribeToKeyboardEvents = ({ remotes, objects, id }) => {
  const handleKeyUp = (e) => {
    const key = e.code;
    if (validKeys.includes(e.code)) {
      if (objects.current[id] && objects.current[id].keyDowns) {
        const { keyDowns } = objects.current[id];
        const index = keyDowns.indexOf(e.code);
        if (index !== -1) {
          keyDowns.splice(index, 1);
        }
      }
      //      socket.emit('keyup', key);
    }
  };

  const handleKeyDown = (e) => {
    if (e.repeat) return;
    const key = e.code;
    if (validKeys.includes(e.code) && objects.current[id]) {
      if (!objects.current[id].keyDowns) {
        objects.current[id].keyDowns = []; // eslint-disable-line no-param-reassign
      }
      if (!objects.current[id].keyDowns.includes(key)) {
        objects.current[id].keyDowns.push(key);
      }
      // socket.emit('keydown', key);
    }
  };
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('keydown', handleKeyDown);
  return () => {
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('keydown', handleKeyDown);
  };
};
export default subscribeToKeyboardEvents;
*/
