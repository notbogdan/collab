import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { observer, inject } from "mobx-react";
import { useStore } from "./lib/store";

// import Textfield from './components/Textfield';

import './App.css';

const socket = socketIOClient(`http://localhost:3000`);

const App = () => {

	const [response, setResponse] = useState(0);
  const store = useStore();
  
	return (
		<div className="App">
      <textarea value={store.value} onChange={({ target: { value } }) => store.setValue(value)}></textarea>
		</div>
	);
}

export default observer(App);
