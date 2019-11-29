import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Store, { Provider } from "./lib/store";
import { onPatch, applyPatch } from "mobx-state-tree";
import socketIOClient from 'socket.io-client';

const socket = socketIOClient(`http://dfe9fa5a.ngrok.io`);
const uid = () => (Math.random() * 10000).toString().split(`.`)[1];
const store = Store.create({
  clientId: uid()
});

let isHandlingMessage = true;

onPatch(store, patch => {
  if (!isHandlingMessage) {
    socket.emit(`patching`, {
      ...patch,
    });
  }
});

socket.on(`patching client`, data => {
  isHandlingMessage = true;
  applyPatch(store, data);
  isHandleMessage = false;
});

ReactDOM.render(
<Provider value={store}>
  <App />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
