// Academic Cover — Notion Lead Capture Proxy
// ===========================================
// This Google Apps Script acts as a CORS-enabled proxy between your static
// site and the Notion API. Free to deploy, runs on Google's infrastructure.
//
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com → "New Project"
// 2. Replace all the code in Code.gs with this file's content
// 3. Save (Ctrl+S)
// 4. Click "Deploy" → "New deployment"
// 5. Type: "Web app"
// 6. Execute as: "Me"
// 7. Who has access: "Anyone"
// 8. Click "Deploy" → copy the Web App URL
// 9. In your site's index.html, replace the value of NOTION_CONFIG.apiEndpoint
//    with the Web App URL
//
// That's it! Submissions from your site will now reach Notion.

const NOTION_TOKEN = 'ntn_Mw9891338193Go7qai14fnMxwYpmN6jDFLb0jrNj01u0GZ';
const NOTION_DB_ID = '21fc6d2f-9c1d-46d3-88c8-2809f135e474';
const NOTION_VERSION = '2022-06-28';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (!data.name || !data.email) {
      return jsonResponse({ error: 'Name and email are required.' }, 400);
    }

    const properties = {
      'Name': { title: [{ text: { content: data.name } }] },
      'Email': { email: data.email }
    };
    if (data.phone) properties['Phone'] = { phone_number: data.phone };
    if (data.college) properties['College'] = { rich_text: [{ text: { content: data.college } }] };
    if (data.message) properties['Message'] = { rich_text: [{ text: { content: data.message } }] };
    if (data.template) properties['Template Used'] = { select: { name: data.template } };

    const response = UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + NOTION_TOKEN,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        parent: { database_id: NOTION_DB_ID },
        properties
      }),
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();
    if (code >= 200 && code < 300) {
      return jsonResponse({ success: true, id: JSON.parse(response.getContentText()).id });
    } else {
      const err = JSON.parse(response.getContentText());
      return jsonResponse({ error: err.message || 'Notion API error' }, code);
    }
  } catch (err) {
    return jsonResponse({ error: err.message || 'Unknown error' }, 500);
  }
}

function doGet(e) {
  return jsonResponse({ status: 'ok', message: 'Academic Cover Notion proxy is running.' });
}

function jsonResponse(body, code) {
  const output = ContentService.createTextOutput(JSON.stringify(body));
  output.setMimeType(ContentService.MimeType.JSON);
  if (code) {
    return output; // Apps Script web apps don't support custom status codes
  }
  return output;
}
