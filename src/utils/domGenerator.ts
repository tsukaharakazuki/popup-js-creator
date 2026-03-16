import type { PopupConfig, PopupElement, BoxElement, CarouselElement, FormElement, NpsElement } from '../types/popup';

export function generateDOM(config: PopupConfig, prefix: string): string {
  const lines: string[] = [];

  lines.push(`function buildPopup() {`);

  // Overlay
  lines.push(`  var overlay = document.createElement('div');`);
  lines.push(`  overlay.className = '${prefix}-overlay';`);

  // Container
  lines.push(`  var container = document.createElement('div');`);
  lines.push(`  container.className = '${prefix}-container';`);

  // Close button
  if (config.closeButton.enabled) {
    lines.push(`  var closeBtn = document.createElement('button');`);
    lines.push(`  closeBtn.className = '${prefix}-close';`);
    lines.push(`  closeBtn.innerHTML = '&#10005;';`);
    lines.push(`  closeBtn.setAttribute('aria-label', 'Close');`);
    lines.push(`  container.appendChild(closeBtn);`);
  }

  // Elements
  config.elements.forEach((el, i) => {
    const varName = `el${i}`;
    lines.push(generateElementDOM(el, prefix, varName, '  '));
    lines.push(`  container.appendChild(${varName});`);
  });

  lines.push(`  overlay.appendChild(container);`);
  lines.push(`  return overlay;`);
  lines.push(`}`);

  return lines.join('\n');
}

