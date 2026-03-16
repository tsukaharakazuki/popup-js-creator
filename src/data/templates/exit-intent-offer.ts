import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createButtonElement, createImageElement, createSpacerElement } from '../../utils/elementFactory';

const exitIntentOffer: TemplateDefinition = {
  id: 'exit-intent-offer',
  name: 'Exit Intent Offer',
  nameJa: '離脱防止',
  description: 'A bold popup triggered on exit intent, offering a last-chance deal.',
  descriptionJa: '離脱しようとするユーザーに表示する最後のオファーポップアップ。',
  category: 'conversion',
  tags: ['exit-intent', 'offer', 'conversion', 'bold'],
  create: () => {
    const config = createDefaultPopupConfig('離脱防止');
    config.container.position = 'center';
    config.container.width = { mobile: '92%', desktop: '480px' };
    config.container.padding = { top: 0, right: 0, bottom: 28, left: 0 };
    config.container.backgroundColor = '#ffffff';
    config.container.borderRadius = 16;
    config.displayRules.trigger = { type: 'exit-intent' };
    config.displayRules.frequency = { type: 'once-per-session' };
    config.overlay.color = 'rgba(0,0,0,0.6)';
    config.elements = [
      createImageElement({
        src: 'https://placehold.co/480x180/ef4444/ffffff?text=WAIT!+Special+Offer',
        alt: '特別オファー',
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderRadius: 0,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      }),
      createSpacerElement({ height: 20 }),
      createTextElement({
        content: 'ちょっとお待ちください!',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        margin: { top: 0, right: 24, bottom: 8, left: 24 },
      }),
      createTextElement({
        content: '今だけの特別割引をご用意しました。\nこのチャンスをお見逃しなく!',
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 1.6,
        margin: { top: 0, right: 24, bottom: 8, left: 24 },
      }),
      createTextElement({
        content: '30%OFF',
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ef4444',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createButtonElement({
        label: 'オファーを受け取る',
        linkUrl: '#',
        width: '80%',
        height: '52px',
        backgroundColor: '#ef4444',
        hoverBackgroundColor: '#dc2626',
        textColor: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        borderRadius: 12,
        alignment: 'center',
        margin: { top: 0, right: 0, bottom: 8, left: 0 },
      }),
      createTextElement({
        content: '結構です、通常価格で購入します',
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
        textDecoration: 'underline',
        linkUrl: '#',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      }),
    ];
    config.animation.entrance = 'zoom-in';
    config.animation.exit = 'fade-out';
    return config;
  },
};

export default exitIntentOffer;
