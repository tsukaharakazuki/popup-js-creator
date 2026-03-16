import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createButtonElement, createDividerElement } from '../../utils/elementFactory';

const couponDiscount: TemplateDefinition = {
  id: 'coupon-discount',
  name: 'Coupon Discount',
  nameJa: 'クーポン表示',
  description: 'A popup displaying a coupon code with copy action.',
  descriptionJa: 'クーポンコードを目立つように表示するポップアップ。',
  category: 'promotion',
  tags: ['coupon', 'discount', 'code'],
  create: () => {
    const config = createDefaultPopupConfig('クーポン表示');
    config.container.position = 'center';
    config.container.width = { mobile: '85%', desktop: '380px' };
    config.container.padding = { top: 32, right: 24, bottom: 24, left: 24 };
    config.container.backgroundColor = '#fef3c7';
    config.container.borderWidth = 2;
    config.container.borderColor = '#f59e0b';
    config.container.borderStyle = 'solid';
    config.elements = [
      createTextElement({
        content: '特別クーポン',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#92400e',
        textAlign: 'center',
        letterSpacing: 2,
        margin: { top: 0, right: 0, bottom: 8, left: 0 },
      }),
      createTextElement({
        content: '20% OFF',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#d97706',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 8, left: 0 },
      }),
      createTextElement({
        content: '全商品対象・期間限定',
        fontSize: 13,
        color: '#92400e',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createDividerElement({
        color: '#f59e0b',
        thickness: 1,
        style: 'dashed',
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createTextElement({
        content: 'クーポンコード:',
        fontSize: 12,
        color: '#78716c',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 4, left: 0 },
      }),
      createTextElement({
        content: 'SAVE20NOW',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        letterSpacing: 3,
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createButtonElement({
        label: 'コードをコピー',
        linkUrl: '#',
        width: '100%',
        height: '44px',
        backgroundColor: '#d97706',
        hoverBackgroundColor: '#b45309',
        textColor: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        borderRadius: 8,
        action: 'custom',
      }),
    ];
    config.animation.entrance = 'zoom-in';
    return config;
  },
};

export default couponDiscount;
