import type { TemplateDefinition } from '../../types/template';
import { createDefaultPopupConfig } from '../defaults';
import { createTextElement, createNpsElement } from '../../utils/elementFactory';

const surveyNps: TemplateDefinition = {
  id: 'survey-nps',
  name: 'Survey / NPS',
  nameJa: 'アンケート / NPS',
  description: 'A compact NPS survey popup with score buttons, positioned at bottom-right.',
  descriptionJa: '画面右下に表示されるNPSスコアポップアップ。',
  category: 'feedback',
  tags: ['survey', 'nps', 'feedback', 'score'],
  create: () => {
    const config = createDefaultPopupConfig('NPS アンケート');
    config.container.position = 'bottom-right';
    config.container.width = { mobile: '90%', desktop: '380px' };
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
        content: 'このサイトを友人や同僚にすすめる可能性はどのくらいですか?',
        fontSize: 13,
        color: '#6b7280',
        textAlign: 'left',
        margin: { top: 0, right: 0, bottom: 12, left: 0 },
      }),
      createNpsElement({
        min: 1,
        max: 10,
        step: 1,
        submitLabel: '送信する',
        successMessage: 'ご回答ありがとうございます!',
        buttonColor: '#e5e7eb',
        selectedColor: '#3b82f6',
        textColor: '#374151',
        selectedTextColor: '#ffffff',
      }),
    ];
    config.displayRules.trigger = { type: 'delay', delaySeconds: 30 };
    config.displayRules.frequency = { type: 'once' };
    config.animation.entrance = 'slide-left';
    return config;
  },
};

export default surveyNps;
