import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createButtonElement, createBoxElement } from '../../utils/elementFactory';

const cookieConsent: TemplateDefinition = {
  id: 'cookie-consent',
  name: 'Cookie Consent',
  nameJa: 'Cookie同意',
  description: 'A GDPR-style cookie consent bar at the bottom of the page.',
  descriptionJa: '画面下部に表示されるCookie使用同意バナー。',
  category: 'notification',
  tags: ['cookie', 'consent', 'gdpr', 'privacy'],
  create: () => {
    const config = createDefaultPopupConfig('Cookie同意');
    config.container.position = 'bottom-center';
    config.container.width = { mobile: '100%', desktop: '100%' };
    config.container.maxWidth = { mobile: '100%', desktop: '100%' };
    config.container.borderRadius = 0;
    config.container.padding = { top: 16, right: 24, bottom: 16, left: 24 };
    config.container.backgroundColor = '#1f2937';
    config.container.boxShadow = { enabled: true, x: 0, y: -2, blur: 12, spread: 0, color: 'rgba(0,0,0,0.2)' };
    config.overlay.enabled = false;
    config.closeButton.enabled = false;
    config.displayRules.frequency = { type: 'once' };
    config.elements = [
      createBoxElement({
        direction: 'horizontal',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        children: [
          createTextElement({
            content: 'このサイトではCookieを使用しています。サイトの利用を続けることで、Cookieの使用に同意したとみなします。',
            fontSize: 13,
            color: '#d1d5db',
            textAlign: 'left',
          }),
          createBoxElement({
            direction: 'horizontal',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'flex-end',
            children: [
              createButtonElement({
                label: '同意する',
                linkUrl: '#',
                width: 'auto',
                height: '36px',
                backgroundColor: '#3b82f6',
                hoverBackgroundColor: '#2563eb',
                textColor: '#ffffff',
                fontSize: 13,
                fontWeight: 'bold',
                borderRadius: 6,
                action: 'close',
                padding: { top: 0, right: 20, bottom: 0, left: 20 },
              }),
              createButtonElement({
                label: '詳細',
                linkUrl: '#',
                width: 'auto',
                height: '36px',
                backgroundColor: 'transparent',
                hoverBackgroundColor: '#374151',
                textColor: '#9ca3af',
                fontSize: 13,
                fontWeight: 'normal',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#4b5563',
                action: 'link',
                padding: { top: 0, right: 16, bottom: 0, left: 16 },
              }),
            ],
          }),
        ],
      }),
    ];
    config.animation.entrance = 'slide-up';
    config.animation.exit = 'slide-down';
    return config;
  },
};

export default cookieConsent;
