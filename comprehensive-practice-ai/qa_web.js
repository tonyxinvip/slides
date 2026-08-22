/* 逐页检查网页版：页面与每个可见含字子元素的滚动尺寸，并保存截图。 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = __dirname;
const outRoot = path.resolve(process.argv[2] || 'output/playwright');
const cached = path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium_headless_shell-1234', 'chrome-headless-shell-mac-x64', 'chrome-headless-shell');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (fs.existsSync(cached) ? cached : chromium.executablePath());

(async () => {
  fs.mkdirSync(outRoot, { recursive:true });
  const browser = await chromium.launch({ headless:true, executablePath });
  const page = await browser.newPage({ viewport:{ width:1280, height:720 }, deviceScaleFactor:1 });
  const report = [];
  for (const mode of [{ name:'90', query:'' }, { name:'60', query:'?duration=60' }]) {
    const dir = path.join(outRoot, mode.name);
    fs.mkdirSync(dir, { recursive:true });
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href + mode.query + '#1', { waitUntil:'load' });
    const count = await page.locator('.slide').count();
    for (let i = 1; i <= count; i++) {
      const issues = await page.locator('.slide.is-active').evaluate(slide => {
        const bad = [];
        const nodes = [slide, ...slide.querySelectorAll('*')];
        const slideRect = slide.getBoundingClientRect();
        for (const el of nodes) {
          const st = getComputedStyle(el);
          if (st.display === 'none' || st.visibility === 'hidden' || !el.getClientRects().length) continue;
          if (el !== slide && !el.textContent.trim()) continue;
          const x = el.scrollWidth - el.clientWidth;
          const y = el.scrollHeight - el.clientHeight;
          const clippedX = x > 1 && /(hidden|clip|auto|scroll)/.test(st.overflowX);
          const clippedY = y > 1 && /(hidden|clip|auto|scroll)/.test(st.overflowY);
          const rect = el.getBoundingClientRect();
          const outside = rect.left < slideRect.left - 1 || rect.top < slideRect.top - 1 || rect.right > slideRect.right + 1 || rect.bottom > slideRect.bottom + 1;
          if (clippedX || clippedY || outside) bad.push({ tag:el.tagName, cls:el.className || '', x, y, outside, text:el.textContent.trim().slice(0, 60) });
        }
        return bad;
      });
      if (issues.length) report.push({ mode:mode.name, page:i, issues });
      await page.screenshot({ path:path.join(dir, String(i).padStart(3, '0') + '.png') });
      if (i < count) await page.keyboard.press('ArrowRight');
    }
    console.log(mode.name + ' 分钟材料：' + count + ' 页');
  }
  await browser.close();
  fs.writeFileSync(path.join(outRoot, 'report.json'), JSON.stringify(report, null, 2));
  console.log('溢出项：' + report.length + ' 页');
  if (report.length) process.exitCode = 2;
})().catch(error => { console.error(error); process.exit(1); });
