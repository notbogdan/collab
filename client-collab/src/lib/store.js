import { types } from "mobx-state-tree";
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

const playbackState = types.model(`PlaybackState`, {
  currentTime: 0,
  playing: false
});

export default types.model(`Store`, {
  objects: types.optional(types.map(types.frozen()), {}),
  currentTime: 0,
  playbackState: types.frozen()
})
.actions(self => ({
  addObject(type) {
    let circle = new fabric.Circle({
      radius: 20, fill: 'green', left: 100, top: 100
    });
    circle = circle.toJSON();
    const id = uid();
    self.objects.set(id, {
      id: id,
      ...circle
    });
  },
  updateObject(id, json){
    json.id = id;
    self.objects.set(id, json);
  },
  setCurrentTime(time) {
    self.currentTime = time;
  },
  togglePlayback(time) {
    self.playbackState = {
      currentTime: time,
      playing: !self.playbackState.playing
    }
  }
}));
