import { types, destroy } from "mobx-state-tree";
import React, { useContext } from "react";
import { fabric } from "fabric";

const MSTContext = React.createContext(null);
const uid = () => (Math.random() * 10000).toString().split(`.`)[1];

// eslint-disable-next-line prefer-destructuring
export const Provider = MSTContext.Provider;

export function useStore() {
  const store = useContext(MSTContext);

  return store;
}

export const UI = types.model(`UI`, {
  drawingMode: false,
  zoomToolMode: false,
  spotlightMode: false
})
.actions(self => ({
  toggleDrawingMode() {
    self.drawingMode = !self.drawingMode;
  },
  toggleZoomToolMode() {
    self.zoomToolMode = !self.zoomToolMode;
  },
  toggleSpotlightMode() {
    self.spotlightMode = !self.spotlightMode;
  }
}));

export const Store = types.model(`Store`, {
  objects: types.optional(types.map(types.frozen()), {}),
  currentTime: 0,
  playbackState: types.frozen(),
})
.actions(self => ({
  addObject(object) {
    const id = uid();
    self.objects.set(id, {
      id: id,
      ...object
    });
  },
  updateObject(id, json){
    json.id = id;
    self.objects.set(id, json);
  },
  togglePlayback(time) {
    self.playbackState = {
      ...self.playbackState,
      updatedAt: time,
      playing: !self.playbackState.playing
    }
  },
  setCurrentTime(time) {
    self.currentTime = time;
  },
  setPlaybackState(state) {
    self.playbackState = {
      ...self.playbackState,
      ...state
    }
  },
  clearCanvas() {
    self.objects.forEach(({ id }) => self.objects.delete(id));
  }
}));

export const createStores = () => {
  const ui = UI.create({});
  const store = Store.create({
    playbackState: {
      updatedAt: 0,
      playing: false
    }
  });
  return {
    ui, store
  }
}