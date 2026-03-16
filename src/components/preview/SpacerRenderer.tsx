import type { SpacerElement } from '../../types/popup';

interface SpacerRendererProps {
  element: SpacerElement;
}

export default function SpacerRenderer({ element }: SpacerRendererProps) {
  const style: React.CSSProperties = {
    height: `${element.height}px`,
    width: '100%',
  };

  return <div style={style} />;
}
