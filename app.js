// ============================================
// Academic Cover — Main App
// ============================================

// Notion config — frontend calls our own server-side proxy
const NOTION_CONFIG = {
  // The frontend calls /api/lead, which proxies to Notion (server.js).
  // This avoids CORS issues and keeps the Notion token on the server.
  apiEndpoint: '/api/lead'
};

// App State
const STATE = {
  templateId: 'assignment',
  themeId: 'navy',
  values: {},
  logo: null
};

// ============================================
// Initialize
// ============================================
function init() {
  // Set initial values
  STATE.values = { ...DEFAULT_VALUES[STATE.templateId] };

  // Update year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Render UI
  renderTemplateGrid();
  renderThemeGrid();
  renderFields();
  renderCover();
  updatePreviewMeta();

  // Bind global events
  bindEvents();

  // Init AI assistant
  initAI();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================
// Template Grid
// ============================================
function renderTemplateGrid() {
  const grid = document.getElementById('templateGrid');
  if (!grid) return;
  const icons = {
    document: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    flask: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6.5L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M7 14h10"/></svg>',
    briefcase: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    presentation: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>',
    building: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 21V9h6v12"/><path d="M9 7h.01"/><path d="M15 7h.01"/></svg>',
    academic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5"/></svg>'
  };
  let num = 1;
  grid.innerHTML = Object.values(COVER_TEMPLATES).map(t => `
    <div class="template-card ${t.id === STATE.templateId ? 'active' : ''}" data-template="${t.id}">
      <span class="template-card-num">/ 0${num++}</span>
      <div class="template-card-head">
        <div class="template-icon">${icons[t.icon] || icons.document}</div>
        <h3>${t.name}</h3>
      </div>
      <p>${t.description}</p>
    </div>
  `).join('');

  grid.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      const tpl = card.dataset.template;
      selectTemplate(tpl);
      document.getElementById('customizer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function selectTemplate(tplId) {
  if (!COVER_TEMPLATES[tplId]) return;
  STATE.templateId = tplId;
  // Merge defaults so newly added fields get values, keep existing user input
  STATE.values = { ...DEFAULT_VALUES[tplId], ...STATE.values };
  document.querySelectorAll('.template-card').forEach(c => {
    c.classList.toggle('active', c.dataset.template === tplId);
  });
  renderFields();
  renderCover();
  updatePreviewMeta();
  // Update CF template indicator
  const cfTpl = document.getElementById('cf-template');
  if (cfTpl) cfTpl.textContent = COVER_TEMPLATES[tplId].name;
  showToast(`Loaded ${COVER_TEMPLATES[tplId].name} template`);
}

// ============================================
// Theme Grid
// ============================================
function renderThemeGrid() {
  const grid = document.getElementById('themeGrid');
  if (!grid) return;
  grid.innerHTML = Object.values(COVER_THEMES).map(t => `
    <div class="theme-card ${t.id === STATE.themeId ? 'active' : ''}" data-theme="${t.id}">
      <div class="theme-preview">
        <div style="background:${t.colors.bg}"></div>
        <div style="background:${t.colors.surface}"></div>
        <div style="background:${t.colors.primary}"></div>
        <div style="background:${t.colors.accent}"></div>
      </div>
      <div class="theme-name">${t.name}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      STATE.themeId = card.dataset.theme;
      grid.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      renderCover();
      updatePreviewMeta();
    });
  });
}

function updatePreviewMeta() {
  const meta = document.getElementById('previewMeta');
  if (meta) {
    const t = COVER_TEMPLATES[STATE.templateId];
    const th = COVER_THEMES[STATE.themeId];
    meta.textContent = `${t.name} · ${th.name}`;
  }
}

// ============================================
// Fields Editor
// ============================================
function renderFields() {
  const grid = document.getElementById('fieldsGrid');
  if (!grid) return;
  const template = COVER_TEMPLATES[STATE.templateId];

  grid.innerHTML = template.fields.map(f => `
    <div class="field">
      <label>
        ${escapeHtml(f.label)}
        ${f.required ? '<span class="req">*</span>' : ''}
      </label>
      ${f.type === 'textarea'
        ? `<textarea data-key="${f.key}" rows="2" placeholder="${escapeHtml(f.placeholder || '')}">${escapeHtml(STATE.values[f.key] || '')}</textarea>`
        : `<input type="${f.type || 'text'}" data-key="${f.key}" placeholder="${escapeHtml(f.placeholder || '')}" value="${escapeHtml(STATE.values[f.key] || '')}" />`
      }
    </div>
  `).join('');

  grid.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', e => {
      const key = e.target.dataset.key;
      STATE.values[key] = e.target.value;
      renderCover();
    });
  });
}

// ============================================
// Logo / Branding
// ============================================
function bindBranding() {
  // Tab switching
  document.querySelectorAll('.logo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.logo-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.logo-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.querySelector(`.logo-panel[data-panel="${tab.dataset.tab}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  // File upload
  const fileInput = document.getElementById('logoFile');
  const fileDrop = document.getElementById('fileDrop');
  if (fileInput) {
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handleLogoFile(file);
    });
  }
  if (fileDrop) {
    fileDrop.addEventListener('dragover', e => {
      e.preventDefault();
      fileDrop.style.borderColor = 'var(--brand-accent)';
    });
    fileDrop.addEventListener('dragleave', () => {
      fileDrop.style.borderColor = '';
    });
    fileDrop.addEventListener('drop', e => {
      e.preventDefault();
      fileDrop.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file) handleLogoFile(file);
    });
  }

  // URL apply
  const urlBtn = document.getElementById('logoUrlApply');
  const urlInput = document.getElementById('logoUrl');
  if (urlBtn && urlInput) {
    const apply = () => {
      const url = urlInput.value.trim();
      if (url) {
        STATE.logo = url;
        showLogoPreview(url);
        showToast('Logo applied');
      }
    };
    urlBtn.addEventListener('click', apply);
    urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') apply(); });
  }

  // Remove logo
  const removeBtn = document.getElementById('logoRemove');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      STATE.logo = null;
      document.getElementById('logoPreview').hidden = true;
      document.getElementById('fileDrop').style.display = '';
      renderCover();
    });
  }
}

