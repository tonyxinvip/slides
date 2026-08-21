/* 从 slides.data.js 重写 OUTLINE.md 中的生成段落，避免页码与页数走样。
 * 生成区间由 <!-- gen:名字 --> ... <!-- /gen:名字 --> 标记。
 * 用法：node gen_outline.js */
const fs = require('fs');
const path = require('path');
const SLIDES = require('./slides.data.js');

/* 各段时长是编排判断，写在这里，不从数据推。讲的部分合计须为 90；附录不讲，记 0。 */
const MINUTES = { '开场':8, '第一段':10, '第二段':8, '第三段':16, '第四段':12, '第五段':20,
                  '第六段':10, '第七段':6, '附录':0 };
const SECTITLE = {
  '开场':'领航行动指南与本课程的关系',
  '第一段':'做中学对综合实践活动的覆盖范围',
  '第二段':'成果可替代性与教师的专业位置',
  '第三段':'既有问题与生成式 AI 的作用方向',
  '第四段':'环节配置的判断方法',
  '第五段':'生命健康主题的双学段案例',
  '第六段':'过程证据、评价与使用红线',
  '第七段':'工具定位与实施建议',
  '附录':'六个主题各一份案例'
};
const NUM = { '开场':'开场', '第一段':'一', '第二段':'二', '第三段':'三',
              '第四段':'四', '第五段':'五', '第六段':'六', '第七段':'七', '附录':'附录' };

/* 每种版式在屏幕上的主要视觉元素 */
const SCREEN = {
  cover:'封面：标题、六个环节链、主讲信息',
  factfile:'文件名与文号、印发单位、日期三卡',
  quotecards:'条款引文＋六个环节分解卡',
  fourfour:'两组四项并列',
  coverage:'覆盖关系嵌套图（SVG）',
  statement:'整屏一句',
  bars:'冲击强度条形图（SVG）',
  overlay:'两集合相交图（SVG）',
  bridge:'编号要点三条',
  problems:'六条问题卡',
  evidence:'实证研究卡',
  tri:'三分表（全场第一张表）',
  threebad:'三张卡片',
  counter:'反向证据卡＋边界条件',
  uses:'四项用途卡，各含做法与产出',
  specs:'三条指令原文，三段结构以底色分界，附图例',
  threeq:'三问竖排，第 28 页每问另附后续动作',
  blankgrid:'六环节空白网格，可打印',
  shape:'收放刻度图（SVG）',
  allow:'三种用法卡，各含动作、约束与留痕',
  twotasks:'两张任务卡并置',
  stage:'左右分栏＋收放标签＋六环节迷你刻度＋额外落点',
  exchange:'三段交互，AI 返回逐条编号并标出采纳与否',
  twoscales:'两案例卡',
  tracktable:'四栏留痕表',
  chainflow:'证据链条图（SVG）',
  redlines:'四条红线＋边界说明',
  signature:'评价主体与责任二分',
  agentspec:'智能体示意图（SVG）＋可照抄的指令块',
  toolpos:'工具位置表（全场第二张表）',
  threedo:'三项动作，按周排布',
  endnote:'出处说明＋署名＋讲义占位',
  apxcover:'六项案例的目录，含页码与学段',
  apxtask:'任务要求与实施建议的附件原文',
  apxflow:'六个环节的收放配置表，含收放徽章',
  apxrule:'三条约束＋留痕＋可照抄的指令块'
};

/* 图示：从 app.js 的渲染器里读出哪个版式调用了哪张图，再映射到页码 */
const FIGNAME = { coverage:'覆盖关系嵌套图', impact:'四种活动方式的 AI 冲击强度条形图',
                  overlap:'覆盖缺口与冲击强度的叠合图', scale:'六环节收放刻度条', chain:'证据链条图',
                  agent:'智能体示意图：一段指令 × 每次提问', stepbar:'环节位置的迷你刻度' };
function figures() {
  const src = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  const body = src.slice(src.indexOf('  var R = {'));
  const hits = [];
  const re = /^\s{4}([a-z]+):[\s\S]*?(?=^\s{4}[a-z]+:|^\s{2}\};)/gm;
  let m;
  while ((m = re.exec(body))) {
    const layout = m[1], chunk = m[0];
    const f = /FIG\.([a-z]+)/.exec(chunk);
    if (f) hits.push({ layout, fig: f[1] });
  }
  return hits.map(h => {
    const pages = SLIDES.filter(s => s.layout === h.layout).map(s => String(s.n).padStart(2, '0'));
    return '- ' + FIGNAME[h.fig] + '（' + pages.join('、') + '），`figures.js` 里的 `' + h.fig + '`';
  });
}

const first = t => (String(t).split('。')[0] || '') + '。';
const secs = Object.keys(MINUTES);
const bySec = s => SLIDES.filter(x => x.sec === s);
const tiers = t => SLIDES.filter(x => x.tier === t);
const mins = secs.reduce((a, s) => a + MINUTES[s], 0);
const spoken = SLIDES.filter(x => x.tier !== '附').length;

