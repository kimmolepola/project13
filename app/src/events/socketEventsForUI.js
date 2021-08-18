import { chatMessageTimeToLiveSeconds } from '../parameters';

export const sendChatComment = ({ socket, message }) => {
  socket.emit('chatMessage', message);
};

const subscribeToSocketEventsForUI = ({ socket, setMessages }) => {
  const receiveChatMessage = (arg) => {
    setMessages((x) => [arg, ...x]);
    setTimeout(
      () => setMessages((x) => x.filter((xx) => xx !== arg)),
      chatMessageTimeToLiveSeconds * 1000,
    );
  };

  socket.on('chatMessage', receiveChatMessage);
  return () => {
    socket.off('chatMessage', receiveChatMessage);
  };
};

export default subscribeToSocketEventsForUI;
