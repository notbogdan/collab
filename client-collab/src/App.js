import React, { useRef } from 'react';
import { observer, inject } from "mobx-react";
import { useStore } from "./lib/store";
import Canvas from "./components/Canvas";

// import Textfield from './components/Textfield';

import './App.css';

const App = props => {

  const { store, ui } = useStore();
  const ref = useRef();

  return (
    <div className="App">
      <Canvas />
      <video
        onDurationChange={e => {
          store.setPlaybackState({
            duration: e.target.duration
          });
        }}
        onTimeUpdate={e => {
          if (store.currentTime !== e.target.currentTime) {
            store.setCurrentTime(e.target.currentTime);
          }
        }} ref={ref} style={{
          left: 0,
          top: 0,
          height: 500,
          width: 888,
          position: `absolute`
        }} preload="auto" src="/file_example_MP4_1280_10MG.mp4"></video>
      <button onClick={() => store.togglePlayback(ref.current.currentTime)}>{store.playbackState.playing ? `Pause` : `Play`}</button>
      <label>
        {store.currentTime}
        <input type="range" onChange={e => store.setCurrentTime(parseInt(e.target.value))} value={store.currentTime} min={0} max={store.playbackState.duration} step={.1}></input>
      </label>
    </div>
  );
}

export default observer(App);