const BLOCKS = {
  meta: [
    '版本：90 分钟版，正文 ' + spoken + ' 页，另附录 ' + tiers('附').length + ' 页（不讲），共 ' +
      SLIDES.length + ' 页。每页标注删减档位，砍到 60 分钟时按档位删。'
  ].join('\n'),

  tiers: [
    '- A 档：60 分钟版保留。共 ' + tiers('A').length + ' 页。',
    '- B 档：90 分钟专属，压缩时先删。共 ' + tiers('B').length + ' 页。（' +
      tiers('B').map(x => x.n).join('、') + '）',
    '- 附录：不讲，供听众会后带走。共 ' + tiers('附').length + ' 页。（' +
      tiers('附')[0].n + '—' + tiers('附')[tiers('附').length - 1].n + '）'
  ].join('\n'),

  minutes: [
    '| 段 | 时长 | 页数 | 标题 |',
    '| --- | --- | --- | --- |'
  ].concat(secs.map(s =>
    '| ' + NUM[s] + ' | ' + (MINUTES[s] ? MINUTES[s] + ' 分钟' : '不讲') + ' | ' +
    bySec(s).length + ' | ' + SECTITLE[s] + ' |'
  )).concat(['| 合计 | ' + mins + ' 分钟 | ' + SLIDES.length + ' | 其中附录 ' +
    bySec('附录').length + ' 页不计入时长 |']).join('\n'),

  pages: secs.map(s => {
    const rows = bySec(s).map(d =>
      '| ' + String(d.n).padStart(2, '0') + ' | ' + d.tier + ' | ' +
      (d.title || (d.layout === 'endnote' ? '（末页）' : '（整屏句）')) + ' | ' +
      (SCREEN[d.layout] || '？未登记版式 ' + d.layout) + ' | ' + first(d.notes) + ' |');
    return ['### ' + s + '（' + (MINUTES[s] ? MINUTES[s] + ' 分钟，' : '不讲，') +
            bySec(s).length + ' 页）', '',
            '| 页 | 档 | 标题 | 屏幕上的元素 | 讲稿落点 |',
            '| --- | --- | --- | --- | --- |'].concat(rows).join('\n');
  }).join('\n\n'),

  figs: figures().join('\n'),

  deliver: '1. `做中学与综合实践活动.pptx`，' + SLIDES.length + ' 页（正文 ' + spoken +
    ' 页＋附录 ' + tiers('附').length + ' 页），每页配 speaker notes'
};

/* slides.data.js 里的分段横幅注释也从这里重写，免得段名与时长两处对不上 */
const BANNER = {
  '开场':'开场', '第一段':'第一段：做中学补了这门课的哪一半',
  '第二段':'第二段：成果不可信之后，专业位置在哪里',
  '第三段':'第三段：老问题清单，以及 AI 往哪边推',
  '第四段':'第四段：判断方法与环节配置',
  '第五段':'第五段：案例走查',
  '第六段':'第六段：证据、评价与红线',
  '第七段':'第七段：工具位置与起步路径',
  '附录':'附录：六个主题各一份案例（不讲，供带走）'
};
const DP = path.join(__dirname, 'slides.data.js');
let data = fs.readFileSync(DP, 'utf8');
data = data.replace(/^ {2}\/\* ═+.*?═+ \*\/\n/gm, '');
secs.forEach(s => {
  const n = bySec(s)[0].n;
  const re = new RegExp('^( {2}\\{ n:' + n + ', tier:)', 'm');
  if (!re.test(data)) throw new Error('slides.data.js 里找不到第 ' + n + ' 页的起始行');
  data = data.replace(re, '  /* ' + '═'.repeat(10) + ' ' + BANNER[s] +
    (MINUTES[s] ? '（' + MINUTES[s] + ' 分钟，' + bySec(s).length + ' 页）' : '（' + bySec(s).length + ' 页）') +
    '═'.repeat(10) + ' */\n$1');
});
data = data.replace(/\n( {2}\/\* ═)/g, '\n\n$1').replace(/\n{3,}( {2}\/\* ═)/g, '\n\n$1');
fs.writeFileSync(DP, data);

const P = path.join(__dirname, 'OUTLINE.md');
let doc = fs.readFileSync(P, 'utf8');
Object.keys(BLOCKS).forEach(k => {
  const re = new RegExp('(<!-- gen:' + k + ' -->\\n)[\\s\\S]*?(\\n<!-- /gen:' + k + ' -->)');
  if (!re.test(doc)) throw new Error('OUTLINE.md 里没有 gen:' + k + ' 标记');
  doc = doc.replace(re, (_, a, b) => a + BLOCKS[k] + b);
});
const un = SLIDES.filter(d => !SCREEN[d.layout]);
if (un.length) throw new Error('未登记版式：' + un.map(d => d.layout + '（第 ' + d.n + ' 页）').join('、'));
if (mins !== 90) throw new Error('各段时长合计 ' + mins + ' 分钟，不是 90');
fs.writeFileSync(P, doc);
console.log('OUTLINE.md 已重写：共 ' + SLIDES.length + ' 页（正文 ' + spoken + ' ＋附录 ' +
  tiers('附').length + ' ），' + mins + ' 分钟，A ' + tiers('A').length + ' / B ' + tiers('B').length);
