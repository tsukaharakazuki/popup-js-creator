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
    <div className="flex-1 overflow-auto flex flex-col items-center py-6 px-4" style={{ backgroundColor: '#d1d5db' }}>
      {/* Device label */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: '#6b7280' }}>
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
            backgroundColor: '#f3f4f6',
            border: '1px solid #9ca3af',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <PopupRenderer
            config={state.popup}
            previewDevice={state.previewDevice}
            selectedElementId={state.selectedElementId ?? undefined}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
}
