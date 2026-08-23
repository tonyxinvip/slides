/* 手机交互回归：滑动、可见导航、全屏入口与竖屏避让。 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = __dirname;
const cached = path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium_headless_shell-1234', 'chrome-headless-shell-mac-x64', 'chrome-headless-shell');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (fs.existsSync(cached) ? cached : chromium.executablePath());

(async () => {
  const browser = await chromium.launch({ headless:true, executablePath });
  const context = await browser.newContext({
    viewport:{ width:390, height:844 },
    deviceScaleFactor:1,
    isMobile:true,
    hasTouch:true
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(path.join(root, 'index.html')).href + '#1', { waitUntil:'load' });
  await page.waitForTimeout(250);
  const cdp = await context.newCDPSession(page);
  const issues = [];
  const hud = () => page.locator('#hud').textContent();

  const controls = page.locator('#mobile-controls button');
  if (await controls.count() !== 3) issues.push('手机端应有上一页、全屏、下一页三个按钮');
  if (!await page.locator('#mobile-hint').isVisible().catch(() => false)) issues.push('首次进入时应显示手机操作提示');

  async function swipe(fromX, fromY, toX, toY) {
    await cdp.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[{ x:fromX, y:fromY, radiusX:4, radiusY:4, force:1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[{ x:toX, y:toY, radiusX:4, radiusY:4, force:1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
    await page.waitForTimeout(160);
  }

  const first = await hud();
  await swipe(330, 420, 70, 420);
  const afterNextSwipe = await hud();
  if (!/^02 \/ 71/.test(afterNextSwipe)) issues.push('向左滑动应且只应进入下一页，实际为：' + afterNextSwipe);
  await swipe(70, 420, 330, 420);
  const afterPrevSwipe = await hud();
  if (afterPrevSwipe !== first) issues.push('向右滑动没有返回上一页，实际为：' + afterPrevSwipe);
  await swipe(195, 610, 195, 250);
  const afterVerticalSwipe = await hud();
  if (afterVerticalSwipe !== first) issues.push('纵向手势不应触发翻页，实际为：' + afterVerticalSwipe);

  const next = page.locator('#mobile-next');
  const prev = page.locator('#mobile-prev');
  if (await next.count()) {
    await next.tap();
    await page.waitForTimeout(100);
    if (await hud() === first) issues.push('下一页按钮没有翻页');
  }
  if (await prev.count()) {
    await prev.tap();
    await page.waitForTimeout(100);
    if (await hud() !== first) issues.push('上一页按钮没有翻页');
  }

  const fullscreen = page.locator('#mobile-fullscreen');
  if (await fullscreen.count()) {
    await page.evaluate(() => {
      window.__fullscreenCalls = 0;
      Object.defineProperty(document.documentElement, 'requestFullscreen', {
        configurable:true,
        value:function () { window.__fullscreenCalls += 1; return Promise.resolve(); }
      });
    });
    await fullscreen.tap();
    await page.waitForTimeout(100);
    if (await page.evaluate(() => window.__fullscreenCalls) !== 1) issues.push('全屏按钮没有在用户操作中调用全屏 API');
  }

  if (await page.locator('#mobile-controls').count()) {
    const geometry = await page.evaluate(() => {
      const slide = document.querySelector('.slide.is-active').getBoundingClientRect();
      const controls = document.querySelector('#mobile-controls').getBoundingClientRect();
      return { slideBottom:slide.bottom, controlsTop:controls.top, pageWidth:document.documentElement.scrollWidth, viewportWidth:innerWidth };
    });
    if (geometry.controlsTop < geometry.slideBottom - 1) issues.push('竖屏导航控件覆盖幻灯片内容');
    if (geometry.pageWidth > geometry.viewportWidth + 1) issues.push('手机页面出现水平溢出');
  }

  await page.setViewportSize({ width:844, height:390 });
  await page.waitForTimeout(250);
  const landscape = await page.evaluate(() => {
    const slide = document.querySelector('.slide.is-active').getBoundingClientRect();
    const controls = document.querySelector('#mobile-controls').getBoundingClientRect();
    return {
      slideRight:slide.right,
      controlsLeft:controls.left,
      controlsRight:controls.right,
      controlsBottom:controls.bottom,
      viewportWidth:innerWidth,
      viewportHeight:innerHeight,
      direction:getComputedStyle(document.querySelector('#mobile-controls')).flexDirection
    };
  });
  if (landscape.direction !== 'column') issues.push('横屏导航应移到侧边纵向排列');
  if (landscape.controlsLeft < landscape.slideRight + 6) issues.push('横屏导航控件覆盖幻灯片内容');
  if (landscape.controlsRight > landscape.viewportWidth + 1 || landscape.controlsBottom > landscape.viewportHeight + 1) {
    issues.push('横屏导航控件超出可视区域');
  }
  await swipe(620, 195, 260, 195);
  if (!/^02 \/ 71/.test(await hud())) issues.push('横屏向左滑动没有进入下一页');

  await browser.close();
  console.log(issues.length ? issues.join('\n') : '手机交互检查通过');
  if (issues.length) process.exitCode = 2;
})().catch(error => { console.error(error); process.exit(1); });
