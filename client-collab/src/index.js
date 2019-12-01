import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider, createStores } from "./lib/store.js";
import { onPatch, applyPatch, applySnapshot } from "mobx-state-tree";
import socketIOClient from 'socket.io-client';
import { fabric } from "fabric";

const { store, ui } = createStores();

let isHandlingMessage = false;
const socket = socketIOClient(`http://178.62.86.47:3001/`);

socket.emit(`stateRequest`, `newConnection`, snapshot => {
  applySnapshot(store, snapshot);

  onPatch(store, patch => {
    handlePatchSideEffects(patch);
    if (!isHandlingMessage) {
      socket.emit(`patching`, patch);
    }
  });
  
  socket.on(`patching client`, patch => {
    isHandlingMessage = true;
    applyPatch(store, patch);
    handlePatchSideEffects(patch);
    isHandlingMessage = false;
  });
});

const handleVideoUpdate = patch => {
  const video = document.querySelector(`video`);
  const handleSeeked = () => {
    video.removeEventListener(`onseeked`, handleSeeked)
  };
  if (patch.op === `replace` && patch.path === `/playbackState`) {
    // paused -> playing
    if (video.paused && patch.value.playing) {
      if (video.currentTime !== patch.value.updatedAt) {
        video.addEventListener(`onseeked`, () => handleSeeked(() => {
          video.play();
        }))
        video.currentTime = patch.value.updatedAt
      } else {
        video.play();
      }
    }
    // playing -> paused
    if (!video.paused && !patch.value.playing) {
      video.pause();
      video.currentTime = patch.value.updatedAt
    }
  }
  if (patch.op === `replace` && patch.path === `/currentTime` && video.paused && !store.playbackState.playing) {
      video.currentTime = patch.value;
  }
}

const handlePatchSideEffects = patch => {
  console.log(`Handling side effects for`, patch);
  handleVideoUpdate(patch);
}

window.store = store;

ReactDOM.render(
  <Provider value={{ store, ui }}>
    <App />
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
