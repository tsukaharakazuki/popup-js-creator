import type { PopupConfig } from '../types/popup';
import { generateCSS } from './cssGenerator';
import { generateDOM } from './domGenerator';
import { generateDisplayRuleCode } from './displayRuleGenerator';

export function generatePopupCode(config: PopupConfig, minified = false): string {
  const id = config.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
  const prefix = `popup_${id}`;

  const css = generateCSS(config, prefix);
  const dom = generateDOM(config, prefix);
  const displayRules = generateDisplayRuleCode(config, prefix);

  const code = `(function() {
  'use strict';

  var POPUP_ID = '${prefix}';

  // Display rule checks
  ${displayRules}

  if (!shouldShow()) return;

  // Inject CSS
  function injectStyles() {
    var style = document.createElement('style');
    style.setAttribute('data-popup-id', POPUP_ID);
    style.textContent = ${JSON.stringify(css)};
    document.head.appendChild(style);
  }

  // Build popup DOM
  ${dom}

  // Close popup
  function closePopup(overlay) {
    var container = overlay.querySelector('.' + POPUP_ID + '-container');
    if (container) {
      container.style.animation = '${prefix}_exit ${config.animation.duration}ms ease forwards';
    }
    setTimeout(function() {
      overlay.remove();
      var style = document.querySelector('style[data-popup-id="' + POPUP_ID + '"]');
      if (style) style.remove();
      ${config.displayRules.frequency.type === 'once' ? `document.cookie = POPUP_ID + '_closed=1;path=/;max-age=31536000';` : ''}
      ${config.displayRules.frequency.type === 'once-per-session' ? `sessionStorage.setItem(POPUP_ID + '_closed', '1');` : ''}
      ${config.displayRules.frequency.type === 'every-n-days' ? `document.cookie = POPUP_ID + '_closed=1;path=/;max-age=' + ${(config.displayRules.frequency.days || 7) * 86400};` : ''}
    }, ${config.animation.duration});
  }

  // Setup trigger and show
  function init() {
    injectStyles();
    var overlay = buildPopup();
    document.body.appendChild(overlay);

    // Close button
    var closeBtn = overlay.querySelector('.' + POPUP_ID + '-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closePopup(overlay);
      });
    }

    // Overlay click to close
    ${config.overlay.closeOnClick ? `overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closePopup(overlay);
    });` : ''}

    // ESC key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closePopup(overlay);
    });

    // Close action buttons
    var closeBtns = overlay.querySelectorAll('[data-popup-action="close"]');
    for (var ci = 0; ci < closeBtns.length; ci++) {
      closeBtns[ci].addEventListener('click', function(e) {
        e.preventDefault();
        closePopup(overlay);
      });
    }
  }

  // Trigger setup
  ${generateTriggerCode(config, prefix)}
})();`;

  return minified ? minifyCode(code) : code;
}

function generateTriggerCode(config: PopupConfig, _prefix: string): string {
  const trigger = config.displayRules.trigger;

  switch (trigger.type) {
    case 'immediate':
      return `if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }`;

    case 'delay':
      return `if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, ${(trigger.delaySeconds || 3) * 1000});
    });
  } else {
    setTimeout(init, ${(trigger.delaySeconds || 3) * 1000});
  }`;

    case 'scroll':
      return `function onScroll() {
    var scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent >= ${trigger.scrollPercent || 50}) {
      window.removeEventListener('scroll', onScroll);
      init();
    }
  }
  window.addEventListener('scroll', onScroll);`;

    case 'exit-intent':
      return `document.addEventListener('mouseout', function handler(e) {
    if (e.clientY < 10) {
      document.removeEventListener('mouseout', handler);
      init();
    }
  });`;

    case 'click':
      return `document.addEventListener('click', function handler(e) {
    var target = e.target;
    while (target) {
      if (target.matches && target.matches('${trigger.clickSelector || '.popup-trigger'}')) {
        e.preventDefault();
        document.removeEventListener('click', handler);
        init();
        return;
      }
      target = target.parentElement;
    }
  });`;

    default:
      return `if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }`;
  }
}

function minifyCode(code: string): string {
  // Remove single-line comments but preserve // inside strings
  const stripComments = code.replace(
    /(["'])(?:(?!\1|\\).|\\.)*\1|\/\/.*$/gm,
    (match) => match.startsWith('/') ? '' : match
  );
  // Remove block comments
  const stripBlock = stripComments.replace(/\/\*[\s\S]*?\*\//g, '');
  // Collapse whitespace
  return stripBlock
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
    .replace(/\n/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
