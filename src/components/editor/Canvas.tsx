import { useEditor } from '../../context/EditorContext';
import PopupRenderer from '../preview/PopupRenderer';

const deviceDimensions: Record<string, { width: number; height: number; label: string }> = {
  mobile: { width: 375, height: 667, label: 'iPhone SE' },
  tablet: { width: 768, height: 1024, label: 'iPad' },
  desktop: { width: 1280, height: 800, label: 'Desktop' },
};

export default function Canvas() {
  const { state, dispatch } = useEditor();
  const device = deviceDimensions[state.previewDevice];
  const scale = state.zoom / 100;

  const handleSelect = (id: string) => {
    dispatch({ type: 'SELECT_ELEMENT', id: id || null });
  };

  return (
    <div className="flex-1 bg-gray-100 overflow-auto flex flex-col items-center py-6 px-4">
      {/* Device label */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-gray-400 font-medium">
          {device.label} — {device.width} x {device.height}
        </span>
      </div>

      {/* Device frame */}
      <div
        style={{
          width: `${device.width}px`,
          height: `${device.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Mock page background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#ffffff',
              opacity: 0.5,
            }}
          />

          {/* Popup */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '100%', maxHeight: '100%', overflow: 'auto' }}>
            <PopupRenderer
              config={state.popup}
              selectedElementId={state.selectedElementId ?? undefined}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
