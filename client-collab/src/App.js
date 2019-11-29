import React, { useState, useEffect } from 'react';
import { observer, inject } from "mobx-react";
import { useStore } from "./lib/store";

// import Textfield from './components/Textfield';

import './App.css';

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
