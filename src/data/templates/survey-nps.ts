import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createFormElement } from '../../utils/elementFactory';

const surveyNps: TemplateDefinition = {
  id: 'survey-nps',
  name: 'Survey / NPS',
  nameJa: 'アンケート',
  description: 'A compact survey popup with a select field, positioned at bottom-right.',
  descriptionJa: '画面右下に表示される小さなアンケートポップアップ。',
  category: 'feedback',
  tags: ['survey', 'nps', 'feedback', 'form'],
  create: () => {
    const config = createDefaultPopupConfig('アンケート');
    config.container.position = 'bottom-right';
    config.container.width = { mobile: '90%', desktop: '320px' };
    config.container.padding = { top: 20, right: 20, bottom: 20, left: 20 };
    config.container.offsetX = 16;
    config.container.offsetY = 16;
    config.overlay.enabled = false;
    config.elements = [
      createTextElement({
        content: 'ご意見をお聞かせください',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'left',
        margin: { top: 0, right: 0, bottom: 4, left: 0 },
      }),
      createTextElement({
        content: 'このサイトのご利用体験はいかがですか?',
        fontSize: 13,
        color: '#6b7280',
        textAlign: 'left',
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      }),
      createFormElement({
        fields: [
          {
            id: 'field-rating',
            fieldType: 'select',
            label: '満足度',
            name: 'rating',
            placeholder: '選択してください',
            required: true,
            options: ['非常に満足', '満足', '普通', '不満', '非常に不満'],
          },
          {
            id: 'field-comment',
            fieldType: 'text',
            label: 'コメント（任意）',
            name: 'comment',
            placeholder: 'ご自由にどうぞ',
            required: false,
          },
        ],
        submitLabel: '送信する',
        submitUrl: '',
        submitMethod: 'post',
        successMessage: 'ご回答ありがとうございます!',
      }),
    ];
    config.displayRules.trigger = { type: 'delay', delaySeconds: 30 };
    config.displayRules.frequency = { type: 'once' };
    config.animation.entrance = 'slide-left';
    return config;
  },
};

export default surveyNps;
