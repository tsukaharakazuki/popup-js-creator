import { useState } from 'react';
import type { CarouselElement, PopupElement } from '../../types/popup';
import ElementRenderer from './ElementRenderer';

interface CarouselRendererProps {
  element: CarouselElement;
  selectedElementId?: string;
  onSelect: (id: string) => void;
}

export default function CarouselRenderer({ element, selectedElementId, onSelect }: CarouselRendererProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = element.slides;

  if (slides.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
        スライドがありません
      </div>
    );
  }

  const goTo = (index: number) => {
    if (index < 0) setCurrentSlide(slides.length - 1);
    else if (index >= slides.length) setCurrentSlide(0);
    else setCurrentSlide(index);
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  };

  const slideTrackStyle: React.CSSProperties = {
    display: 'flex',
    transform: `translateX(-${currentSlide * 100}%)`,
    transition: 'transform 0.3s ease',
  };

  const slideStyle: React.CSSProperties = {
    minWidth: '100%',
    flexShrink: 0,
  };

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    zIndex: 2,
  };

  const dotsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '8px',
  };

  return (
    <div style={containerStyle}>
      <div style={slideTrackStyle}>
        {slides.map((slide) => (
          <div key={slide.id} style={slideStyle}>
            {slide.elements.map((el: PopupElement) => (
              <ElementRenderer
                key={el.id}
                element={el}
                selected={el.id === selectedElementId}
                onSelect={onSelect}
              />
            ))}
          </div>
        ))}
      </div>

      {element.showArrows && slides.length > 1 && (
        <>
          <button
            style={{ ...arrowStyle, left: '8px' }}
            onClick={(e) => { e.stopPropagation(); goTo(currentSlide - 1); }}
            type="button"
          >
            &#8249;
          </button>
          <button
            style={{ ...arrowStyle, right: '8px' }}
            onClick={(e) => { e.stopPropagation(); goTo(currentSlide + 1); }}
            type="button"
          >
            &#8250;
          </button>
        </>
      )}

      {element.showDots && slides.length > 1 && (
        <div style={dotsContainerStyle}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: i === currentSlide ? '#3b82f6' : '#d1d5db',
                cursor: 'pointer',
                padding: 0,
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
