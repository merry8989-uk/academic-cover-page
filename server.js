// Academic Cover — Node.js Server
// Serves the static site + Notion API proxy (bypasses browser CORS)

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Notion config
const NOTION_TOKEN = 'ntn_Mw9891338193Go7qai14fnMxwYpmN6jDFLb0jrNj01u0GZ';
const NOTION_DB_ID = '21fc6d2f-9c1d-46d3-88c8-2809f135e474';
const NOTION_VERSION = '2022-06-28';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Notion lead capture endpoint
app.post('/api/lead', async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const properties = {
      'Name': { title: [{ text: { content: data.name } }] },
      'Email': { email: data.email }
    };
    if (data.phone) properties['Phone'] = { phone_number: data.phone };
    if (data.college) properties['College'] = { rich_text: [{ text: { content: data.college } }] };
    if (data.message) properties['Message'] = { rich_text: [{ text: { content: data.message } }] };
    if (data.template) properties['Template Used'] = { select: { name: data.template } };

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DB_ID },
        properties
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.message || 'Notion API error' });
    }

    const result = await response.json();
    res.json({ success: true, id: result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Academic Cover running on port ${PORT}`);
});
