import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import { useStore } from "../lib/store";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../lib/constants";

let updatingObject = false;
let dragInProgress = false;

// const onDrag = canvas => {
//   if (dragInProgress) {
//     console.log(`Dragging`)
//   }
// }

// const endDrag = canvas => {
//   dragInProgress = false;
// }

// const beginDrag = canvas => {
//   dragInProgress = true;
// };

const onAddSpotlight = store => {
  const rect = new fabric.Rect({
    width: CANVAS_WIDTH * 2,
    height: CANVAS_HEIGHT * 2,
    top: -(CANVAS_HEIGHT * 2 - CANVAS_HEIGHT) / 2,
    left: -(CANVAS_WIDTH * 2 - CANVAS_WIDTH) / 2,
    fill: 'rgba(0,0,0,.8)'
  });
  const circle = new fabric.Circle({
    radius: 100,
    top: 0 - 100,
    left: 0 - 100
  });
  circle.inverted = true;
  rect.clipPath = circle;
  store.addObject(rect.toJSON())
}

const Canvas = () => {
  const ref = useRef();
  const { store, ui } = useStore();
  
  useEffect(() => {
    console.log(`Initializing state -> canvas autorun`);
    const canvas = new fabric.Canvas(ref.current);
    window.__canvas = canvas;

    canvas.freeDrawingBrush.color = `#ffffff`;
    canvas.freeDrawingBrush.width = 10;

    // Connect data store to fabric
    autorun(() => {
      const objects = store.objects.toJSON();
      const json = {
        objects: Object.values(objects)
      }
      console.log(`Redrawing canvas from state`, json);
      canvas.loadFromJSON(json);
    })

    // Connect UI store to fabric
    autorun(() => {
      canvas.isDrawingMode = ui.drawingMode
    })

    // Canvas dimensions
    canvas.setDimensions({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

    // Events
    canvas.on(`path:created`, e => {
      store.addObject(e.path.toJSON());
    });
    canvas.on(`object:added`, e => {
      // store.addObject(e.target.toJSON());
    });
    canvas.on(`object:moving`, e => {
      console.log(`Hello?`)
      const object = e.target;
      store.updateObject(object.id, object.toJSON());
    });
    canvas.on(`object:scaling`, e => {
      const object = e.target;
      store.updateObject(object.id, object.toJSON());
    });
    // canvas.on(`mouse:down`, () => beginDrag(canvas));
    // canvas.on(`mouse:move`, () => onDrag(canvas));
    // canvas.on(`mouse:up`, () => endDrag(canvas))
  }, []);
  return (
    <div style={{ zIndex: 100, position: `relative` }}>
      <div style={{position: `relative` }}>
        {ui.zoomToolMode && <div style={{ zIndex: 10, width: `100%`, height: `100%`, top: 0, left: 0, position: `absolute` }} onClick={(e) => {
          e.persist()
          ui.toggleZoomToolMode();
          const video = document.querySelector(`video`);
          var canvas = document.createElement('canvas');
          canvas.height = parseInt(video.style.height);
          canvas.width = parseInt(video.style.width);
          var ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          var img = new Image();
          img.src = canvas.toDataURL();
          img.onload = () => {
            const offsetFromCenter = {
              x: e.clientX - canvas.width / 2,
              y: e.clientY - canvas.height / 2
            };
            const video1 = new fabric.Image(img, {
              left: -(e.clientX * 1.5 - e.clientX),
              top: -(e.clientY * 1.5 - e.clientY),
              width: canvas.width,
              height: canvas.height,
            }).scale(1.5);
            store.addObject(video1.toJSON())
          }
        }}></div>}
        <div>
          <canvas ref={ref}></canvas>
        </div>
      </div>
      <button disabled={store.playbackState.playing || ui.drawingMode || ui.zoomToolMode} onClick={() => onAddSpotlight(store)}>Add spotlight</button>
      <button disabled={store.playbackState.playing || ui.drawingMode} onClick={ui.toggleZoomToolMode}>{ui.zoomToolMode ? <b>Zoom tool</b> : <>Zoom tool</>}</button>
      <button disabled={store.playbackState.playing || ui.zoomToolMode} onClick={ui.toggleDrawingMode}>{ui.drawingMode ? <b>Drawing tool</b> : <>Drawing tool</>}</button>
      <button onClick={store.clearCanvas}>Clear</button>
    </div>
  )
}

export default observer(Canvas);