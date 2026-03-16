import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createImageElement, createButtonElement } from '../../utils/elementFactory';

const largeImageBanner: TemplateDefinition = {
  id: 'large-image-banner',
  name: 'Large Image Banner',
  nameJa: '大型画像バナー',
  description: 'A full-width image popup with minimal padding, ideal for visual campaigns.',
  descriptionJa: '大きな画像を主役にしたビジュアル重視のポップアップ。',
  category: 'promotion',
  tags: ['image', 'banner', 'visual'],
  create: () => {
    const config = createDefaultPopupConfig('大型画像バナー');
    config.container.position = 'center';
    config.container.width = { mobile: '95%', desktop: '560px' };
    config.container.padding = { top: 0, right: 0, bottom: 0, left: 0 };
    config.container.borderRadius = 12;
    config.elements = [
      createImageElement({
        src: 'https://placehold.co/560x360/6366f1/ffffff?text=Campaign+Banner',
        alt: 'キャンペーン画像',
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
        borderRadius: 0,
      }),
      createButtonElement({
        label: '詳しく見る',
        linkUrl: '#',
        width: '100%',
        height: '48px',
        backgroundColor: '#6366f1',
        hoverBackgroundColor: '#4f46e5',
        textColor: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
        borderRadius: 0,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      }),
    ];
    config.animation.entrance = 'zoom-in';
    config.closeButton.outsidePopup = false;
    config.closeButton.color = '#ffffff';
    return config;
  },
};

export default largeImageBanner;
