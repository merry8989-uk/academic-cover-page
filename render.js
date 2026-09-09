// Cover Page Renderer
// Renders the live preview based on the current template, values, theme, and logo

function renderCover() {
  const template = COVER_TEMPLATES[STATE.templateId];
  const theme = COVER_THEMES[STATE.themeId];
  const values = STATE.values;
  const page = document.getElementById('coverPage');

  if (!page) return;

  // Apply theme colors as CSS variables
  const root = page.style;
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = '--cover-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.setProperty(cssVar, value);
  });

  // Build content
  let html = '<div class="page-frame">';

  // Logo
  if (STATE.logo) {
    html += `<img src="${STATE.logo}" class="cover-logo" alt="Logo" />`;
  }

  // Render sections
  template.sections.forEach(section => {
    html += renderSection(section, template, values);
  });

  html += '</div>';
  page.innerHTML = html;
}

function renderSection(section, template, values) {
  switch (section.type) {
    case 'header':
      return `
        <div class="cover-header">
          ${getVal(values, 'university', section.items) ? `<div class="univ">${escapeHtml(getVal(values, 'university', section.items))}</div>` : ''}
          ${getVal(values, 'college', section.items) ? `<div class="college">${escapeHtml(getVal(values, 'college', section.items))}</div>` : ''}
          ${getVal(values, 'location', section.items) ? `<div class="location">${escapeHtml(getVal(values, 'location', section.items))}</div>` : ''}
        </div>
        ${getVal(values, 'department', section.items) ? `<div class="cover-dept">${escapeHtml(getVal(values, 'department', section.items))}</div>` : ''}
      `;

    case 'divider':
      return '';

    case 'title':
      const titleKey = section.items.find(i => template.fields.find(f => f.key === i));
      const titleVal = titleKey ? getVal(values, titleKey, section.items) : '';
      return `
        <div class="cover-title-block">
          <h1 class="cover-title">${escapeHtml(titleVal || 'Title')}</h1>
        </div>
      `;

    case 'subtitle':
      const subVal = getVal(values, 'subtitle', section.items) || getVal(values, 'subjectName', section.items) || getVal(values, 'companyName', section.items);
      const subCode = getVal(values, 'subjectCode', section.items);
      return `
        <div class="cover-title-block" style="margin-top:-8px">
          <div class="cover-subtitle">${escapeHtml(subVal || '')}${subCode ? ` · <span style="font-family:'JetBrains Mono',monospace;font-style:normal">${escapeHtml(subCode)}</span>` : ''}</div>
        </div>
      `;

    case 'experiment':
      return `
        <div class="cover-experiment">
          ${getVal(values, 'experimentNo', section.items) ? `<div class="ex-num">Experiment ${escapeHtml(getVal(values, 'experimentNo', section.items))}</div>` : ''}
          ${getVal(values, 'experimentTitle', section.items) ? `<div class="ex-title">${escapeHtml(getVal(values, 'experimentTitle', section.items))}</div>` : ''}
          ${getVal(values, 'datePerformed', section.items) ? `<div class="ex-date">Date: ${formatDate(getVal(values, 'datePerformed', section.items))}</div>` : ''}
        </div>
      `;

    case 'details':
      const rows = section.items
        .map(key => {
          const field = template.fields.find(f => f.key === key);
          const val = getVal(values, key, section.items);
          if (!field || !val) return '';
          return `<tr><td>${escapeHtml(field.label)}</td><td>${escapeHtml(val)}</td></tr>`;
        })
        .filter(Boolean)
        .join('');
      if (!rows) return '';
      return `
        <div class="cover-details">
          <div class="cover-details-head">
            <span class="label">${escapeHtml(section.title || 'Details')}</span>
            ${section.numbering ? `<span class="num">${escapeHtml(section.numbering)}</span>` : ''}
          </div>
          <table>${rows}</table>
        </div>
      `;

    case 'guide':
      const guideRows = section.items
        .map(key => {
          const field = template.fields.find(f => f.key === key);
          const val = getVal(values, key, section.items);
          if (!field || !val) return '';
          return `<div class="cover-guide-row"><span class="k">${escapeHtml(field.label)}</span><span class="v">${escapeHtml(val)}</span></div>`;
        })
        .filter(Boolean)
        .join('');
      if (!guideRows) return '';
      return `<div class="cover-guide">${guideRows}</div>`;

    case 'meta':
      const metaItems = section.items
        .map(key => {
          const field = template.fields.find(f => f.key === key);
          let val = getVal(values, key, section.items);
          if (key === 'submissionDate' || key === 'date') val = formatDate(val);
          if (!field || !val) return '';
          return escapeHtml(val);
        })
        .filter(Boolean);
      if (!metaItems.length) return '';
      return `<div class="cover-meta">${metaItems.join(' · ')}</div>`;

    case 'footer':
      const footerItems = section.items
        .map(key => {
          const val = getVal(values, key, section.items);
          return val ? `<span class="name">${escapeHtml(val)}</span>` : '';
        })
        .filter(Boolean);
      if (!footerItems.length) return '';
      return `
        <div class="cover-footer">
          ${footerItems.join('<span class="sep">·</span>')}
        </div>
      `;

    default:
      return '';
  }
}

function getVal(values, key, allowed) {
  if (allowed && !allowed.includes(key)) return '';
  return values[key] || '';
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
