import type { TextElement } from '../../types/popup';

interface TextRendererProps {
  element: TextElement;
}

export default function TextRenderer({ element }: TextRendererProps) {
  const style: React.CSSProperties = {
    fontSize: `${element.fontSize}px`,
    fontFamily: element.fontFamily,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle,
    textDecoration: element.textDecoration,
    color: element.color,
    textAlign: element.textAlign,
    lineHeight: element.lineHeight,
    letterSpacing: `${element.letterSpacing}px`,
    margin: 0,
    wordBreak: 'break-word',
  };

  if (element.linkUrl) {
    return (
      <a
        href={element.linkUrl}
        target={element.linkTarget || '_blank'}
        rel="noopener noreferrer"
        style={{ ...style, display: 'block', textDecoration: element.textDecoration === 'none' ? 'underline' : element.textDecoration }}
        onClick={(e) => e.preventDefault()}
      >
        {element.content}
      </a>
    );
  }

  return <p style={style}>{element.content}</p>;
}
