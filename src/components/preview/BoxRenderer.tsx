import type { BoxElement, PopupElement } from '../../types/popup';
import ElementRenderer from './ElementRenderer';

interface BoxRendererProps {
  element: BoxElement;
  selectedElementId?: string;
  onSelect: (id: string) => void;
}

export default function BoxRenderer({ element, selectedElementId, onSelect }: BoxRendererProps) {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: element.direction === 'vertical' ? 'column' : 'row',
    gap: `${element.gap}px`,
    alignItems: element.alignItems,
    justifyContent: element.justifyContent,
    backgroundColor: element.backgroundColor || 'transparent',
    borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={style}>
      {element.children.map((child: PopupElement) => (
        <ElementRenderer
          key={child.id}
          element={child}
          selected={child.id === selectedElementId}
          onSelect={onSelect}
          parentSelectedId={selectedElementId}
        />
      ))}
      {element.children.length === 0 && (
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '12px',
            border: '1px dashed #d1d5db',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          ボックス（空）
        </div>
      )}
    </div>
  );
}
