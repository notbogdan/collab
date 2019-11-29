import React, { useState, useEffect, useRef } from 'react';
import { observer, inject } from "mobx-react";
import { useStore } from "./lib/store";
import Canvas from "./components/Canvas";

// import Textfield from './components/Textfield';

import './App.css';

const App = props => {

  const store = useStore();

	return (
		<div className="App">
      <Canvas />
      <button onClick={store.addObject}>Add circle</button>
		</div>
	);
}

export default observer(App);
