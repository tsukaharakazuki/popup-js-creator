import { useState, useEffect } from 'react';
import type { PopupConfig, PopupPosition, AnimationConfig } from '../../types/popup';
import type { PreviewDevice } from '../../types/editor';
import ElementRenderer from './ElementRenderer';

interface PopupRendererProps {
  config: PopupConfig;
  previewDevice?: PreviewDevice;
  selectedElementId?: string;
  onSelect?: (id: string) => void;
  animationPhase?: 'idle' | 'entrance' | 'exit';
  onAnimationEnd?: () => void;
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

function getEntranceKeyframes(type: AnimationConfig['entrance']): [React.CSSProperties, React.CSSProperties] {
  switch (type) {
    case 'fade-in':
      return [{ opacity: 0 }, { opacity: 1 }];
    case 'slide-up':
      return [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }];
    case 'slide-down':
      return [{ opacity: 0, transform: 'translateY(-40px)' }, { opacity: 1, transform: 'translateY(0)' }];
    case 'slide-left':
      return [{ opacity: 0, transform: 'translateX(40px)' }, { opacity: 1, transform: 'translateX(0)' }];
    case 'slide-right':
      return [{ opacity: 0, transform: 'translateX(-40px)' }, { opacity: 1, transform: 'translateX(0)' }];
    case 'zoom-in':
      return [{ opacity: 0, transform: 'scale(0.7)' }, { opacity: 1, transform: 'scale(1)' }];
    default:
      return [{}, {}];
  }
}

function getExitKeyframes(type: AnimationConfig['exit']): [React.CSSProperties, React.CSSProperties] {
  switch (type) {
    case 'fade-out':
      return [{ opacity: 1 }, { opacity: 0 }];
    case 'slide-up':
      return [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-40px)' }];
    case 'slide-down':
      return [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(40px)' }];
    case 'zoom-out':
      return [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.7)' }];
    default:
      return [{}, {}];
  }
}

export default function PopupRenderer({
  config,
  previewDevice = 'desktop',
  selectedElementId,
  onSelect,
  animationPhase = 'idle',
  onAnimationEnd,
}: PopupRendererProps) {
  const { container, closeButton, overlay, elements, animation } = config;
  const [animStyle, setAnimStyle] = useState<React.CSSProperties>({});
  const [overlayAnimStyle, setOverlayAnimStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (animationPhase === 'idle') {
      setAnimStyle({});
      setOverlayAnimStyle({});
      return;
    }

    const duration = animation.duration;

    if (animationPhase === 'entrance') {
      const [from, to] = getEntranceKeyframes(animation.entrance);
      // Start at "from"
      setAnimStyle({ ...from, transition: 'none' });
      setOverlayAnimStyle({ opacity: 0, transition: 'none' });

      // Force reflow then animate to "to"
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimStyle({ ...to, transition: `all ${duration}ms ease-out` });
          setOverlayAnimStyle({ opacity: 1, transition: `opacity ${duration}ms ease-out` });
        });
      });
    } else if (animationPhase === 'exit') {
      const [from, to] = getExitKeyframes(animation.exit);
      setAnimStyle({ ...from, transition: 'none' });
      setOverlayAnimStyle({ opacity: 1, transition: 'none' });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimStyle({ ...to, transition: `all ${duration}ms ease-in` });
          setOverlayAnimStyle({ opacity: 0, transition: `opacity ${duration}ms ease-in` });
        });
      });
    }

    const timer = setTimeout(() => {
      onAnimationEnd?.();
    }, duration + 50);

    return () => clearTimeout(timer);
  }, [animationPhase, animation.entrance, animation.exit, animation.duration, onAnimationEnd]);

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
    maxWidth: maxWidth || '100%',
    height,
    maxHeight: maxHeight || undefined,
    flexShrink: 0,
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
    ...animStyle,
  };

  const posAlign = positionAlignMap[container.position] || positionAlignMap['center'];

  const showOverlay = overlay.enabled && animationPhase !== 'idle';

  const overlayBgStyle: React.CSSProperties = showOverlay
    ? {
        position: 'absolute',
        inset: 0,
        backgroundColor: overlay.color,
        zIndex: 0,
        ...overlayAnimStyle,
      }
    : {};

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: posAlign.alignItems,
    justifyContent: posAlign.justifyContent,
    padding: '16px',
    boxSizing: 'border-box',
    zIndex: 1,
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
    <>
      {showOverlay && <div style={overlayBgStyle} />}
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
    </>
  );
}
