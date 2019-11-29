import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

import Textfield from './components/Textfield';

import './App.css';

const App = () => {

	const [response, setResponse] = useState(0);
	const socket = socketIOClient(`http://localhost:3000`);

	useEffect(() => {
		socket.on(`news`, data => setResponse(data));
	}, [])

	const sendMessage = () => {
		console.log(`sending a message`);
		socket.emit(`updating`, `hello`, `world`, function(data){
			setResponse(data);
		});
	}

	console.log(`checking response`, response);

	return (
		<div className="App">
			<button onClick={sendMessage}>Click me</button>
			<Textfield />
			<Textfield />
		</div>
	);
}

export default App;
