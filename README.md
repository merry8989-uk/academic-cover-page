# Academic Cover — AI-Powered Cover Page Generator

A free, modern web app that lets students create professional cover pages for academic submissions. Now with **6 cover templates**, an **AI Cover Assistant**, and **automatic lead capture to Notion**.

🌐 **Live site**: https://f3r9bpynl5d1.space.mcode.io

---

## ✨ Features

### 📄 6 Cover Templates
- **Assignment Cover** — Standard academic assignment
- **Practical File** — Lab manual / experiment records
- **Project Report** — Final year project submission
- **Seminar** — Paper presentation cover
- **Internship Report** — Industry training reports
- **Thesis / Dissertation** — Research submissions

### 🎨 3 Premium Themes
- Navy & Gold
- Forest & Copper
- Charcoal & Sage

### 🤖 AI Cover Assistant
- Built-in chat assistant on every page
- Suggests project titles, seminar topics, formal wording
- Explains academic fields and conventions
- **OpenAI integration** — bring your own API key for personalized AI
- **Works offline** with rule-based fallbacks when no key is set
- One-click "Apply" — suggestions fill form fields directly

### 📥 Notion Lead Capture
- "Get in touch" form on every page
- Auto-creates leads in your Notion database
- Captures: Name, Email, Phone, College, Template Used, Message

### 🖨️ Print-Ready Output
- A4 page size
- Print-to-PDF via the browser
- Live preview with all theme & template changes

---

## 📂 Project Structure

```
acadcovers/
├── public/                  # Static site (deployed to manus.space)
│   ├── index.html
│   └── assets/
│       ├── templates.js     # 6 cover templates + 3 themes + defaults
│       ├── render.js        # Cover page rendering engine
│       ├── app.js           # UI logic, AI, Notion, print
│       └── styles.css       # All styling
├── server.js                # Optional Express server (dev + Notion proxy)
├── proxy/
│   └── Code.gs              # Google Apps Script — free Notion CORS proxy
├── package.json
└── dist/                    # Built static site (created by `npm run build`)
```

---

## 🚀 Quick Start

### Local development
```bash
cd /workspace/acadcovers
npm install
npm run dev          # Starts Express server on http://localhost:3000
```

### Production build
```bash
npm run build        # Builds static site to ./dist
```
Deploy the contents of `./dist` to any static host (Vercel, Netlify, GitHub Pages, manus.space, etc.).

---

## 🔌 Notion Lead Capture — Setup

The static site can't call Notion directly due to CORS. Use the included free Google Apps Script proxy:

### Step 1: Deploy the proxy
1. Go to [script.google.com](https://script.google.com) → **New Project**
2. Delete the default `Code.gs` content
3. Paste the content of `proxy/Code.gs` from this repo
4. Click **💾 Save** (Ctrl+S)
5. Click **🚀 Deploy** → **New deployment**
6. Settings:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy** → copy the **Web App URL**
   (Looks like: `https://script.google.com/macros/s/AKfycb.../exec`)

### Step 2: Wire it into the site
Open `public/assets/app.js` and replace:
```js
const NOTION_CONFIG = {
  apiEndpoint: '/api/lead'   // ← Replace this
};
```
with:
```js
const NOTION_CONFIG = {
  apiEndpoint: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'
};
```

Then rebuild and redeploy:
```bash
npm run build
# upload ./dist to your static host
```

✅ That's it — every form submission will land in your Notion database!

### Already-running Express server
If you have your own backend, you can host `server.js` instead — it already has a working `/api/lead` endpoint that proxies to Notion.

---

## 🤖 AI Assistant — Setup

The AI assistant is **context-aware** and works out-of-the-box with pre-written responses for:
- Title suggestions (per template type)
- Field explanations
- Formal wording recommendations
- Academic formatting tips

To unlock **full GPT-powered responses**:

1. Get an API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click the **AI Assistant** button (bottom-right)
3. Paste your key in the setup form → **Save & start**
4. Your key is stored only in `localStorage` of your browser

Cost is typically < $0.01 per conversation with `gpt-4o-mini`.

---

## 🛠 Customization

### Add a new template
Open `public/assets/templates.js` and add an entry to `COVER_TEMPLATES`:
```js
const COVER_TEMPLATES = {
  // ... existing templates ...
  mytemplate: {
    id: 'mytemplate',
    name: 'My Template',
    icon: 'document',
    description: 'My new cover',
    fields: [
      { key: 'university', label: 'University', type: 'text' },
      // ... more fields
    ],
    sections: [
      { type: 'header', items: ['university', 'college'] },
      { type: 'title', items: ['coverTitle'] },
      // ... more sections
    ]
  }
};
```
Then add a default entry in `DEFAULT_VALUES.mytemplate`.

### Add a new theme
Add to `COVER_THEMES` in `templates.js`:
```js
const COVER_THEMES = {
  // ... existing themes ...
  ocean: {
    id: 'ocean',
    name: 'Ocean & Silver',
    colors: {
      bg: '#0a1929',
      surface: '#102a43',
      border: '#243b55',
      primary: '#90caf9',
      accent: '#e3f2fd',
      text: '#ffffff',
      textMuted: '#b0bec5',
      textSubtle: '#78909c',
      divider: '#243b55',
      number: '#90caf9'
    }
  }
};
```

---

## 🔒 Security Note

The Notion API token is currently hard-coded for development convenience. For production:
- Use the Google Apps Script proxy (token stays on Google's servers)
- OR use environment variables on your backend
- OR use a Notion integration scoped to one database only

---

## 📜 License

Free for educational and personal use.

---

**Built for students, by people who remember what it was like to make 5 cover pages a semester.**
