import type { PopupElement } from '../../types/popup';
import TextRenderer from './TextRenderer';
import ImageRenderer from './ImageRenderer';
import ButtonRenderer from './ButtonRenderer';
import DividerRenderer from './DividerRenderer';
import SpacerRenderer from './SpacerRenderer';
import BoxRenderer from './BoxRenderer';
import CarouselRenderer from './CarouselRenderer';
import FormRenderer from './FormRenderer';
import HtmlRenderer from './HtmlRenderer';

interface ElementRendererProps {
  element: PopupElement;
  selected: boolean;
  onSelect: (id: string) => void;
  parentSelectedId?: string;
}

function renderElement(
  element: PopupElement,
  selectedElementId: string | undefined,
  onSelect: (id: string) => void,
) {
  switch (element.type) {
    case 'text':
      return <TextRenderer element={element} />;
    case 'image':
      return <ImageRenderer element={element} />;
    case 'button':
      return <ButtonRenderer element={element} />;
    case 'divider':
      return <DividerRenderer element={element} />;
    case 'spacer':
      return <SpacerRenderer element={element} />;
    case 'box':
      return (
        <BoxRenderer
          element={element}
          selectedElementId={selectedElementId}
          onSelect={onSelect}
        />
      );
    case 'carousel':
      return (
        <CarouselRenderer
          element={element}
          selectedElementId={selectedElementId}
          onSelect={onSelect}
        />
      );
    case 'form':
      return <FormRenderer element={element} />;
    case 'html':
      return <HtmlRenderer element={element} />;
    default:
      return <div style={{ color: '#ef4444', fontSize: '12px' }}>Unknown element type</div>;
  }
}

export default function ElementRenderer({ element, selected, onSelect, parentSelectedId }: ElementRendererProps) {
  const margin = element.margin;
  const padding = element.padding;

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    marginTop: margin ? `${margin.top}px` : undefined,
    marginRight: margin ? `${margin.right}px` : undefined,
    marginBottom: margin ? `${margin.bottom}px` : undefined,
    marginLeft: margin ? `${margin.left}px` : undefined,
    paddingTop: padding ? `${padding.top}px` : undefined,
    paddingRight: padding ? `${padding.right}px` : undefined,
    paddingBottom: padding ? `${padding.bottom}px` : undefined,
    paddingLeft: padding ? `${padding.left}px` : undefined,
    outline: selected ? '2px solid #3b82f6' : undefined,
    outlineOffset: selected ? '1px' : undefined,
    borderRadius: selected ? '2px' : undefined,
    cursor: 'pointer',
    transition: 'outline 0.15s',
  };

  return (
    <div
      style={wrapperStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
    >
      {renderElement(element, parentSelectedId, onSelect)}
    </div>
  );
}
