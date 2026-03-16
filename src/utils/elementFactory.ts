import { nanoid } from 'nanoid';
import type {
  PopupElement,
  TextElement,
  ImageElement,
  ButtonElement,
  DividerElement,
  SpacerElement,
  BoxElement,
  CarouselElement,
  FormElement,
  HtmlElement,
  ElementType,
} from '../types/popup';

const defaultSpacing = { top: 0, right: 0, bottom: 0, left: 0 };

export function createTextElement(overrides?: Partial<TextElement>): TextElement {
  return {
    id: nanoid(),
    type: 'text',
    content: 'テキストを入力',
    fontSize: 16,
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 1.5,
    letterSpacing: 0,
    margin: { ...defaultSpacing },
    padding: { ...defaultSpacing },
    ...overrides,
  };
}

export function createImageElement(overrides?: Partial<ImageElement>): ImageElement {
  return {
    id: nanoid(),
    type: 'image',
    src: 'https://placehold.co/400x200/e2e8f0/64748b?text=Image',
    alt: '',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 0,
    alignment: 'center',
    margin: { ...defaultSpacing },
    padding: { ...defaultSpacing },
    ...overrides,
  };
}

export function createButtonElement(overrides?: Partial<ButtonElement>): ButtonElement {
  return {
    id: nanoid(),
    type: 'button',
    label: 'ボタン',
    linkUrl: '#',
    linkTarget: '_blank',
    width: '200px',
    height: '44px',
    backgroundColor: '#3b82f6',
    hoverBackgroundColor: '#2563eb',
    textColor: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent',
    alignment: 'center',
    action: 'link',
    margin: { ...defaultSpacing },
    padding: { ...defaultSpacing },
    ...overrides,
  };
}

export function createDividerElement(overrides?: Partial<DividerElement>): DividerElement {
  return {
    id: nanoid(),
    type: 'divider',
    color: '#e5e7eb',
    thickness: 1,
    style: 'solid',
    margin: { top: 8, right: 0, bottom: 8, left: 0 },
    padding: { ...defaultSpacing },
    ...overrides,
  };
}

export function createSpacerElement(overrides?: Partial<SpacerElement>): SpacerElement {
  return {
    id: nanoid(),
    type: 'spacer',
    height: 16,
    margin: { ...defaultSpacing },
    padding: { ...defaultSpacing },
    ...overrides,
  };
}

export function createBoxElement(overrides?: Partial<BoxElement>): BoxElement {
  return {
    id: nanoid(),
    type: 'box',
    direction: 'vertical',
    gap: 8,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    children: [],
    margin: { ...defaultSpacing },
    padding: { ...defaultSpacing },
    ...overrides,
  };
}

export function createCarouselElement(overrides?: Partial<CarouselElement>): CarouselElement {
  return {
    id: nanoid(),
    type: 'carousel',
    slides: [
      { id: nanoid(), elements: [createImageElement()] },
      { id: nanoid(), elements: [createImageElement()] },
    ],
    autoPlay: true,
    interval: 3000,
    showDots: true,
    showArrows: true,
    margin: { ...defaultSpacing },
    padding: { ...defaultSpacing },
    ...overrides,
  };
}

export function createFormElement(overrides?: Partial<FormElement>): FormElement {
  return {
    id: nanoid(),
    type: 'form',
    fields: [
      { id: nanoid(), fieldType: 'email', label: 'メールアドレス', name: 'email', placeholder: 'email@example.com', required: true },
    ],
    submitLabel: '送信',
    submitUrl: '',
    submitMethod: 'post',
    successMessage: '送信しました',
    margin: { ...defaultSpacing },
    padding: { ...defaultSpacing },
    ...overrides,
  };
}

export function createHtmlElement(overrides?: Partial<HtmlElement>): HtmlElement {
  return {
    id: nanoid(),
    type: 'html',
    content: '<div>カスタムHTML</div>',
    margin: { ...defaultSpacing },
    padding: { ...defaultSpacing },
    ...overrides,
  };
}

export function createElement(type: ElementType): PopupElement {
  switch (type) {
    case 'text': return createTextElement();
    case 'image': return createImageElement();
    case 'button': return createButtonElement();
    case 'divider': return createDividerElement();
    case 'spacer': return createSpacerElement();
    case 'box': return createBoxElement();
    case 'carousel': return createCarouselElement();
    case 'form': return createFormElement();
    case 'html': return createHtmlElement();
  }
}

export function getElementLabel(type: ElementType): string {
  const labels: Record<ElementType, string> = {
    text: 'テキスト',
    image: '画像',
    button: 'ボタン',
    divider: '区切り線',
    spacer: 'スペーサー',
    box: 'ボックス',
    carousel: 'カルーセル',
    form: 'フォーム',
    html: 'HTML',
  };
  return labels[type];
}
