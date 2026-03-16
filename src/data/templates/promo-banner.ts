import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createImageElement, createButtonElement } from '../../utils/elementFactory';

const promoBanner: TemplateDefinition = {
  id: 'promo-banner',
  name: 'Promo Banner',
  nameJa: 'プロモバナー',
  description: 'A promotional popup with title, image, and call-to-action button.',
  descriptionJa: 'タイトル、画像、CTAボタンを備えたプロモーションポップアップ。',
  category: 'promotion',
  tags: ['promo', 'banner', 'cta'],
  create: () => {
    const config = createDefaultPopupConfig('プロモバナー');
    config.container.position = 'center';
    config.container.width = { mobile: '90%', desktop: '420px' };
    config.container.padding = { top: 24, right: 24, bottom: 24, left: 24 };
    config.elements = [
      createTextElement({
        content: '期間限定セール開催中!',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 12, left: 0 },
      }),
      createImageElement({
        src: 'https://placehold.co/400x200/3b82f6/ffffff?text=SALE+50%25+OFF',
        alt: 'セール画像',
        width: '100%',
        height: 'auto',
        borderRadius: 8,
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createTextElement({
        content: '本日より3日間、全商品50%OFF。お見逃しなく!',
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createButtonElement({
        label: '今すぐチェック',
        linkUrl: '#',
        width: '100%',
        height: '48px',
        backgroundColor: '#ef4444',
        hoverBackgroundColor: '#dc2626',
        textColor: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        borderRadius: 8,
      }),
    ];
    config.animation.entrance = 'zoom-in';
    return config;
  },
};

export default promoBanner;
