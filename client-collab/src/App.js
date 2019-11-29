import React, { useState, useEffect, useRef } from 'react';
import { observer, inject } from "mobx-react";
import { useStore } from "./lib/store";

// import Textfield from './components/Textfield';

import './App.css';

const App = props => {

	const [response, setResponse] = useState(0);
  const store = useStore();
  const ref = useRef();
  const moEffect = useEffect(() => {
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver((mutationList, observer) => {
      const width = parseInt(ref.current.style.width);
      const height = parseInt(ref.current.style.height);
      store.updateTextArea(width, height);
      console.log(width, height);
    });
    observer.observe(ref.current, config);
  }, [])
	return (
		<div className="App">
      <textarea style={{ width: store.textAreaWidth, height: store.textAreaHeight }} ref={ref} value={store.value} onChange={({ target: { value } }) => store.setValue(value)}></textarea>
		</div>
	);
}

export default observer(App);
