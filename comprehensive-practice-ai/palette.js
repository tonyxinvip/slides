/* 配色唯一真源。styles.css 的 :root、figures.js、build_pptx.js 三处都从这里来。
 * 取自 CocoRobo 视觉口径（官网 cocorobo.cn/smart、/tutor 的实际 CSS token），
 * 两处按实测对比度另作了调整，见下面注释。
 * 改色只改本文件，然后跑：node palette.js（重写 styles.css 的 :root）→ node build_pptx.js
 * 对比度与色差核验：node check_colors.js */
const P = {
  /* ── 直接取自品牌 ── */
  navy:  '#081B3A',  // 品牌 --navy   大标题、书脊            16.34:1
  ink:   '#27364A',  // 品牌 --text   正文                    11.72:1
  muted: '#5F7088',  // 品牌 --muted  次要、页脚、图注          4.83:1（品牌注明勿再调浅、勿写正文）
  line:  '#D9E2EF',  // 品牌 --line   分隔线，仅装饰
  line2: '#BFD3EA',  // 品牌 --line2  卡片描边
  paper: '#F7FAFF',  // 品牌 --bg     页底
  white: '#FFFFFF',  // 品牌 --panel  卡片
  soft:  '#EEF6FF',  // 品牌 --soft   冷色浅底
  sky:   '#DBEAFE',  // 品牌 --sky    更浅冷底

  /* ── 品牌色按对比度实测拆成「承字」与「图形」两用 ──
     品牌 --rust #C2552F 在页底 #F7FAFF 上只有 4.33:1，不到 4.5，不能写小字；
     品牌 --blue #2563EB 是 4.94:1，勉强过线，小字用更深的 blue2 更稳。 */
  rust:  '#A8421F',  // 品牌 --rust2  警示，承载小字            5.79:1
  rustf: '#C2552F',  // 品牌 --rust   警示，图形件与描边
  slate: '#1D4ED8',  // 品牌 --blue2  结构，承载小字            6.41:1
  blue:  '#2563EB',  // 品牌 --blue   结构，图形件与描边

  /* ── 收放程度的顺序色阶，由品牌 rust 推导 ──
     亮度单调，相邻 ΔE 18.2 与 30.5，深色两档可承白字 */
  sev3:   '#7A2C10',  // 收
  sev2:   '#C2552F',  // 中（即品牌 rust）
  sev1:   '#F0CBBB',  // 放
  sev1ln: '#DFB09C',  // sev1 的描边
  wash:   '#FCF2EC',  // 警示色的极浅底

  /* ── 派生 ── */
  done:  '#BFD3EA',  // 书脊已过段落
  dim:   '#8FA3BE',  // 档位标记等最弱文字
  tint1: '#DBEAFE',  // 指令第 ① 段底色（即品牌 sky）
  tint3: '#F2C9B4',  // 指令第 ③ 段底色（与 tint1 的 ΔE 要够，见 check_colors.js）
  tint2: '#9FB6D4'   // 指令第 ② 段下划线
};

const CSS_ORDER = [
  ['navy', '大标题、书脊'], ['ink', '正文'], ['muted', '次要'], ['line', '分隔线'],
  ['line2', '卡片描边'], ['paper', '页底'], ['white', '卡片'], ['soft', '冷色浅底'],
  ['sky', '更浅冷底'], ['rust', '警示，承字'], ['rustf', '警示，图形'],
  ['slate', '结构，承字'], ['blue', '结构，图形'],
  ['sev3', '收'], ['sev2', '中'], ['sev1', '放'], ['sev1ln', 'sev1 描边'],
  ['wash', '警示极浅底'], ['done', '书脊已过'], ['dim', '最弱文字'],
  ['tint1', '指令①底'], ['tint3', '指令③底'], ['tint2', '指令②下划线']
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = P;
  if (require.main === module) {
    const fs = require('fs'), path = require('path');
    const w = Math.max.apply(null, CSS_ORDER.map(x => x[0].length));
    const body = CSS_ORDER.map(([k, note]) =>
      '  --' + k + ':' + P[k] + ';' + ' '.repeat(w - k.length + 1) + '/* ' + note + ' */').join('\n');
    const block = '/* 由 palette.js 生成，勿手改。改色改 palette.js 后重跑 node palette.js */\n' +
      ':root{\n' + body + '\n\n' +
      "  --serif:\"Noto Serif SC\",\"Songti SC\",\"STSong\",serif;\n" +
      "  --sans:\"Inter\",\"Noto Sans SC\",\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif;\n}";
    const p = path.join(__dirname, 'styles.css');
    let css = fs.readFileSync(p, 'utf8');
    const re = /\/\* gen:palette \*\/[\s\S]*?\/\* \/gen:palette \*\//;
    if (!re.test(css)) throw new Error('styles.css 里没有 gen:palette 标记');
    css = css.replace(re, '/* gen:palette */\n' + block + '\n/* /gen:palette */');
    fs.writeFileSync(p, css);
    console.log('styles.css 的 :root 已重写，共 ' + CSS_ORDER.length + ' 个色值');
  }
} else {
  (typeof globalThis !== 'undefined' ? globalThis : this).DECK_PALETTE = P;
}
