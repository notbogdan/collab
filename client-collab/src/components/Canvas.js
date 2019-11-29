import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { autorun } from "mobx";
import { useStore } from "../lib/store";

let updatingObject = false;

const Canvas = () => {
  const ref = useRef();
  const store = useStore();
  
  useEffect(() => {
    console.log(`Initializing state -> canvas autorun`);

    autorun(() => {
      if (store.objects.size > 0) {
        let json = store.toJSON();
        json = {
          ...json,
          objects: Object.values(json.objects)
        }
        canvas.loadFromJSON(json);
      }
    })
    
    const canvas = new fabric.Canvas(ref.current);
    canvas.setDimensions({ width: 1000, height: 800 });
    canvas.on(`object:moving`, e => {
      const object = e.target;
      store.updateObject(object.id, object.toJSON());
    });
    canvas.on(`object:scaling`, e => {
      const object = e.target;
      store.updateObject(object.id, object.toJSON());
    });
  }, []);
  return (
    <canvas ref={ref}></canvas>
  )
}

export default Canvas;