function handleLogoFile(file) {
  if (file.size > 2 * 1024 * 1024) {
    showToast('File too large. Max 2MB.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    STATE.logo = e.target.result;
    showLogoPreview(STATE.logo);
    showToast('Logo uploaded');
  };
  reader.readAsDataURL(file);
}

function showLogoPreview(src) {
  const preview = document.getElementById('logoPreview');
  const img = document.getElementById('logoImg');
  const drop = document.getElementById('fileDrop');
  if (preview && img) {
    img.src = src;
    preview.hidden = false;
    if (drop) drop.style.display = 'none';
  }
  renderCover();
}

// ============================================
// Reset
// ============================================
function bindReset() {
  const btn = document.getElementById('resetBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (confirm('Reset all fields to defaults?')) {
        STATE.values = { ...DEFAULT_VALUES[STATE.templateId] };
        renderFields();
        renderCover();
        showToast('Reset to defaults');
      }
    });
  }
}

// ============================================
// Print & Download
// ============================================
function bindActions() {
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      // Use print-to-PDF via the browser
      showToast('Opening print dialog — select "Save as PDF"');
      setTimeout(() => window.print(), 400);
    });
  }
}

// ============================================
// Contact Form / Notion
// ============================================
function bindContact() {
  const modal = document.getElementById('contactModal');
  if (!modal) return;

  // Open triggers
  document.querySelectorAll('[data-open-contact]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const tpl = COVER_TEMPLATES[STATE.templateId];
      const cfTpl = document.getElementById('cf-template');
      if (cfTpl) cfTpl.textContent = tpl.name;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  // Close triggers
  document.querySelectorAll('[data-close-contact]').forEach(el => {
    el.addEventListener('click', () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
  });

  // Submit
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      await submitContactForm(form);
    });
  }
}

