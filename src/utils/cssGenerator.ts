import type { PopupConfig, PopupElement, SpacingConfig, BoxElement } from '../types/popup';

export function generateCSS(config: PopupConfig, prefix: string): string {
  const c = config.container;
  const close = config.closeButton;
  const overlay = config.overlay;
  const anim = config.animation;

  const lines: string[] = [];

  // Overlay
  if (overlay.enabled) {
    lines.push(`.${prefix}-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: ${overlay.color};
  z-index: ${c.zIndex};
  display: flex;
  ${getPositionCSS(c.position)}
}`);
  } else {
    lines.push(`.${prefix}-overlay {
  position: fixed;
  ${getFixedPositionCSS(c.position, c.offsetX, c.offsetY)}
  z-index: ${c.zIndex};
}`);
  }

  // Container
  lines.push(`.${prefix}-container {
  position: relative;
  width: ${c.width.desktop};
  ${c.height.desktop !== 'auto' ? `height: ${c.height.desktop};` : ''}
  ${c.maxWidth ? `max-width: ${c.maxWidth.desktop};` : ''}
  ${c.maxHeight ? `max-height: ${c.maxHeight.desktop};` : ''}
  background: ${c.backgroundColor};
  ${c.backgroundImage ? `background-image: url(${c.backgroundImage}); background-size: ${c.backgroundSize || 'cover'};` : ''}
  border-radius: ${c.borderRadius}px;
  ${c.borderWidth > 0 ? `border: ${c.borderWidth}px ${c.borderStyle} ${c.borderColor};` : ''}
  ${c.boxShadow.enabled ? `box-shadow: ${c.boxShadow.x}px ${c.boxShadow.y}px ${c.boxShadow.blur}px ${c.boxShadow.spread}px ${c.boxShadow.color};` : ''}
  padding: ${spacingToCSS(c.padding)};
  overflow-y: auto;
  box-sizing: border-box;
  animation: ${prefix}_entrance ${anim.duration}ms ease;
}`);

  // Close button
  if (close.enabled) {
    lines.push(`.${prefix}-close {
  position: absolute;
  ${close.position === 'top-right' ? `top: ${close.outsidePopup ? -close.size - close.offsetY : close.offsetY}px; right: ${close.outsidePopup ? -close.size - close.offsetX : close.offsetX}px;` : `top: ${close.outsidePopup ? -close.size - close.offsetY : close.offsetY}px; left: ${close.outsidePopup ? -close.size - close.offsetX : close.offsetX}px;`}
  width: ${close.size}px;
  height: ${close.size}px;
  cursor: pointer;
  background: none;
  border: none;
  color: ${close.color};
  font-size: ${close.size * 0.7}px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding: 0;
}
.${prefix}-close:hover { opacity: 0.7; }`);
  }

  // Element styles
  config.elements.forEach((el) => {
    lines.push(generateElementCSS(el, prefix));
  });

  // Entrance animation
  lines.push(generateEntranceKeyframes(prefix, anim.entrance));
  lines.push(generateExitKeyframes(prefix, anim.exit));

  // Mobile responsive
  lines.push(`@media (max-width: 519px) {
  .${prefix}-container {
    width: ${c.width.mobile};
    ${c.maxWidth ? `max-width: ${c.maxWidth.mobile};` : ''}
    ${c.maxHeight ? `max-height: ${c.maxHeight.mobile};` : ''}
  }
}`);

  // Tablet responsive
  if (c.width.tablet) {
    lines.push(`@media (min-width: 520px) and (max-width: 959px) {
  .${prefix}-container {
    width: ${c.width.tablet};
  }
}`);
  }

  return lines.join('\n');
}

