const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('Navigating to job...');
  await page.goto('https://github.com/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/runs/29696717421/job/88218624517');
  
  console.log('Waiting for log-line...');
  try {
      await page.waitForSelector('.log-line', { timeout: 15000 });
      const text = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.log-line')).map(e => e.innerText).join('\n');
      });
      console.log('LOGS:');
      console.log(text.substring(Math.max(0, text.length - 10000)));
  } catch (e) {
      console.log('Error finding log-line:', e);
      // fallback
      const body = await page.evaluate(() => document.body.innerText);
      console.log('BODY:', body.substring(0, 2000));
  }
  
  await browser.close();
})();
