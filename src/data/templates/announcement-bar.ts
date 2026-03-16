import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createButtonElement, createBoxElement } from '../../utils/elementFactory';

const announcementBar: TemplateDefinition = {
  id: 'announcement-bar',
  name: 'Announcement Bar',
  nameJa: 'お知らせバー',
  description: 'A top notification bar with text and optional action button.',
  descriptionJa: '画面上部に表示されるお知らせバー。テキストとボタンを横並びで表示。',
  category: 'notification',
  tags: ['announcement', 'bar', 'notification', 'top'],
  create: () => {
    const config = createDefaultPopupConfig('お知らせバー');
    config.container.position = 'top-center';
    config.container.width = { mobile: '100%', desktop: '100%' };
    config.container.maxWidth = { mobile: '100%', desktop: '100%' };
    config.container.borderRadius = 0;
    config.container.padding = { top: 12, right: 20, bottom: 12, left: 20 };
    config.container.backgroundColor = '#1e40af';
    config.container.boxShadow = { enabled: true, x: 0, y: 2, blur: 8, spread: 0, color: 'rgba(0,0,0,0.15)' };
    config.overlay.enabled = false;
    config.closeButton.color = '#ffffff';
    config.closeButton.size = 20;
    config.elements = [
      createBoxElement({
        direction: 'horizontal',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        children: [
          createTextElement({
            content: '新機能リリース! 詳細をご確認ください。',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
          }),
          createButtonElement({
            label: '詳しく見る',
            linkUrl: '#',
            width: 'auto',
            height: '32px',
            backgroundColor: '#ffffff',
            hoverBackgroundColor: '#f3f4f6',
            textColor: '#1e40af',
            fontSize: 12,
            fontWeight: 'bold',
            borderRadius: 6,
            padding: { top: 0, right: 16, bottom: 0, left: 16 },
          }),
        ],
      }),
    ];
    config.animation.entrance = 'slide-down';
    config.animation.exit = 'slide-up';
    return config;
  },
};

export default announcementBar;
