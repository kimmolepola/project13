import React from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import App from './App';
import './styles.css';

const socket = io('ws://localhost:3300');

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>,
  document.getElementById('root'),
);
