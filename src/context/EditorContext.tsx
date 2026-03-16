import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { PopupConfig, PopupElement } from '../types/popup';
import type { EditorState, EditorAction } from '../types/editor';
import { createDefaultPopupConfig } from '../data/defaults';
import { nanoid } from 'nanoid';

function deepCloneElement(el: PopupElement): PopupElement {
  const cloned = JSON.parse(JSON.stringify(el));
  cloned.id = nanoid();
  if (cloned.type === 'box' && cloned.children) {
    cloned.children = cloned.children.map(deepCloneElement);
  }
  if (cloned.type === 'carousel' && cloned.slides) {
    cloned.slides = cloned.slides.map((s: { id: string; elements: PopupElement[] }) => ({
      ...s,
      id: nanoid(),
      elements: s.elements.map(deepCloneElement),
    }));
  }
  return cloned;
}

function updateElementInTree(
  elements: PopupElement[],
  id: string,
  updater: (el: PopupElement) => PopupElement | null,
): PopupElement[] {
  const result: PopupElement[] = [];
  for (const el of elements) {
    if (el.id === id) {
      const updated = updater(el);
      if (updated) result.push(updated);
      continue;
    }
    if (el.type === 'box') {
      result.push({
        ...el,
        children: updateElementInTree(el.children, id, updater),
      });
    } else {
      result.push(el);
    }
  }
  return result;
}

function addElementToTree(
  elements: PopupElement[],
  parentId: string | null,
  element: PopupElement,
  index?: number,
): PopupElement[] {
  if (parentId === null) {
    const idx = index ?? elements.length;
    const result = [...elements];
    result.splice(idx, 0, element);
    return result;
  }
  return elements.map((el) => {
    if (el.id === parentId && el.type === 'box') {
      const children = [...el.children];
      const idx = index ?? children.length;
      children.splice(idx, 0, element);
      return { ...el, children };
    }
    if (el.type === 'box') {
      return { ...el, children: addElementToTree(el.children, parentId, element, index) };
    }
    return el;
  });
}

function removeElementFromTree(elements: PopupElement[], id: string): PopupElement[] {
  return updateElementInTree(elements, id, () => null);
}

function moveElementInTree(
  elements: PopupElement[],
  id: string,
  newParentId: string | null,
  newIndex: number,
): PopupElement[] {
  let movedElement: PopupElement | null = null;
  const withoutElement = updateElementInTree(elements, id, (el) => {
    movedElement = el;
    return null;
  });
  if (!movedElement) return elements;
  return addElementToTree(withoutElement, newParentId, movedElement, newIndex);
}

function findElementById(elements: PopupElement[], id: string): PopupElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.type === 'box') {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

const initialState: EditorState = {
  popup: createDefaultPopupConfig(),
  selectedElementId: null,
  clipboard: null,
  history: [],
  historyIndex: -1,
  previewDevice: 'desktop',
  zoom: 100,
};

function pushHistory(state: EditorState): EditorState {
  const history = state.history.slice(0, state.historyIndex + 1);
  history.push(JSON.parse(JSON.stringify(state.popup)));
  if (history.length > 50) history.shift();
  return { ...state, history, historyIndex: history.length - 1 };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_POPUP':
      return {
        ...pushHistory(state),
        popup: action.popup,
        selectedElementId: null,
      };

    case 'UPDATE_CONTAINER': {
      const newState = pushHistory(state);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          container: { ...newState.popup.container, ...action.updates },
        },
      };
    }

    case 'ADD_ELEMENT': {
      const newState = pushHistory(state);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          elements: addElementToTree(newState.popup.elements, action.parentId, action.element, action.index),
        },
        selectedElementId: action.element.id,
      };
    }

    case 'UPDATE_ELEMENT': {
      const newState = pushHistory(state);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          elements: updateElementInTree(newState.popup.elements, action.id, (el) => ({
            ...el,
            ...action.updates,
          } as PopupElement)),
        },
      };
    }

    case 'REMOVE_ELEMENT': {
      const newState = pushHistory(state);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          elements: removeElementFromTree(newState.popup.elements, action.id),
        },
        selectedElementId: state.selectedElementId === action.id ? null : state.selectedElementId,
      };
    }

    case 'MOVE_ELEMENT': {
      const newState = pushHistory(state);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          elements: moveElementInTree(newState.popup.elements, action.id, action.newParentId, action.newIndex),
        },
      };
    }

    case 'SELECT_ELEMENT':
      return { ...state, selectedElementId: action.id };

    case 'COPY_ELEMENT': {
      if (!state.selectedElementId) return state;
      const el = findElementById(state.popup.elements, state.selectedElementId);
      return el ? { ...state, clipboard: deepCloneElement(el) } : state;
    }

    case 'PASTE_ELEMENT': {
      if (!state.clipboard) return state;
      const newState = pushHistory(state);
      const cloned = deepCloneElement(state.clipboard);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          elements: addElementToTree(newState.popup.elements, action.parentId, cloned),
        },
        selectedElementId: cloned.id,
      };
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        popup: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
        selectedElementId: null,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        popup: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
        selectedElementId: null,
      };
    }

    case 'SET_PREVIEW_DEVICE':
      return { ...state, previewDevice: action.device };

    case 'SET_ZOOM':
      return { ...state, zoom: action.zoom };

    case 'UPDATE_DISPLAY_RULES': {
      const newState = pushHistory(state);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          displayRules: { ...newState.popup.displayRules, ...action.updates },
        },
      };
    }

    case 'UPDATE_CLOSE_BUTTON': {
      const newState = pushHistory(state);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          closeButton: { ...newState.popup.closeButton, ...action.updates },
        },
      };
    }

    case 'UPDATE_OVERLAY': {
      const newState = pushHistory(state);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          overlay: { ...newState.popup.overlay, ...action.updates },
        },
      };
    }

    case 'UPDATE_ANIMATION': {
      const newState = pushHistory(state);
      return {
        ...newState,
        popup: {
          ...newState.popup,
          animation: { ...newState.popup.animation, ...action.updates },
        },
      };
    }

    default:
      return state;
  }
}

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  selectedElement: PopupElement | null;
  canUndo: boolean;
  canRedo: boolean;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children, initialPopup }: { children: ReactNode; initialPopup?: PopupConfig }) {
  const [state, dispatch] = useReducer(editorReducer, {
    ...initialState,
    popup: initialPopup ?? createDefaultPopupConfig(),
    history: [initialPopup ?? createDefaultPopupConfig()],
    historyIndex: 0,
  });

  const selectedElement = state.selectedElementId
    ? findElementById(state.popup.elements, state.selectedElementId)
    : null;

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <EditorContext.Provider value={{ state, dispatch, selectedElement, canUndo, canRedo }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}

export { findElementById };
