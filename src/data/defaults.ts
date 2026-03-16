import { nanoid } from 'nanoid';
import type { PopupConfig } from '../types/popup';

export function createDefaultPopupConfig(name = '新しいポップアップ'): PopupConfig {
  return {
    id: nanoid(),
    name,
    version: 1,
    container: {
      width: { mobile: '90%', desktop: '480px' },
      height: { mobile: 'auto', desktop: 'auto' },
      maxWidth: { mobile: '100%', desktop: '600px' },
      maxHeight: { mobile: '90vh', desktop: '80vh' },
      position: 'center',
      offsetX: 0,
      offsetY: 0,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      borderWidth: 0,
      borderColor: '#e5e7eb',
      borderStyle: 'none',
      boxShadow: {
        enabled: true,
        x: 0,
        y: 4,
        blur: 24,
        spread: 0,
        color: 'rgba(0,0,0,0.15)',
      },
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      zIndex: 99999,
    },
    elements: [],
    displayRules: {
      trigger: { type: 'immediate' },
      frequency: { type: 'always' },
      targeting: {
        urlMatch: [],
        deviceTypes: ['mobile', 'tablet', 'desktop'],
      },
      scheduling: { enabled: false },
    },
    closeButton: {
      enabled: true,
      position: 'top-right',
      size: 24,
      color: '#6b7280',
      offsetX: 8,
      offsetY: 8,
      outsidePopup: false,
    },
    overlay: {
      enabled: true,
      color: 'rgba(0,0,0,0.5)',
      closeOnClick: true,
    },
    animation: {
      entrance: 'fade-in',
      exit: 'fade-out',
      duration: 300,
    },
  };
}