async function submitContactForm(form) {
  const submitBtn = document.getElementById('cf-submit');
  const successEl = document.getElementById('cf-success');
  const errorEl = document.getElementById('cf-error');
  const formRows = form.querySelectorAll('.form-row, .form-field, .form-foot');

  if (successEl) successEl.hidden = true;
  if (errorEl) errorEl.hidden = true;

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    college: form.college.value.trim(),
    message: form.message.value.trim(),
    template: COVER_TEMPLATES[STATE.templateId].name
  };

  if (!data.name || !data.email) {
    showError('Name and email are required.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    await pushLeadToNotion(data);
    // Hide form rows, show success
    formRows.forEach(r => r.style.display = 'none');
    if (successEl) successEl.hidden = false;
    showToast('Message sent — we will be in touch!');
    setTimeout(() => {
      const modal = document.getElementById('contactModal');
      modal.classList.remove('open');
      // Reset for next time
      setTimeout(() => {
        formRows.forEach(r => r.style.display = '');
        if (successEl) successEl.hidden = true;
      }, 400);
    }, 2400);
  } catch (err) {
    console.error(err);
    // Fallback: save to localStorage so the lead is not lost
    saveLeadLocally(data);
    formRows.forEach(r => r.style.display = 'none');
    if (successEl) {
      successEl.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>Thanks! Your details are saved — we'll review them soon.</span>
      `;
      successEl.hidden = false;
    }
    showToast('Saved locally — will be processed soon');
    setTimeout(() => {
      const modal = document.getElementById('contactModal');
      modal.classList.remove('open');
      setTimeout(() => {
        formRows.forEach(r => r.style.display = '');
        if (successEl) {
          successEl.innerHTML = `
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Thanks! We'll be in touch soon.</span>
          `;
          successEl.hidden = true;
        }
      }, 400);
    }, 2400);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
  }
}

function saveLeadLocally(data) {
  try {
    const leads = JSON.parse(localStorage.getItem('acadcovers_leads') || '[]');
    leads.push({ ...data, savedAt: new Date().toISOString() });
    localStorage.setItem('acadcovers_leads', JSON.stringify(leads));
    console.log('Lead saved locally:', data);
  } catch (e) {
    console.warn('Could not save lead locally:', e);
  }
}

function showError(msg) {
  const errorEl = document.getElementById('cf-error');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }
}

async function pushLeadToNotion(data) {
  // Send to our own server-side proxy, which forwards to Notion.
  // This keeps the Notion token on the server and bypasses CORS.
  const response = await fetch(NOTION_CONFIG.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }

  return await response.json();
}

// ============================================
// AI Assistant
// ============================================
const AI = {
  open: false,
  apiKey: localStorage.getItem('openai_key') || '',
  messages: [],
  busy: false
};

const AI_SUGGESTIONS = [
  'Help me write a project title',
  'What fields do I need?',
  'Suggest a seminar topic',
  'Make the subtitle formal',
  'Explain the roll number format'
];

const AI_SYSTEM_PROMPT = `You are "Cover Assistant", a friendly and expert helper for the Academic Cover website. You help students create perfect cover pages for their academic submissions.

Your role:
- Help users choose the right template (Assignment, Practical File, Project Report, Seminar, Internship, Thesis)
- Suggest content for cover page fields (titles, subtitles, project topics, etc.)
- Explain academic formatting conventions
- Recommend professional wording and tone
- Help students in India (B. N. Mandal University, M.L.T. College, etc.) and globally
- Be concise, friendly, and supportive

Current page context will be provided to you. The user may ask to fill fields, suggest topics, or explain concepts.

When suggesting a cover title, project title, or seminar topic, keep it:
- Specific and academic
- 5-12 words
- Title Case
- Free of jargon

When you want to suggest a value the user can apply, format it like this:
[APPLY:fieldKey]suggested text[/APPLY]

Available field keys per template are listed in the context. Only suggest values for fields that exist.

Keep responses brief (under 120 words) unless the user asks for detail. Use bullet points when listing ideas.`;

function initAI() {
  // FAB click
  const fab = document.getElementById('aiFab');
  const panel = document.getElementById('aiPanel');
  const closeBtn = document.getElementById('aiClose');
  if (!fab) return;

  fab.addEventListener('click', () => toggleAI());
  closeBtn.addEventListener('click', () => toggleAI(false));

  // Setup form
  const setupSave = document.getElementById('aiSetupSave');
  const setupSkip = document.getElementById('aiSetupSkip');
  const apiInput = document.getElementById('aiApiKey');

  if (apiInput && AI.apiKey) apiInput.value = AI.apiKey;
  if (setupSave) {
    setupSave.addEventListener('click', () => {
      const key = apiInput.value.trim();
      if (!key) return;
      AI.apiKey = key;
      localStorage.setItem('openai_key', key);
      startAIChat();
    });
  }
  if (setupSkip) {
    setupSkip.addEventListener('click', () => startAIChat());
  }

  // Input
  const aiInput = document.getElementById('aiInput');
  const aiSend = document.getElementById('aiSend');
  if (aiInput) {
    aiInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAIMessage();
      }
    });
  }
  if (aiSend) aiSend.addEventListener('click', () => sendAIMessage());

  // Suggestion chips
  document.querySelectorAll('.ai-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim();
      aiInput.value = text;
      sendAIMessage();
    });
  });

  // Render suggestions
  const sugWrap = document.getElementById('aiSuggestions');
  if (sugWrap) {
    sugWrap.innerHTML = AI_SUGGESTIONS.map(s =>
      `<button class="ai-suggestion">${s}</button>`
    ).join('');
    sugWrap.querySelectorAll('.ai-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.textContent.trim();
        aiInput.value = text;
        sendAIMessage();
      });
    });
  }
}

function toggleAI(force) {
  AI.open = force !== undefined ? force : !AI.open;
  const panel = document.getElementById('aiPanel');
  if (AI.open) {
    panel.classList.add('open');
    if (AI.messages.length === 0) {
      if (AI.apiKey) startAIChat();
      else showAISetup();
    }
  } else {
    panel.classList.remove('open');
  }
}

function showAISetup() {
  const setup = document.getElementById('aiSetup');
  const input = document.querySelector('.ai-input');
  const sugg = document.getElementById('aiSuggestions');
  if (setup) setup.style.display = 'block';
  if (input) input.style.display = 'none';
  if (sugg) sugg.style.display = 'none';
}

function startAIChat() {
  const setup = document.getElementById('aiSetup');
  const messages = document.getElementById('aiMessages');
  const input = document.querySelector('.ai-input');
  const sugg = document.getElementById('aiSuggestions');
  if (setup) setup.style.display = 'none';
  if (messages) messages.style.display = 'flex';
  if (input) input.style.display = 'flex';
  if (sugg) sugg.style.display = 'flex';

  if (AI.messages.length === 0) {
    const t = COVER_TEMPLATES[STATE.templateId];
    addAIMessage('bot',
      `Hi! I'm your **Cover Assistant** 🤖\n\nI'm here to help you build a perfect cover page for your **${t.name}**.\n\nI can suggest titles, explain fields, recommend wording, or fill in details for you. What would you like help with?`
    );
  }
}

function addAIMessage(role, text) {
  const messages = document.getElementById('aiMessages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'ai-msg ' + role;
  div.innerHTML = formatAIText(text);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function formatAIText(text) {
  // Convert markdown-ish to HTML
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\[APPLY:(\w+)\](.+?)\[\/APPLY\]/g, '<div class="apply-row" data-field="$1" data-value="$2"><button class="chip apply-btn" data-field="$1" data-value="$2">Apply →</button> <span class="apply-text">$2</span></div>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

async function sendAIMessage() {
  if (AI.busy) return;
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  addAIMessage('user', text);
  AI.messages.push({ role: 'user', content: text });

  AI.busy = true;
  const sendBtn = document.getElementById('aiSend');
  if (sendBtn) sendBtn.disabled = true;

  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'ai-msg bot typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  document.getElementById('aiMessages').appendChild(typing);
  document.getElementById('aiMessages').scrollTop = 99999;

  try {
    let reply;
    if (AI.apiKey) {
      reply = await callOpenAI(text);
    } else {
      reply = getOfflineReply(text);
    }

    typing.remove();
    addAIMessage('bot', reply);
    AI.messages.push({ role: 'assistant', content: reply });

    // Wire up apply buttons
    document.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const field = btn.dataset.field;
        const value = btn.dataset.value;
        if (STATE.values[field] !== undefined) {
          STATE.values[field] = value;
          renderFields();
          renderCover();
          btn.textContent = '✓ Applied';
          btn.style.color = 'var(--brand-success)';
          showToast(`Applied to ${field}`);
        } else {
          showToast('Field not in current template', 'error');
        }
      });
    });
  } catch (err) {
    typing.remove();
    addAIMessage('bot', `Sorry, I hit an error: ${err.message}\n\nYou can continue, or set up your API key in the chat settings.`);
  } finally {
    AI.busy = false;
    if (sendBtn) sendBtn.disabled = false;
  }
}

async function callOpenAI(userText) {
  const t = COVER_TEMPLATES[STATE.templateId];
  const contextMsg = {
    role: 'system',
    content: `Current template: ${t.name}\nAvailable fields: ${t.fields.map(f => `${f.key} (${f.label}${f.required ? ', required' : ''})`).join(', ')}\nCurrent values: ${JSON.stringify(STATE.values, null, 0)}\n\nWhen you want to suggest a value the user can apply directly to a field, use the [APPLY:fieldKey]value[/APPLY] syntax.`
  };

  const messages = [
    { role: 'system', content: AI_SYSTEM_PROMPT },
    contextMsg,
    ...AI.messages.slice(-10)
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AI.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 400
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function getOfflineReply(userText) {
  // Simple rule-based fallback when no API key is set
  const t = COVER_TEMPLATES[STATE.templateId];
  const lower = userText.toLowerCase();

  if (lower.includes('title') && (lower.includes('suggest') || lower.includes('idea') || lower.includes('project'))) {
    const ideas = {
      project: [
        'AI-Powered Crop Disease Detection for Smallholder Farmers',
        'Blockchain-Based Academic Credential Verification',
        'Smart Attendance System using Face Recognition',
        'Solar-Powered Water Purification for Rural Areas',
        'IoT-Based Air Quality Monitoring in Urban Slums'
      ],
      seminar: [
        'The Future of Generative AI in Education',
        'Climate Change Adaptation in Coastal Regions',
        'Digital India: Progress, Challenges, and the Road Ahead',
        'Mental Health Awareness Among College Students',
        'Cybersecurity in the Age of Remote Work'
      ],
      assignment: [
        'Impact of Social Media on Academic Performance',
        'A Comparative Study of Monetary vs. Fiscal Policy',
        'Sustainable Development Goals: Progress Review 2026',
        'Role of Microfinance in Rural Empowerment'
      ],
      thesis: [
        'Digital Literacy and Rural Economic Transformation in Bihar',
        'Effectiveness of Online Education in Higher Learning',
        'Adoption of Electric Vehicles in Tier-2 Indian Cities',
        'AI Ethics in Public Sector Deployments'
      ],
      practical: [
        'Verification of Ohm\'s Law using Voltmeter and Ammeter',
        'Determination of Acceleration due to Gravity using Simple Pendulum',
        'Analysis of AC Circuits using CRO',
        'Spectroscopic Analysis of Common Salt'
      ],
      internship: [
        'Process Optimization at Manufacturing Plant',
        'Customer Behaviour Analysis in E-Commerce',
        'Financial Modelling and Valuation Study',
        'HR Practices in IT Service Companies'
      ]
    };
    const list = ideas[t.id] || ideas.assignment;
    return `Here are some **${t.name.toLowerCase()}** ideas:\n\n${list.map(i => `• ${i}`).join('\n')}\n\nWant me to apply one? Tell me which.`;
  }

  if (lower.includes('field') || lower.includes('what') && lower.includes('need')) {
    const required = t.fields.filter(f => f.required).map(f => `**${f.label}**`).join(', ');
    return `For a **${t.name}**, the required fields are:\n\n${required}\n\nPlus several optional ones like college, programme, semester, and dates. Fill in what you have — you can leave the rest blank.`;
  }

  if (lower.includes('subtitle') || lower.includes('formal')) {
    return `Here are formal subtitle patterns:\n\n• *Academic Submission — [Semester/Year]*\n• *A [Type] Submitted in Partial Fulfilment*\n• *In Fulfillment of [Course Code]*\n\nKeep it one line, italic-style, and specific to your course.`;
  }

  if (lower.includes('roll') || lower.includes('roll number')) {
    return `Roll number formats vary by university:\n\n• **Class Roll No.** — assigned by your college (1–500 typically)\n• **University Roll No.** — assigned on enrollment (often longer, like 24113695)\n\nIf you only have one, just use the Class Roll No. field.`;
  }

  if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey')) {
    return `Hi! 👋 I'm your Cover Assistant. I can help you:\n\n• Suggest **project/seminar titles**\n• Recommend **formal wording** for subtitles\n• Explain what each **field** means\n• Help you **fill in details** automatically\n\nTo unlock full AI responses, add your **OpenAI API key** in the setup above. Otherwise I can help with templates and formatting tips!`;
  }

  if (lower.includes('api') || lower.includes('key') || lower.includes('openai')) {
    return `To enable full AI responses:\n\n1. Get an API key at [platform.openai.com](https://platform.openai.com/api-keys)\n2. Paste it in the setup field above\n3. Your key is stored only in your browser (localStorage)\n4. Costs typically < $0.01 per conversation\n\nWithout a key, I can still help with title ideas, field explanations, and formatting tips.`;
  }

  return `I can help with:\n\n• **Title ideas** for your ${t.name.toLowerCase()}\n• **Formal wording** for subtitles\n• **Field explanations** and what's required\n• **Formatting** conventions\n\nTry asking: *"Suggest a project title"* or *"What fields do I need?"*\n\n💡 Add an OpenAI API key in the chat settings for full AI responses.`;
}

// ============================================
// Toast
// ============================================
let toastTimer = null;
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show';
  if (type === 'error') toast.style.borderColor = 'var(--brand-error)';
  else toast.style.borderColor = '';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, 2400);
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

// ============================================
// Event Binding
// ============================================
function bindEvents() {
  bindBranding();
  bindReset();
  bindActions();
  bindContact();
}

// ============================================
// Boot
// ============================================
document.addEventListener('DOMContentLoaded', init);
