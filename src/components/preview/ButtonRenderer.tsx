import { useState } from 'react';
import type { ButtonElement } from '../../types/popup';

interface ButtonRendererProps {
  element: ButtonElement;
}

export default function ButtonRenderer({ element }: ButtonRendererProps) {
  const [hovered, setHovered] = useState(false);

  const alignmentMap: Record<string, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: alignmentMap[element.alignment] || 'center',
  };

  const buttonStyle: React.CSSProperties = {
    width: element.width,
    height: element.height,
    backgroundColor: hovered ? element.hoverBackgroundColor : element.backgroundColor,
    color: element.textColor,
    fontSize: `${element.fontSize}px`,
    fontWeight: element.fontWeight,
    borderRadius: `${element.borderRadius}px`,
    borderWidth: `${element.borderWidth}px`,
    borderColor: element.borderColor,
    borderStyle: element.borderWidth > 0 ? 'solid' : 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <div style={wrapperStyle}>
      <a
        href={element.linkUrl || '#'}
        target={element.linkTarget}
        rel="noopener noreferrer"
        style={buttonStyle}
        onClick={(e) => e.preventDefault()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {element.label}
      </a>
    </div>
  );
}
