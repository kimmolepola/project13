const validKeys = ['ArrowLeft', 'ArrowRight'];

const subscribeToKeyboardEvents = ({ socket, objects, ownObjectId }) => {
  const handleKeyUp = (e) => {
    const key = e.code;
    if (validKeys.includes(e.code)) {
      if (
        objects.current[ownObjectId] &&
        objects.current[ownObjectId].keyDowns
      ) {
        const { keyDowns } = objects.current[ownObjectId];
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
    if (validKeys.includes(e.code) && objects.current[ownObjectId]) {
      if (!objects.current[ownObjectId].keyDowns) {
        objects.current[ownObjectId].keyDowns = []; // eslint-disable-line no-param-reassign
      }
      if (!objects.current[ownObjectId].keyDowns.includes(key)) {
        objects.current[ownObjectId].keyDowns.push(key);
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