function generateElementDOM(el: PopupElement, prefix: string, varName: string, indent: string): string {
  const lines: string[] = [];

  switch (el.type) {
    case 'text': {
      if (el.linkUrl) {
        lines.push(`${indent}var ${varName} = document.createElement('a');`);
        lines.push(`${indent}${varName}.href = ${JSON.stringify(el.linkUrl)};`);
        if (el.linkTarget === '_blank') {
          lines.push(`${indent}${varName}.target = '_blank';`);
          lines.push(`${indent}${varName}.rel = 'noopener noreferrer';`);
        }
      } else {
        lines.push(`${indent}var ${varName} = document.createElement('div');`);
      }
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);
      lines.push(`${indent}${varName}.textContent = ${JSON.stringify(el.content)};`);
      break;
    }

    case 'image': {
      const hasLink = !!el.linkUrl;
      if (hasLink) {
        lines.push(`${indent}var ${varName}Link = document.createElement('a');`);
        lines.push(`${indent}${varName}Link.href = ${JSON.stringify(el.linkUrl)};`);
        if (el.linkTarget === '_blank') {
          lines.push(`${indent}${varName}Link.target = '_blank';`);
          lines.push(`${indent}${varName}Link.rel = 'noopener noreferrer';`);
        }
      }
      lines.push(`${indent}var ${varName} = document.createElement('img');`);
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);
      lines.push(`${indent}${varName}.src = ${JSON.stringify(el.src)};`);
      lines.push(`${indent}${varName}.alt = ${JSON.stringify(el.alt)};`);
      if (hasLink) {
        lines.push(`${indent}${varName}Link.appendChild(${varName});`);
        lines.push(`${indent}var ${varName} = ${varName}Link;`);
      }
      break;
    }

    case 'button': {
      lines.push(`${indent}var ${varName}Wrap = document.createElement('div');`);
      lines.push(`${indent}${varName}Wrap.className = '${prefix}-btn-wrap-${el.id}';`);
      if (el.action === 'close') {
        lines.push(`${indent}var ${varName} = document.createElement('button');`);
        lines.push(`${indent}${varName}.setAttribute('data-popup-action', 'close');`);
      } else {
        lines.push(`${indent}var ${varName} = document.createElement('a');`);
        lines.push(`${indent}${varName}.href = ${JSON.stringify(el.linkUrl)};`);
        lines.push(`${indent}${varName}.target = ${JSON.stringify(el.linkTarget)};`);
        if (el.linkTarget === '_blank') {
          lines.push(`${indent}${varName}.rel = 'noopener noreferrer';`);
        }
      }
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);
      lines.push(`${indent}${varName}.textContent = ${JSON.stringify(el.label)};`);
      lines.push(`${indent}${varName}Wrap.appendChild(${varName});`);
      // Reassign varName to the wrapper
      lines.push(`${indent}var ${varName} = ${varName}Wrap;`);
      break;
    }

    case 'divider': {
      lines.push(`${indent}var ${varName} = document.createElement('hr');`);
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);
      break;
    }

    case 'spacer': {
      lines.push(`${indent}var ${varName} = document.createElement('div');`);
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);
      break;
    }

    case 'box': {
      const box = el as BoxElement;
      lines.push(`${indent}var ${varName} = document.createElement('div');`);
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);
      box.children.forEach((child, ci) => {
        const childVar = `${varName}_c${ci}`;
        lines.push(generateElementDOM(child, prefix, childVar, indent));
        lines.push(`${indent}${varName}.appendChild(${childVar});`);
      });
      break;
    }

    case 'carousel': {
      const carousel = el as CarouselElement;
      lines.push(`${indent}var ${varName} = document.createElement('div');`);
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);
      lines.push(`${indent}var ${varName}_track = document.createElement('div');`);
      lines.push(`${indent}${varName}_track.className = 'carousel-track';`);

      carousel.slides.forEach((slide, si) => {
        lines.push(`${indent}var ${varName}_s${si} = document.createElement('div');`);
        lines.push(`${indent}${varName}_s${si}.className = 'carousel-slide';`);
        slide.elements.forEach((child, ci) => {
          const childVar = `${varName}_s${si}_e${ci}`;
          lines.push(generateElementDOM(child, prefix, childVar, indent));
          lines.push(`${indent}${varName}_s${si}.appendChild(${childVar});`);
        });
        lines.push(`${indent}${varName}_track.appendChild(${varName}_s${si});`);
      });

      lines.push(`${indent}${varName}.appendChild(${varName}_track);`);

      // Carousel navigation
      if (carousel.showArrows) {
        lines.push(`${indent}var ${varName}_prev = document.createElement('button');`);
        lines.push(`${indent}${varName}_prev.className = 'carousel-arrow carousel-prev';`);
        lines.push(`${indent}${varName}_prev.innerHTML = '&#8249;';`);
        lines.push(`${indent}var ${varName}_next = document.createElement('button');`);
        lines.push(`${indent}${varName}_next.className = 'carousel-arrow carousel-next';`);
        lines.push(`${indent}${varName}_next.innerHTML = '&#8250;';`);
        lines.push(`${indent}${varName}.appendChild(${varName}_prev);`);
        lines.push(`${indent}${varName}.appendChild(${varName}_next);`);
      }

      if (carousel.showDots) {
        lines.push(`${indent}var ${varName}_dots = document.createElement('div');`);
        lines.push(`${indent}${varName}_dots.className = 'carousel-dots';`);
        carousel.slides.forEach((_, si) => {
          lines.push(`${indent}var ${varName}_dot${si} = document.createElement('button');`);
          lines.push(`${indent}${varName}_dot${si}.className = 'carousel-dot${si === 0 ? ' active' : ''}';`);
          lines.push(`${indent}${varName}_dots.appendChild(${varName}_dot${si});`);
        });
        lines.push(`${indent}${varName}.appendChild(${varName}_dots);`);
      }

      // Carousel JS logic
      lines.push(`${indent}(function() {
${indent}  var currentSlide = 0;
${indent}  var slideCount = ${carousel.slides.length};
${indent}  var track = ${varName}_track;
${indent}  function goTo(n) {
${indent}    currentSlide = ((n % slideCount) + slideCount) % slideCount;
${indent}    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
${indent}    var dots = ${varName}.querySelectorAll('.carousel-dot');
${indent}    dots.forEach(function(d, i) { d.className = 'carousel-dot' + (i === currentSlide ? ' active' : ''); });
${indent}  }
${carousel.showArrows ? `${indent}  ${varName}_prev.addEventListener('click', function() { goTo(currentSlide - 1); });
${indent}  ${varName}_next.addEventListener('click', function() { goTo(currentSlide + 1); });` : ''}
${carousel.showDots ? `${indent}  ${varName}_dots.querySelectorAll('.carousel-dot').forEach(function(d, i) { d.addEventListener('click', function() { goTo(i); }); });` : ''}
${carousel.autoPlay ? `${indent}  setInterval(function() { goTo(currentSlide + 1); }, ${carousel.interval});` : ''}
${indent}})();`);
      break;
    }

    case 'form': {
      const form = el as FormElement;
      lines.push(`${indent}var ${varName} = document.createElement('form');`);
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);
      lines.push(`${indent}${varName}.action = ${JSON.stringify(form.submitUrl)};`);
      lines.push(`${indent}${varName}.method = ${JSON.stringify(form.submitMethod)};`);

      form.fields.forEach((field, fi) => {
        const fVar = `${varName}_f${fi}`;
        lines.push(`${indent}var ${fVar}_label = document.createElement('label');`);
        lines.push(`${indent}${fVar}_label.textContent = ${JSON.stringify(field.label)};`);
        lines.push(`${indent}${varName}.appendChild(${fVar}_label);`);

        if (field.fieldType === 'select') {
          lines.push(`${indent}var ${fVar} = document.createElement('select');`);
          lines.push(`${indent}${fVar}.name = ${JSON.stringify(field.name)};`);
          (field.options || []).filter(Boolean).forEach((opt) => {
            lines.push(`${indent}var opt = document.createElement('option');`);
            lines.push(`${indent}opt.value = ${JSON.stringify(opt)};`);
            lines.push(`${indent}opt.textContent = ${JSON.stringify(opt)};`);
            lines.push(`${indent}${fVar}.appendChild(opt);`);
          });
        } else if (field.fieldType === 'checkbox') {
          lines.push(`${indent}var ${fVar} = document.createElement('input');`);
          lines.push(`${indent}${fVar}.type = 'checkbox';`);
          lines.push(`${indent}${fVar}.name = ${JSON.stringify(field.name)};`);
        } else {
          lines.push(`${indent}var ${fVar} = document.createElement('input');`);
          lines.push(`${indent}${fVar}.type = ${JSON.stringify(field.fieldType)};`);
          lines.push(`${indent}${fVar}.name = ${JSON.stringify(field.name)};`);
          if (field.placeholder) {
            lines.push(`${indent}${fVar}.placeholder = ${JSON.stringify(field.placeholder)};`);
          }
        }
        if (field.required) {
          lines.push(`${indent}${fVar}.required = true;`);
        }
        lines.push(`${indent}${varName}.appendChild(${fVar});`);
      });

      lines.push(`${indent}var ${varName}_submit = document.createElement('button');`);
      lines.push(`${indent}${varName}_submit.type = 'submit';`);
      lines.push(`${indent}${varName}_submit.textContent = ${JSON.stringify(form.submitLabel)};`);
      lines.push(`${indent}${varName}.appendChild(${varName}_submit);`);
      break;
    }

    case 'nps': {
      const nps = el as NpsElement;
      lines.push(`${indent}var ${varName} = document.createElement('div');`);
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);

      // NPS buttons container
      lines.push(`${indent}var ${varName}_btns = document.createElement('div');`);
      lines.push(`${indent}${varName}_btns.className = 'nps-buttons';`);

      // Generate buttons
      lines.push(`${indent}var ${varName}_selected = null;`);
      lines.push(`${indent}for (var i = ${nps.min}; i <= ${nps.max}; i += ${nps.step}) {`);
      lines.push(`${indent}  (function(val) {`);
      lines.push(`${indent}    var btn = document.createElement('button');`);
      lines.push(`${indent}    btn.type = 'button';`);
      lines.push(`${indent}    btn.className = 'nps-btn';`);
      lines.push(`${indent}    btn.textContent = val;`);
      lines.push(`${indent}    btn.addEventListener('click', function() {`);
      lines.push(`${indent}      ${varName}_selected = val;`);
      lines.push(`${indent}      ${varName}_btns.querySelectorAll('.nps-btn').forEach(function(b) { b.className = 'nps-btn'; });`);
      lines.push(`${indent}      btn.className = 'nps-btn selected';`);
      lines.push(`${indent}      ${varName}_submit.disabled = false;`);
      lines.push(`${indent}    });`);
      lines.push(`${indent}    ${varName}_btns.appendChild(btn);`);
      lines.push(`${indent}  })(i);`);
      lines.push(`${indent}}`);
      lines.push(`${indent}${varName}.appendChild(${varName}_btns);`);

      // Labels row
      lines.push(`${indent}var ${varName}_labels = document.createElement('div');`);
      lines.push(`${indent}${varName}_labels.className = 'nps-labels';`);
      lines.push(`${indent}${varName}_labels.innerHTML = '<span>${nps.min}: 非常に不満</span><span>${nps.max}: 非常に満足</span>';`);
      lines.push(`${indent}${varName}.appendChild(${varName}_labels);`);

      // Submit button
      lines.push(`${indent}var ${varName}_submit = document.createElement('button');`);
      lines.push(`${indent}${varName}_submit.type = 'button';`);
      lines.push(`${indent}${varName}_submit.className = 'nps-submit';`);
      lines.push(`${indent}${varName}_submit.textContent = ${JSON.stringify(nps.submitLabel)};`);
      lines.push(`${indent}${varName}_submit.disabled = true;`);
      lines.push(`${indent}${varName}_submit.addEventListener('click', function() {`);
      lines.push(`${indent}  if (${varName}_selected === null) return;`);
      if (nps.submitUrl) {
        lines.push(`${indent}  var xhr = new XMLHttpRequest();`);
        lines.push(`${indent}  xhr.open(${JSON.stringify(nps.submitMethod.toUpperCase())}, ${JSON.stringify(nps.submitUrl)});`);
        lines.push(`${indent}  xhr.setRequestHeader('Content-Type', 'application/json');`);
        lines.push(`${indent}  xhr.send(JSON.stringify({ score: ${varName}_selected }));`);
      }
      lines.push(`${indent}  ${varName}_submit.textContent = ${JSON.stringify(nps.successMessage)};`);
      lines.push(`${indent}  setTimeout(function() { ${varName}_submit.textContent = ${JSON.stringify(nps.submitLabel)}; }, 2000);`);
      lines.push(`${indent}});`);
      lines.push(`${indent}${varName}.appendChild(${varName}_submit);`);
      break;
    }

    case 'html': {
      lines.push(`${indent}var ${varName} = document.createElement('div');`);
      lines.push(`${indent}${varName}.className = '${prefix}-el-${el.id}';`);
      lines.push(`${indent}${varName}.innerHTML = ${JSON.stringify(el.content)};`);
      break;
    }

    default: {
      lines.push(`${indent}var ${varName} = document.createElement('div');`);
      break;
    }
  }

  return lines.join('\n');
}
