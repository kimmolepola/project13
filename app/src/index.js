import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';
import connect from './connection/connection';

const { id, channel, relaySocket } = connect();

ReactDOM.render(
  <React.StrictMode>
    <App id={id} channel={channel} socket={relaySocket} />
  </React.StrictMode>,
  document.getElementById('root'),
);
