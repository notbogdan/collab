import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Store, { Provider } from "./lib/store";
import { onPatch, applyPatch } from "mobx-state-tree";
import socketIOClient from 'socket.io-client';

const socket = socketIOClient(`http://94ebe6af.ngrok.io`);
const store = Store.create({
  playbackState: {
    currentTime: 0,
    playing: false
  }
});

const handleVideoUpdate = patch => {
  const video = document.querySelector(`video`);
  const handleSeeked = () => {
    video.removeEventListener(`onseeked`, handleSeeked)
  };  
  if (patch.op === `replace` && patch.path === `/playbackState`) {
    // paused -> playing
    if (video.paused && patch.value.playing) {
      if (video.currentTime !== patch.value.currentTime) {
        video.addEventListener(`onseeked`, () => handleSeeked(() => {
          video.play();
        }))
        video.currentTime = patch.value.currentTime
      } else {
        video.play();
      }
    }
    // playing -> paused
    if (!video.paused && !patch.value.playing) {
      video.pause();
      video.currentTime = patch.value.currentTime
    }
    // seek
    if (video.paused && !patch.value.playing) {
      video.currentTime = patch.value.currentTime
    }
  }
}

const handlePatchSideEffects = patch => {
  console.log(`Handling side effects for`, patch);
  handleVideoUpdate(patch);
}

window.store = store;

let isHandlingMessage = false;

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

ReactDOM.render(
<Provider value={store}>
  <App />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
