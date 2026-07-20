const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('Navigating...');
  await page.goto('https://github.com/ayush-tech3/Stellar-Carbon-Credit-Registry/actions/runs/29696717421/job/88218624517', { waitUntil: 'networkidle2' });
  
  console.log('Waiting for logs...');
  await new Promise(r => setTimeout(r, 5000));
  
  const text = await page.evaluate(() => {
      // Find elements containing error logs or just return body text
      return document.body.innerText;
  });
  
  console.log(text.substring(Math.max(0, text.length - 15000)));
  
  await browser.close();
})();
