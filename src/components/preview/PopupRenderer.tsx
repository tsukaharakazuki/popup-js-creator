import type { PopupConfig, PopupPosition } from '../../types/popup';
import type { PreviewDevice } from '../../types/editor';
import ElementRenderer from './ElementRenderer';

interface PopupRendererProps {
  config: PopupConfig;
  previewDevice?: PreviewDevice;
  selectedElementId?: string;
  onSelect?: (id: string) => void;
}

function getResponsiveValue<T>(rv: { mobile: T; tablet?: T; desktop: T }, device: PreviewDevice): T {
  if (device === 'mobile') return rv.mobile;
  if (device === 'tablet') return rv.tablet ?? rv.desktop;
  return rv.desktop;
}

const positionAlignMap: Record<PopupPosition, { alignItems: string; justifyContent: string }> = {
  'top-left':      { alignItems: 'flex-start', justifyContent: 'flex-start' },
  'top-center':    { alignItems: 'flex-start', justifyContent: 'center' },
  'top-right':     { alignItems: 'flex-start', justifyContent: 'flex-end' },
  'center-left':   { alignItems: 'center',     justifyContent: 'flex-start' },
  'center':        { alignItems: 'center',     justifyContent: 'center' },
  'center-right':  { alignItems: 'center',     justifyContent: 'flex-end' },
  'bottom-left':   { alignItems: 'flex-end',   justifyContent: 'flex-start' },
  'bottom-center': { alignItems: 'flex-end',   justifyContent: 'center' },
  'bottom-right':  { alignItems: 'flex-end',   justifyContent: 'flex-end' },
};

export default function PopupRenderer({ config, previewDevice = 'desktop', selectedElementId, onSelect }: PopupRendererProps) {
  const { container, closeButton, elements } = config;

  const handleSelect = onSelect || (() => {});

  const shadow = container.boxShadow.enabled
    ? `${container.boxShadow.x}px ${container.boxShadow.y}px ${container.boxShadow.blur}px ${container.boxShadow.spread}px ${container.boxShadow.color}`
    : 'none';

  const width = getResponsiveValue(container.width, previewDevice);
  const height = getResponsiveValue(container.height, previewDevice);
  const maxWidth = container.maxWidth ? getResponsiveValue(container.maxWidth, previewDevice) : undefined;
  const maxHeight = container.maxHeight ? getResponsiveValue(container.maxHeight, previewDevice) : undefined;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    maxWidth: maxWidth || undefined,
    height,
    maxHeight: maxHeight || undefined,
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

  const posAlign = positionAlignMap[container.position] || positionAlignMap['center'];

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: posAlign.alignItems,
    justifyContent: posAlign.justifyContent,
    padding: '16px',
    boxSizing: 'border-box',
  };

  const closePosition = closeButton.position === 'top-right'
    ? { top: `${closeButton.offsetY}px`, right: `${closeButton.offsetX}px` }
    : { top: `${closeButton.offsetY}px`, left: `${closeButton.offsetX}px` };

  const closeStyle: React.CSSProperties = {
    position: 'absolute',
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
    <div style={overlayStyle}>
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
    </div>
  );
}
