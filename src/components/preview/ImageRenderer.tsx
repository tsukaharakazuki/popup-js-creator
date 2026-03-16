import type { ImageElement } from '../../types/popup';

interface ImageRendererProps {
  element: ImageElement;
}

export default function ImageRenderer({ element }: ImageRendererProps) {
  const alignmentMap: Record<string, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: alignmentMap[element.alignment] || 'center',
  };

  const imgStyle: React.CSSProperties = {
    width: element.width,
    height: element.height,
    objectFit: element.objectFit,
    borderRadius: `${element.borderRadius}px`,
    display: 'block',
    maxWidth: '100%',
  };

  const img = <img src={element.src} alt={element.alt} style={imgStyle} />;

  if (element.linkUrl) {
    return (
      <div style={wrapperStyle}>
        <a
          href={element.linkUrl}
          target={element.linkTarget || '_blank'}
          rel="noopener noreferrer"
          onClick={(e) => e.preventDefault()}
        >
          {img}
        </a>
      </div>
    );
  }

  return <div style={wrapperStyle}>{img}</div>;
}
