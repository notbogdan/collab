import { types } from "mobx-state-tree";
import React, { useContext } from "react";

const MSTContext = React.createContext(null);

// eslint-disable-next-line prefer-destructuring
export const Provider = MSTContext.Provider;

export function useStore() {
  const store = useContext(MSTContext);

  return store;
}

export default types.model(`Store`, {
  clientId: ``,
  value: ``,
  textAreaWidth: 200,
  textAreaHeight: 100
})
.actions(self => ({
  setValue(string) {
    self.value = string;
  },
  updateTextArea(width, height) {
    self.textAreaHeight = height;
    self.textAreaWidth = width;
  }
}));
