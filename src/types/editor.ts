import type { PopupConfig, PopupElement } from './popup';

export type PreviewDevice = 'mobile' | 'tablet' | 'desktop';

export interface EditorState {
  popup: PopupConfig;
  selectedElementId: string | null;
  clipboard: PopupElement | null;
  history: PopupConfig[];
  historyIndex: number;
  previewDevice: PreviewDevice;
  zoom: number;
  animationPreview: 'idle' | 'entrance' | 'exit';
}

export type EditorAction =
  | { type: 'SET_POPUP'; popup: PopupConfig }
  | { type: 'UPDATE_CONTAINER'; updates: Partial<PopupConfig['container']> }
  | { type: 'ADD_ELEMENT'; parentId: string | null; element: PopupElement; index?: number }
  | { type: 'UPDATE_ELEMENT'; id: string; updates: Partial<PopupElement> }
  | { type: 'REMOVE_ELEMENT'; id: string }
  | { type: 'MOVE_ELEMENT'; id: string; newParentId: string | null; newIndex: number }
  | { type: 'SELECT_ELEMENT'; id: string | null }
  | { type: 'COPY_ELEMENT' }
  | { type: 'PASTE_ELEMENT'; parentId: string | null }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_PREVIEW_DEVICE'; device: PreviewDevice }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'UPDATE_DISPLAY_RULES'; updates: Partial<PopupConfig['displayRules']> }
  | { type: 'UPDATE_CLOSE_BUTTON'; updates: Partial<PopupConfig['closeButton']> }
  | { type: 'UPDATE_OVERLAY'; updates: Partial<PopupConfig['overlay']> }
  | { type: 'UPDATE_ANIMATION'; updates: Partial<PopupConfig['animation']> }
  | { type: 'PLAY_ANIMATION'; phase: 'entrance' | 'exit' }
  | { type: 'STOP_ANIMATION' };
