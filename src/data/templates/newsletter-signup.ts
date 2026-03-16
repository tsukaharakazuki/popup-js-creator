import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createFormElement } from '../../utils/elementFactory';

const newsletterSignup: TemplateDefinition = {
  id: 'newsletter-signup',
  name: 'Newsletter Signup',
  nameJa: 'メルマガ登録',
  description: 'An email subscription popup with title, description, and form.',
  descriptionJa: 'メールマガジン登録を促すフォーム付きポップアップ。',
  category: 'conversion',
  tags: ['newsletter', 'email', 'signup', 'form'],
  create: () => {
    const config = createDefaultPopupConfig('メルマガ登録');
    config.container.position = 'center';
    config.container.width = { mobile: '90%', desktop: '420px' };
    config.container.padding = { top: 32, right: 28, bottom: 28, left: 28 };
    config.elements = [
      createTextElement({
        content: 'ニュースレターに登録',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 8, left: 0 },
      }),
      createTextElement({
        content: '最新のお知らせやお得な情報をお届けします。',
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 20, left: 0 },
      }),
      createFormElement({
        fields: [
          {
            id: 'field-email',
            fieldType: 'email',
            label: 'メールアドレス',
            name: 'email',
            placeholder: 'your@email.com',
            required: true,
          },
        ],
        submitLabel: '登録する',
        submitUrl: '',
        submitMethod: 'post',
        successMessage: '登録ありがとうございます!',
        margin: { top: 0, right: 0, bottom: 12, left: 0 },
      }),
      createTextElement({
        content: 'いつでも配信停止できます。',
        fontSize: 11,
        color: '#9ca3af',
        textAlign: 'center',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      }),
    ];
    config.animation.entrance = 'slide-up';
    return config;
  },
};

export default newsletterSignup;
