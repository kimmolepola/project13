const validKeys = ['ArrowLeft', 'ArrowRight'];

const subscribeToKeyboardEvents = ({ channel, socket, objects, id }) => {
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
      socket.emit('keyup', key);
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
      socket.emit('keydown', key);
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
