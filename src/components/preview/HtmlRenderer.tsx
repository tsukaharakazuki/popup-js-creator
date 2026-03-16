import type { HtmlElement } from '../../types/popup';

interface HtmlRendererProps {
  element: HtmlElement;
}

export default function HtmlRenderer({ element }: HtmlRendererProps) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: element.content }}
      style={{ width: '100%' }}
    />
  );
}
