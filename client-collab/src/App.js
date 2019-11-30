import React, { useRef } from 'react';
import { observer, inject } from "mobx-react";
import { useStore } from "./lib/store";
import Canvas from "./components/Canvas";

// import Textfield from './components/Textfield';

import './App.css';

const App = props => {

  const store = useStore();
  const ref = useRef();

	return (
		<div className="App">
      <Canvas />
      <video ref={ref} style={{
        left: 0,
        top: 0,
        height: 500,
        width: 888,
        position: `absolute`
      }} src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4"></video>
      <button onClick={store.addObject}>Add circle</button>
      <button onClick={() => store.togglePlayback(ref.current.currentTime)}>{store.playbackState.playing ? `Pause` : `Play`}</button>
		</div>
	);
}

export default observer(App);
