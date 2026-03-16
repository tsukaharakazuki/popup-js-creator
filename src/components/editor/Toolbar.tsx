import { useState } from 'react';
import {
  Undo2, Redo2, Monitor, Tablet, Smartphone,
  ZoomIn, ZoomOut, Plus, Type, Image, MousePointerClick,
  Minus, Square, LayoutGrid, FormInput, Code,
  GripVertical, FileCode,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { createElement } from '../../utils/elementFactory';
import type { ElementType } from '../../types/popup';
import type { PreviewDevice } from '../../types/editor';
import CodeExportModal from './CodeExportModal';
import GtmDeployButton from '../gtm/GtmDeployButton';

const elementTypes: { type: ElementType; icon: typeof Type; label: string }[] = [
  { type: 'text', icon: Type, label: 'テキスト' },
  { type: 'image', icon: Image, label: '画像' },
  { type: 'button', icon: MousePointerClick, label: 'ボタン' },
  { type: 'divider', icon: Minus, label: '区切り線' },
  { type: 'spacer', icon: GripVertical, label: 'スペーサー' },
  { type: 'box', icon: Square, label: 'ボックス' },
  { type: 'carousel', icon: LayoutGrid, label: 'カルーセル' },
  { type: 'form', icon: FormInput, label: 'フォーム' },
  { type: 'html', icon: Code, label: 'HTML' },
];

const devices: { device: PreviewDevice; icon: typeof Monitor; label: string }[] = [
  { device: 'mobile', icon: Smartphone, label: 'モバイル' },
  { device: 'tablet', icon: Tablet, label: 'タブレット' },
  { device: 'desktop', icon: Monitor, label: 'デスクトップ' },
];

export default function Toolbar() {
  const { state, dispatch, canUndo, canRedo } = useEditor();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  const handleAddElement = (type: ElementType) => {
    const element = createElement(type);
    dispatch({ type: 'ADD_ELEMENT', parentId: null, element });
    setDropdownOpen(false);
  };

  return (
    <div className="flex items-center gap-1 px-3 h-11 bg-white border-b border-gray-200 shrink-0">
      {/* Undo / Redo */}
      <button
        onClick={() => dispatch({ type: 'UNDO' })}
        disabled={!canUndo}
        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        title="元に戻す"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => dispatch({ type: 'REDO' })}
        disabled={!canRedo}
        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        title="やり直す"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Device Switcher */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
        {devices.map(({ device, icon: Icon, label }) => (
          <button
            key={device}
            onClick={() => dispatch({ type: 'SET_PREVIEW_DEVICE', device })}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              state.previewDevice === device
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Zoom */}
      <button
        onClick={() => dispatch({ type: 'SET_ZOOM', zoom: Math.max(25, state.zoom - 25) })}
        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
        title="縮小"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <span className="text-xs text-gray-500 w-10 text-center select-none">
        {state.zoom}%
      </span>
      <button
        onClick={() => dispatch({ type: 'SET_ZOOM', zoom: Math.min(200, state.zoom + 25) })}
        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
        title="拡大"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      {/* Export JS */}
      <button
        onClick={() => setCodeModalOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        title="JavaScript コードを出力"
      >
        <FileCode className="w-4 h-4" />
        JS出力
      </button>

      {/* GTM Deploy */}
      <GtmDeployButton config={state.popup} />

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Add Element */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          要素を追加
        </button>
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              {elementTypes.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => handleAddElement(type)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-400" />
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Code Export Modal */}
      {codeModalOpen && (
        <CodeExportModal
          config={state.popup}
          onClose={() => setCodeModalOpen(false)}
        />
      )}
    </div>
  );
}
