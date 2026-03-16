import type { PopupConfig } from './popup';

export interface TemplateDefinition {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  descriptionJa: string;
  category: 'promotion' | 'conversion' | 'notification' | 'feedback';
  tags: string[];
  create: () => PopupConfig;
}
