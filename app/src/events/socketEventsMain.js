const subscribeToSocketEventsMain = ({ setOwnId, socket }) => {
  const initialize = (arg) => {
    console.log('initialize:', arg);
    setOwnId(arg);
  };
  socket.on('initialize', initialize);
  return () => {
    socket.off('initialize', initialize);
  };
};
export default subscribeToSocketEventsMain;
