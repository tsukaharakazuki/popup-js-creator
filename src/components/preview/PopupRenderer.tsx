import type { PopupConfig } from '../../types/popup';
import ElementRenderer from './ElementRenderer';

interface PopupRendererProps {
  config: PopupConfig;
  selectedElementId?: string;
  onSelect?: (id: string) => void;
}

export default function PopupRenderer({ config, selectedElementId, onSelect }: PopupRendererProps) {
  const { container, closeButton, elements } = config;

  const handleSelect = onSelect || (() => {});

  const shadow = container.boxShadow.enabled
    ? `${container.boxShadow.x}px ${container.boxShadow.y}px ${container.boxShadow.blur}px ${container.boxShadow.spread}px ${container.boxShadow.color}`
    : 'none';

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: container.width.desktop,
    maxWidth: container.maxWidth?.desktop || undefined,
    height: container.height.desktop,
    maxHeight: container.maxHeight?.desktop || undefined,
    backgroundColor: container.backgroundColor,
    backgroundImage: container.backgroundImage ? `url(${container.backgroundImage})` : undefined,
    backgroundSize: container.backgroundSize || undefined,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: `${container.borderRadius}px`,
    borderWidth: `${container.borderWidth}px`,
    borderColor: container.borderColor,
    borderStyle: container.borderStyle,
    boxShadow: shadow,
    paddingTop: `${container.padding.top}px`,
    paddingRight: `${container.padding.right}px`,
    paddingBottom: `${container.padding.bottom}px`,
    paddingLeft: `${container.padding.left}px`,
    overflow: 'auto',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  };

  const closePosition = closeButton.position === 'top-right'
    ? { top: `${closeButton.offsetY}px`, right: `${closeButton.offsetX}px` }
    : { top: `${closeButton.offsetY}px`, left: `${closeButton.offsetX}px` };

  const closeStyle: React.CSSProperties = {
    position: closeButton.outsidePopup ? 'absolute' : 'absolute',
    ...closePosition,
    width: `${closeButton.size}px`,
    height: `${closeButton.size}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    color: closeButton.color,
    cursor: 'pointer',
    fontSize: `${closeButton.size * 0.7}px`,
    lineHeight: 1,
    padding: 0,
    zIndex: 10,
  };

  return (
    <div
      style={containerStyle}
      onClick={() => handleSelect('')}
    >
      {closeButton.enabled && (
        <button
          type="button"
          style={closeStyle}
          onClick={(e) => e.stopPropagation()}
          title="Close"
        >
          &#10005;
        </button>
      )}
      {elements.map((el) => (
        <ElementRenderer
          key={el.id}
          element={el}
          selected={el.id === (selectedElementId ?? '')}
          onSelect={handleSelect}
          parentSelectedId={selectedElementId}
        />
      ))}
      {elements.length === 0 && (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '14px',
          }}
        >
          要素を追加してください
        </div>
      )}
    </div>
  );
}
