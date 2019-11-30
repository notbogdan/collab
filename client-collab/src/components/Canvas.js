import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { autorun } from "mobx";
import { useStore } from "../lib/store";

let updatingObject = false;
let dragInProgress = false;

const onDrag = canvas => {
  if (dragInProgress) {
    console.log(`Dragging`)
  }
}

const endDrag = canvas => {
  dragInProgress = false;
}

const beginDrag = canvas => {
  dragInProgress = true;
};


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
    canvas.setDimensions({ width: 888, height: 500 });
    canvas.on(`object:moving`, e => {
      const object = e.target;
      store.updateObject(object.id, object.toJSON());
    });
    canvas.on(`object:scaling`, e => {
      const object = e.target;
      store.updateObject(object.id, object.toJSON());
    });
    canvas.on(`mouse:down`, () => beginDrag(canvas));
    canvas.on(`mouse:move`, () => onDrag(canvas));
    canvas.on(`mouse:up`, () => endDrag(canvas))
  }, []);
  return (
    <div style={{ zIndex: 100, position: `relative`}}>
      <canvas ref={ref}></canvas>
    </div>
  )
}

export default Canvas;