const validKeys = ['ArrowLeft', 'ArrowRight'];

const subscribeToKeyboardEvents = ({ id, objects }) => {
  const handleKeyDown = (e) => {
    if (
      validKeys.includes(e.code) &&
      !objects.current[id].keyDowns.includes(e.code)
    ) {
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
