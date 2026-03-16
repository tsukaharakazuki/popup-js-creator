import type { PopupConfig } from '../types/popup';

export function generateDisplayRuleCode(config: PopupConfig, prefix: string): string {
  const rules = config.displayRules;
  const conditions: string[] = [];

  // Frequency check
  switch (rules.frequency.type) {
    case 'once':
      conditions.push(`document.cookie.indexOf('${prefix}_closed=1') === -1`);
      break;
    case 'once-per-session':
      conditions.push(`!sessionStorage.getItem('${prefix}_closed')`);
      break;
    case 'every-n-days':
      conditions.push(`document.cookie.indexOf('${prefix}_closed=1') === -1`);
      break;
    case 'always':
    default:
      break;
  }

  // Device targeting
  if (rules.targeting.deviceTypes.length < 3) {
    const deviceChecks: string[] = [];
    if (rules.targeting.deviceTypes.includes('mobile')) {
      deviceChecks.push('w <= 519');
    }
    if (rules.targeting.deviceTypes.includes('tablet')) {
      deviceChecks.push('(w >= 520 && w <= 959)');
    }
    if (rules.targeting.deviceTypes.includes('desktop')) {
      deviceChecks.push('w >= 960');
    }
    if (deviceChecks.length > 0) {
      conditions.push(`(function() { var w = window.innerWidth; return ${deviceChecks.join(' || ')}; })()`);
    }
  }

  // URL targeting
  if (rules.targeting.urlMatch.length > 0) {
    const urlChecks = rules.targeting.urlMatch.map((rule) => {
      const loc = 'window.location.href';
      let check: string;
      switch (rule.type) {
        case 'exact':
          check = `${loc} === ${JSON.stringify(rule.value)}`;
          break;
        case 'contains':
          check = `${loc}.indexOf(${JSON.stringify(rule.value)}) !== -1`;
          break;
        case 'starts-with':
          check = `${loc}.indexOf(${JSON.stringify(rule.value)}) === 0`;
          break;
        case 'regex':
          check = `new RegExp(${JSON.stringify(rule.value)}).test(${loc})`;
          break;
        default:
          check = 'true';
      }
      return rule.exclude ? `!(${check})` : check;
    });
    conditions.push(`(${urlChecks.join(' && ')})`);
  }

  // Scheduling
  if (rules.scheduling.enabled) {
    if (rules.scheduling.startDate) {
      conditions.push(`new Date() >= new Date(${JSON.stringify(rules.scheduling.startDate)})`);
    }
    if (rules.scheduling.endDate) {
      conditions.push(`new Date() <= new Date(${JSON.stringify(rules.scheduling.endDate)})`);
    }
  }

  const body = conditions.length > 0
    ? `return ${conditions.join(' && ')};`
    : 'return true;';

  return `function shouldShow() {\n    ${body}\n  }`;
}