function getPositionCSS(position: string): string {
  const map: Record<string, string> = {
    'top-left': 'align-items: flex-start; justify-content: flex-start;',
    'top-center': 'align-items: flex-start; justify-content: center;',
    'top-right': 'align-items: flex-start; justify-content: flex-end;',
    'center-left': 'align-items: center; justify-content: flex-start;',
    'center': 'align-items: center; justify-content: center;',
    'center-right': 'align-items: center; justify-content: flex-end;',
    'bottom-left': 'align-items: flex-end; justify-content: flex-start;',
    'bottom-center': 'align-items: flex-end; justify-content: center;',
    'bottom-right': 'align-items: flex-end; justify-content: flex-end;',
  };
  return map[position] || map['center'];
}

function getFixedPositionCSS(position: string, offsetX: number, offsetY: number): string {
  const map: Record<string, string> = {
    'top-left': `top: ${offsetY}px; left: ${offsetX}px;`,
    'top-center': `top: ${offsetY}px; left: 50%; transform: translateX(-50%);`,
    'top-right': `top: ${offsetY}px; right: ${offsetX}px;`,
    'center-left': `top: 50%; left: ${offsetX}px; transform: translateY(-50%);`,
    'center': `top: 50%; left: 50%; transform: translate(-50%, -50%);`,
    'center-right': `top: 50%; right: ${offsetX}px; transform: translateY(-50%);`,
    'bottom-left': `bottom: ${offsetY}px; left: ${offsetX}px;`,
    'bottom-center': `bottom: ${offsetY}px; left: 50%; transform: translateX(-50%);`,
    'bottom-right': `bottom: ${offsetY}px; right: ${offsetX}px;`,
  };
  return map[position] || map['center'];
}

function spacingToCSS(s: SpacingConfig): string {
  return `${s.top}px ${s.right}px ${s.bottom}px ${s.left}px`;
}

