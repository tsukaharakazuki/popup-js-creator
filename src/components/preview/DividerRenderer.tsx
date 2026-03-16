import type { DividerElement } from '../../types/popup';

interface DividerRendererProps {
  element: DividerElement;
}

export default function DividerRenderer({ element }: DividerRendererProps) {
  const style: React.CSSProperties = {
    border: 'none',
    borderTop: `${element.thickness}px ${element.style} ${element.color}`,
    margin: 0,
    width: '100%',
  };

  return <hr style={style} />;
}
