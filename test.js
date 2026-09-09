// Playwright test for Academic Cover site
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('pageerror', e => errors.push('PAGE ERROR: ' + e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
  });
  page.on('requestfailed', req => {
    if (!req.url().includes('favicon')) {
      errors.push('REQ FAILED: ' + req.url() + ' - ' + req.failure().errorText);
    }
  });

  const filePath = 'http://localhost:3000/';
  console.log('Loading:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // 1. Hero loaded
  const heroH1 = await page.textContent('h1');
  console.log('✓ Hero H1:', heroH1);

  // 2. Templates loaded
  const tplCards = await page.$$('.template-card');
  console.log('✓ Template cards found:', tplCards.length);
  if (tplCards.length !== 6) errors.push('Expected 6 templates, got ' + tplCards.length);

  // 3. Theme cards
  const themeCards = await page.$$('.theme-card');
  console.log('✓ Theme cards found:', themeCards.length);
  if (themeCards.length !== 3) errors.push('Expected 3 themes, got ' + themeCards.length);

  // 4. Default preview rendered
  await page.waitForSelector('.page .cover-title');
  const previewTitle = await page.textContent('.page .cover-title');
  console.log('✓ Default preview title:', previewTitle);

  // 5. Field editor has inputs
  const fieldCount = await page.$$eval('.fields-grid .field', els => els.length);
  console.log('✓ Field inputs:', fieldCount);
  if (fieldCount < 8) errors.push('Expected more fields, got ' + fieldCount);

  // 6. Switch to Project template
  await page.click('.template-card[data-template="project"]');
  await page.waitForTimeout(400);
  const projectTitle = await page.textContent('.page .cover-title');
  console.log('✓ Project preview title:', projectTitle);
  if (!projectTitle.includes('AI-Powered')) errors.push('Project template did not render defaults');

  // 7. Switch theme to Forest
  await page.click('.theme-card[data-theme="forest"]');
  await page.waitForTimeout(300);
  const bgColor = await page.$eval('.page', el => getComputedStyle(el).backgroundColor);
  console.log('✓ Forest theme bg:', bgColor);

  // 8. Edit a field and check live update
  const inputs = await page.$$('.fields-grid input');
  if (inputs.length > 0) {
    await inputs[0].fill('Test University 2026');
    await page.waitForTimeout(200);
    const univ = await page.textContent('.page .cover-header .univ');
    console.log('✓ Live update — univ:', univ);
    if (univ !== 'Test University 2026') errors.push('Field edit did not update preview');
  }

  // 9. AI Assistant — open and check
  await page.click('#aiFab');
  await page.waitForTimeout(500);
  const aiOpen = await page.isVisible('.ai-panel.open');
  console.log('✓ AI Panel open:', aiOpen);
  if (!aiOpen) errors.push('AI Panel did not open');

  // Skip API key setup
  const skipBtn = await page.$('#aiSetupSkip');
  if (skipBtn) {
    await skipBtn.click();
    await page.waitForTimeout(400);
  }
  const aiBotMsg = await page.textContent('.ai-msg.bot');
  console.log('✓ AI initial message length:', aiBotMsg.length);
  if (aiBotMsg.length < 30) errors.push('AI greeting too short');

  // Type a question
  await page.fill('#aiInput', 'Suggest a project title');
  await page.click('#aiSend');
  await page.waitForTimeout(800);
  const aiReply = await page.textContent('.ai-messages .ai-msg.bot:nth-last-child(1)');
  console.log('✓ AI reply length:', aiReply.length);
  if (aiReply.length < 30) errors.push('AI reply too short');

  // 10. Open contact modal
  await page.click('#aiClose'); // close AI
  await page.waitForTimeout(200);
  await page.click('[data-open-contact]');
  await page.waitForTimeout(400);
  const modalOpen = await page.isVisible('.modal.open');
  console.log('✓ Contact modal open:', modalOpen);
  if (!modalOpen) errors.push('Contact modal did not open');

  // 10b. Submit contact form (real Notion call)
  await page.fill('#cf-name', 'Playwright Test User');
  await page.fill('#cf-email', 'playwright@test.example');
  await page.fill('#cf-phone', '+91 9999999999');
  await page.fill('#cf-college', 'B. N. Mandal University');
  await page.fill('#cf-message', 'Automated test lead from Playwright');

  // Listen for the network response
  const responsePromise = page.waitForResponse(r => r.url().includes('/api/lead'), { timeout: 10000 });
  await page.click('#cf-submit');
  const apiResponse = await responsePromise;
  const apiStatus = apiResponse.status();
  const apiBody = await apiResponse.json().catch(() => ({}));
  console.log('✓ /api/lead responded with status:', apiStatus, 'body:', JSON.stringify(apiBody).slice(0, 100));
  if (apiStatus !== 200) errors.push(`API returned status ${apiStatus}: ${apiBody.error || 'unknown'}`);

  // Check success state
  await page.waitForTimeout(500);
  const successVisible = await page.isVisible('.form-success:not([hidden])');
  console.log('✓ Contact form submitted to Notion:', successVisible);
  if (!successVisible) errors.push('Contact form Notion submission failed');

  // Take screenshot of the success state
  await page.screenshot({ path: 'test/success-state.png', fullPage: false });

  // 10c. Wait for modal auto-close
  await page.waitForTimeout(2700);
  const modalClosed = !(await page.isVisible('.modal.open'));
  console.log('✓ Modal auto-closed after success:', modalClosed);

  // 11. Test mobile responsive
  await page.setViewportSize({ width: 375, height: 800 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test/mobile.png', fullPage: false });
  console.log('✓ Mobile screenshot saved');

  // Reset to desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'test/desktop.png', fullPage: true });
  console.log('✓ Desktop screenshot saved');

  // Final report
  console.log('\n=== TEST SUMMARY ===');
  if (errors.length === 0) {
    console.log('✅ ALL TESTS PASSED');
  } else {
    console.log('❌ ERRORS FOUND:');
    errors.forEach(e => console.log('  - ' + e));
    process.exit(1);
  }

  await browser.close();
})().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
