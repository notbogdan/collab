import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Store, { Provider } from "./lib/store";
import { onPatch } from "mobx-state-tree";
import socketIOClient from 'socket.io-client';

const socket = socketIOClient(`http://localhost:3000`);

const store = Store.create({
  clientId: Math.random(1000).toString().split(`.`)[0]
});

onPatch(store, patch => {
  
});

ReactDOM.render(
<Provider value={store}>
  <App />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
