import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createImageElement, createCarouselElement, createButtonElement } from '../../utils/elementFactory';

const productCarousel: TemplateDefinition = {
  id: 'product-carousel',
  name: 'Product Carousel',
  nameJa: '商品カルーセル',
  description: 'A carousel popup showcasing multiple products with images and CTAs.',
  descriptionJa: '複数の商品画像を切り替え表示するカルーセルポップアップ。',
  category: 'promotion',
  tags: ['carousel', 'product', 'ecommerce'],
  create: () => {
    const config = createDefaultPopupConfig('商品カルーセル');
    config.container.position = 'center';
    config.container.width = { mobile: '90%', desktop: '500px' };
    config.container.padding = { top: 20, right: 20, bottom: 20, left: 20 };
    config.elements = [
      createTextElement({
        content: 'おすすめ商品',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createCarouselElement({
        slides: [
          {
            id: 'slide-1',
            elements: [
              createImageElement({
                src: 'https://placehold.co/460x240/f59e0b/ffffff?text=Product+1',
                alt: '商品1',
                width: '100%',
                height: '240px',
                objectFit: 'cover',
                borderRadius: 8,
              }),
            ],
          },
          {
            id: 'slide-2',
            elements: [
              createImageElement({
                src: 'https://placehold.co/460x240/10b981/ffffff?text=Product+2',
                alt: '商品2',
                width: '100%',
                height: '240px',
                objectFit: 'cover',
                borderRadius: 8,
              }),
            ],
          },
          {
            id: 'slide-3',
            elements: [
              createImageElement({
                src: 'https://placehold.co/460x240/8b5cf6/ffffff?text=Product+3',
                alt: '商品3',
                width: '100%',
                height: '240px',
                objectFit: 'cover',
                borderRadius: 8,
              }),
            ],
          },
        ],
        autoPlay: true,
        interval: 4000,
        showDots: true,
        showArrows: true,
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createButtonElement({
        label: '商品一覧を見る',
        linkUrl: '#',
        width: '100%',
        height: '44px',
        backgroundColor: '#3b82f6',
        hoverBackgroundColor: '#2563eb',
        textColor: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        borderRadius: 8,
      }),
    ];
    config.animation.entrance = 'fade-in';
    return config;
  },
};

export default productCarousel;