function generateElementCSS(el: PopupElement, prefix: string): string {
  const base = `margin: ${spacingToCSS(el.margin || { top: 0, right: 0, bottom: 0, left: 0 })}; padding: ${spacingToCSS(el.padding || { top: 0, right: 0, bottom: 0, left: 0 })};`;

  switch (el.type) {
    case 'text':
      return `.${prefix}-el-${el.id} { ${base} font-size: ${el.fontSize}px; font-family: ${el.fontFamily}; font-weight: ${el.fontWeight}; font-style: ${el.fontStyle}; text-decoration: ${el.textDecoration}; color: ${el.color}; text-align: ${el.textAlign}; line-height: ${el.lineHeight}; letter-spacing: ${el.letterSpacing}px; }`;
    case 'image':
      return `.${prefix}-el-${el.id} { ${base} display: block; width: ${el.width}; height: ${el.height}; object-fit: ${el.objectFit}; border-radius: ${el.borderRadius}px; ${el.alignment === 'center' ? 'margin-left: auto; margin-right: auto;' : el.alignment === 'right' ? 'margin-left: auto;' : ''} }`;
    case 'button':
      return `.${prefix}-el-${el.id} { ${base} display: inline-block; width: ${el.width}; height: ${el.height}; background: ${el.backgroundColor}; color: ${el.textColor}; font-size: ${el.fontSize}px; font-weight: ${el.fontWeight}; border-radius: ${el.borderRadius}px; border: ${el.borderWidth}px solid ${el.borderColor}; cursor: pointer; text-decoration: none; text-align: center; line-height: ${el.height}; box-sizing: border-box; }
.${prefix}-el-${el.id}:hover { background: ${el.hoverBackgroundColor}; }
.${prefix}-btn-wrap-${el.id} { text-align: ${el.alignment}; }`;
    case 'divider':
      return `.${prefix}-el-${el.id} { ${base} border: none; border-top: ${el.thickness}px ${el.style} ${el.color}; }`;
    case 'spacer':
      return `.${prefix}-el-${el.id} { height: ${el.height}px; }`;
    case 'box': {
      const box = el as BoxElement;
      let css = `.${prefix}-el-${el.id} { ${base} display: flex; flex-direction: ${box.direction === 'vertical' ? 'column' : 'row'}; gap: ${box.gap}px; align-items: ${box.alignItems}; justify-content: ${box.justifyContent}; ${box.backgroundColor ? `background: ${box.backgroundColor};` : ''} ${box.borderRadius ? `border-radius: ${box.borderRadius}px;` : ''} }`;
      box.children.forEach((child) => {
        css += '\n' + generateElementCSS(child, prefix);
      });
      return css;
    }
    case 'carousel':
      return `.${prefix}-el-${el.id} { ${base} position: relative; overflow: hidden; }
.${prefix}-el-${el.id} .carousel-track { display: flex; transition: transform 0.3s ease; }
.${prefix}-el-${el.id} .carousel-slide { min-width: 100%; box-sizing: border-box; }
.${prefix}-el-${el.id} .carousel-dots { display: flex; justify-content: center; gap: 6px; margin-top: 8px; }
.${prefix}-el-${el.id} .carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; border: none; cursor: pointer; padding: 0; }
.${prefix}-el-${el.id} .carousel-dot.active { background: #333; }
.${prefix}-el-${el.id} .carousel-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.8); border: none; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; display: flex; align-items: center; justify-content: center; }
.${prefix}-el-${el.id} .carousel-prev { left: 8px; }
.${prefix}-el-${el.id} .carousel-next { right: 8px; }`;
    case 'form':
      return `.${prefix}-el-${el.id} { ${base} }
.${prefix}-el-${el.id} label { display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; }
.${prefix}-el-${el.id} input, .${prefix}-el-${el.id} select { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box; margin-bottom: 12px; }
.${prefix}-el-${el.id} button[type="submit"] { width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }`;
    case 'nps':
      return `.${prefix}-el-${el.id} { ${base} display: flex; flex-direction: column; gap: 12px; }
.${prefix}-el-${el.id} .nps-buttons { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.${prefix}-el-${el.id} .nps-btn { width: 36px; height: 36px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px; font-weight: 600; background: ${el.buttonColor}; color: ${el.textColor}; transition: background-color 0.15s, color 0.15s; }
.${prefix}-el-${el.id} .nps-btn.selected { background: ${el.selectedColor}; color: ${el.selectedTextColor}; }
.${prefix}-el-${el.id} .nps-labels { display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; }
.${prefix}-el-${el.id} .nps-submit { width: 100%; padding: 10px; background: ${el.selectedColor}; color: ${el.selectedTextColor}; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
.${prefix}-el-${el.id} .nps-submit:disabled { opacity: 0.5; cursor: not-allowed; }`;
    case 'html':
      return `.${prefix}-el-${el.id} { ${base} }`;
    default:
      return '';
  }
}

function generateEntranceKeyframes(prefix: string, type: string): string {
  const map: Record<string, string> = {
    'none': `@keyframes ${prefix}_entrance { from { opacity: 1; } to { opacity: 1; } }`,
    'fade-in': `@keyframes ${prefix}_entrance { from { opacity: 0; } to { opacity: 1; } }`,
    'slide-up': `@keyframes ${prefix}_entrance { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`,
    'slide-down': `@keyframes ${prefix}_entrance { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }`,
    'slide-left': `@keyframes ${prefix}_entrance { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }`,
    'slide-right': `@keyframes ${prefix}_entrance { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }`,
    'zoom-in': `@keyframes ${prefix}_entrance { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }`,
  };
  return map[type] || map['none'];
}

function generateExitKeyframes(prefix: string, type: string): string {
  const map: Record<string, string> = {
    'none': `@keyframes ${prefix}_exit { from { opacity: 1; } to { opacity: 1; } }`,
    'fade-out': `@keyframes ${prefix}_exit { from { opacity: 1; } to { opacity: 0; } }`,
    'slide-up': `@keyframes ${prefix}_exit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-30px); } }`,
    'slide-down': `@keyframes ${prefix}_exit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(30px); } }`,
    'zoom-out': `@keyframes ${prefix}_exit { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.8); } }`,
  };
  return map[type] || map['none'];
}
