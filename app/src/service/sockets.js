import { io } from 'socket.io-client';

export const relay = io(process.env.REACT_APP_RELAY_SERVER);
export const signaling = io(process.env.REACT_APP_SIGNALING_SERVER);
