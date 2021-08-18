const subscribeToSocketEventsForGame = ({
  socket,
  setAllObjectIds,
  objects,
  allObjectIds,
  ownObjectId,
  setOwnObjectId,
}) => {
  const createObject = (arg) => {
    setAllObjectIds((x) => [...x, arg]);
  };
  const deleteObject = (arg) => {
    setAllObjectIds((x) => x.filter((xx) => xx !== arg));
  };
  const update = (arg) => {
    for (let i = allObjectIds.length - 1; i > -1; i -= 1) {
      const objectLocal = objects.current[allObjectIds[i]];
      const objectBackend = arg[allObjectIds[i]];
      if (objectLocal && objectBackend) {
        if (allObjectIds[i] !== ownObjectId) {
          objectLocal.keyDowns = objectBackend.keyDowns;
        }
        objectLocal.rotationSpeed = objectBackend.rotationSpeed;
        objectLocal.speed = objectBackend.speed;
        objectLocal.backendPosition = objectBackend.position;
        objectLocal.backendQuaternion = objectBackend.quaternion;
      }
    }
  };
  const allObjects = (arg) => {
    setAllObjectIds(arg);
  };

  socket.on('create', createObject);
  socket.on('delete', deleteObject);
  socket.on('update', update);
  socket.on('allObjects', allObjects);
  return () => {
    socket.off('create', createObject);
    socket.off('delete', deleteObject);
    socket.off('update', update);
    socket.off('allObjects', allObjects);
  };
};

export default subscribeToSocketEventsForGame;
