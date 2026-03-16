import { useState } from 'react';
import {
  ChevronRight, ChevronDown, Trash2, Plus,
  Type, Image, MousePointerClick, Minus, Square,
  LayoutGrid, FormInput, Code,
  GripVertical,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { createElement, getElementLabel } from '../../utils/elementFactory';
import type { PopupElement, ElementType, BoxElement } from '../../types/popup';

const elementIcons: Record<string, typeof Type> = {
  text: Type,
  image: Image,
  button: MousePointerClick,
  divider: Minus,
  spacer: GripVertical,
  box: Square,
  carousel: LayoutGrid,
  form: FormInput,
  html: Code,
};

const addableTypes: { type: ElementType; label: string }[] = [
  { type: 'text', label: 'テキスト' },
  { type: 'image', label: '画像' },
  { type: 'button', label: 'ボタン' },
  { type: 'divider', label: '区切り線' },
  { type: 'spacer', label: 'スペーサー' },
  { type: 'box', label: 'ボックス' },
  { type: 'carousel', label: 'カルーセル' },
  { type: 'form', label: 'フォーム' },
  { type: 'html', label: 'HTML' },
];

interface TreeItemProps {
  element: PopupElement;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function TreeItem({ element, depth, selectedId, onSelect, onDelete }: TreeItemProps) {
  const [expanded, setExpanded] = useState(true);
  const isBox = element.type === 'box';
  const isCarousel = element.type === 'carousel';
  const hasChildren = (isBox && (element as BoxElement).children.length > 0) || isCarousel;
  const isSelected = selectedId === element.id;
  const Icon = elementIcons[element.type] || Square;

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer rounded-md text-sm transition-colors group ${
          isSelected
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(element.id)}
      >
        {hasChildren ? (
          <button
            className="p-0.5 rounded hover:bg-gray-200"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <Icon className="w-3.5 h-3.5 shrink-0 text-gray-400" />
        <span className="truncate flex-1">
          {getElementLabel(element.type)}
          {element.type === 'text' && (
            <span className="text-gray-400 ml-1 text-xs">
              {(element as { content: string }).content.slice(0, 12)}
            </span>
          )}
        </span>
        <button
          className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          onClick={(e) => { e.stopPropagation(); onDelete(element.id); }}
          title="削除"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {expanded && isBox && (element as BoxElement).children.map((child) => (
        <TreeItem
          key={child.id}
          element={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
      {expanded && isCarousel && element.type === 'carousel' && element.slides.map((slide, i) => (
        <div key={slide.id}>
          <div
            className="text-xs text-gray-400 px-2 py-0.5"
            style={{ paddingLeft: `${8 + (depth + 1) * 16}px` }}
          >
            スライド {i + 1}
          </div>
          {slide.elements.map((el) => (
            <TreeItem
              key={el.id}
              element={el}
              depth={depth + 2}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function TreePanel() {
  const { state, dispatch } = useEditor();
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const handleSelect = (id: string) => {
    dispatch({ type: 'SELECT_ELEMENT', id });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'REMOVE_ELEMENT', id });
  };

  const handleAdd = (type: ElementType) => {
    const element = createElement(type);
    dispatch({ type: 'ADD_ELEMENT', parentId: null, element });
    setAddMenuOpen(false);
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">要素ツリー</span>
        <div className="relative">
          <button
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-blue-600"
            title="要素を追加"
          >
            <Plus className="w-4 h-4" />
          </button>
          {addMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAddMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                {addableTypes.map(({ type, label }) => {
                  const Icon = elementIcons[type] || Square;
                  return (
                    <button
                      key={type}
                      onClick={() => handleAdd(type)}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {state.popup.elements.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-gray-400">
            要素がありません
          </div>
        ) : (
          state.popup.elements.map((el) => (
            <TreeItem
              key={el.id}
              element={el}
              depth={0}
              selectedId={state.selectedElementId}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
