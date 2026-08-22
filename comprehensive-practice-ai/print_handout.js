/* 用 Chromium 将 build_handout.js 生成的 HTML 打印为 PDF。需要 NODE_PATH 能找到 playwright。 */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const input = path.resolve(process.argv[2] || '教师讲义.html');
const output = path.resolve(process.argv[3] || '做中学与综合实践活动-教师讲义.pdf');

(async () => {
  const cached = path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium_headless_shell-1234', 'chrome-headless-shell-mac-x64', 'chrome-headless-shell');
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (fs.existsSync(cached) ? cached : chromium.executablePath());
  const browser = await chromium.launch({ headless:true, executablePath });
  const page = await browser.newPage({ viewport:{ width:1280, height:900 }, deviceScaleFactor:1 });
  await page.goto(pathToFileURL(input).href, { waitUntil:'load' });
  await page.emulateMedia({ media:'print' });
  await page.pdf({ path:output, format:'A4', printBackground:true, preferCSSPageSize:true, margin:{ top:'0', right:'0', bottom:'0', left:'0' } });
  await browser.close();
  console.log('已生成', output);
})().catch(error => { console.error(error); process.exit(1); });
