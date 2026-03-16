import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createButtonElement } from '../../utils/elementFactory';

const slideInWidget: TemplateDefinition = {
  id: 'slide-in-widget',
  name: 'Slide-in Widget',
  nameJa: 'スライドイン',
  description: 'A small slide-in widget at the bottom-right corner.',
  descriptionJa: '画面右下からスライドインする小型ウィジェット。',
  category: 'conversion',
  tags: ['slide-in', 'widget', 'cta', 'small'],
  create: () => {
    const config = createDefaultPopupConfig('スライドイン');
    config.container.position = 'bottom-right';
    config.container.width = { mobile: '85%', desktop: '300px' };
    config.container.padding = { top: 20, right: 20, bottom: 20, left: 20 };
    config.container.offsetX = 16;
    config.container.offsetY = 16;
    config.container.borderRadius = 12;
    config.container.backgroundColor = '#ffffff';
    config.container.boxShadow = { enabled: true, x: 0, y: 4, blur: 20, spread: 0, color: 'rgba(0,0,0,0.15)' };
    config.overlay.enabled = false;
    config.displayRules.trigger = { type: 'scroll', scrollPercent: 40 };
    config.elements = [
      createTextElement({
        content: 'お困りですか?',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'left',
        margin: { top: 0, right: 0, bottom: 4, left: 0 },
      }),
      createTextElement({
        content: 'お気軽にお問い合わせください。スタッフが丁寧にサポートします。',
        fontSize: 13,
        color: '#6b7280',
        textAlign: 'left',
        lineHeight: 1.5,
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createButtonElement({
        label: 'チャットで相談',
        linkUrl: '#',
        width: '100%',
        height: '40px',
        backgroundColor: '#10b981',
        hoverBackgroundColor: '#059669',
        textColor: '#ffffff',
        fontSize: 13,
        fontWeight: 'bold',
        borderRadius: 8,
      }),
    ];
    config.animation.entrance = 'slide-left';
    config.animation.exit = 'slide-down';
    return config;
  },
};

export default slideInWidget;
