/* 从 slides.data.js 生成 .pptx，版式与网页版一致（1280×720 px ↔ 13.333×7.5 英寸，96 px/英寸）。
 * 骨架图示走 figures/ 下的 PNG，由 make_figures.py 从 figures.js 栅格化而来。
 * 网页版用 Noto Serif SC 做大标题；这里用微软雅黑，因为中文 Windows 一定有。
 * 若确定嵌入字体，把 DISPLAY 换成 'Noto Serif SC' 即可。 */
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const SLIDES = require('./slides.data.js');

const FIGDIR = path.join(__dirname, 'figures');
const FIGMETA = JSON.parse(fs.readFileSync(path.join(FIGDIR, 'meta.json'), 'utf8'));

const IN = px => px / 96;
const W = 13.333, H = 7.5;
const PAD_L = IN(136), PAD_R = IN(96), PAD_T = IN(84);
const CW = W - PAD_L - PAD_R;               // 10.917
const CX = PAD_L;

const C = {
  navy:'0F1B2D', ink:'1A2029', muted:'5B6470', line:'E2E7F0',
  paper:'F5F7FB', white:'FFFFFF', wash:'FBF1EC',
  rust:'B0472A', slate:'33414F',
  sev3:'99341A', sev2:'C9714C', sev1:'EBC4B2', sev1ln:'D9A98F', dim:'A9B3C0'
};
const BODY = 'Microsoft YaHei';
const DISPLAY = 'Microsoft YaHei';

const SECTIONS = {
  '开场':'领航行动指南与本课程的关系',
  '第一段':'做中学对综合实践活动的覆盖范围',
  '第二段':'成果可替代性与教师的专业位置',
  '第三段':'既有问题与生成式 AI 的作用方向',
  '第四段':'环节配置的判断方法',
  '第五段':'生命健康主题的双学段案例',
  '第六段':'过程证据、评价与使用红线',
  '第七段':'工具定位与实施建议'
};
const ORDER = Object.keys(SECTIONS);

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = '辛海洋';
pres.title = '做中学与综合实践活动';
pres.subject = 'AI 在任务链条上的位置';

const T = o => Object.assign({ fontFace:BODY, color:C.ink, margin:0 }, o);

/* ── 常驻构件 ─────────────────────────────── */
function chrome(s, d, idx, total) {
  s.background = { color: C.paper };
  const top = IN(96), bot = IN(610), x = IN(56);
  s.addShape(pres.ShapeType.line, { x, y:top, w:0, h:bot - top, line:{ color:C.line, width:1.5 } });
  const si = ORDER.indexOf(d.sec);
  ORDER.forEach((_, i) => {
    const cy = top + (bot - top) * (i / (ORDER.length - 1));
    const on = i === si, done = i < si, r = on ? IN(7) : IN(5);
    s.addShape(pres.ShapeType.ellipse, { x:x - r, y:cy - r, w:r * 2, h:r * 2,
      fill:{ color: on ? C.rust : (done ? 'C2CBD8' : C.white) },
      line:{ color: on ? C.rust : (done ? 'C2CBD8' : C.line), width:2 } });
  });
  s.addText(d.sec.split('').join('\n'),
    T({ x:IN(10), y:H / 2 - 0.6, w:IN(30), h:1.2, fontSize:9, color:C.muted,
        align:'center', valign:'middle', lineSpacingMultiple:1.35 }));
  s.addText([{ text:String(idx).padStart(2, '0'), options:{ bold:true, color:C.navy } },
             { text:' / ' + total, options:{ color:C.muted } }],
    T({ x:CX, y:H - 0.62, w:2, h:0.26, fontSize:10, charSpacing:0.6 }));
  s.addText(d.tier + ' 档',
    T({ x:W - PAD_R - 1.4, y:H - 0.62, w:1.4, h:0.26, fontSize:8, color:C.dim, align:'right', charSpacing:1.4 }));
}

/* ── 通用块 ──────────────────────────────── */
function eyebrow(s, d, y) {
  s.addText(d.sec + '　·　' + (SECTIONS[d.sec] || ''),
    T({ x:CX, y: y == null ? PAD_T : y, w:CW, h:0.24, fontSize:10, bold:true, color:C.rust, charSpacing:2.2 }));
}
function headline(s, t, y, size) {
  s.addText(t, { fontFace:DISPLAY, color:C.navy, margin:0, x:CX, y, w:CW, h:0.66,
    fontSize:size || 32, bold:true, valign:'top' });
}
function top(s, d) { eyebrow(s, d); headline(s, d.title, PAD_T + 0.34); return PAD_T + 1.16; }
function footNote(s, t) {
  if (!t) return;
  s.addShape(pres.ShapeType.line, { x:CX, y:H - 1.06, w:CW, h:0, line:{ color:C.line, width:1 } });
  s.addText(t, T({ x:CX, y:H - 0.98, w:CW, h:0.4, fontSize:10, color:C.muted, lineSpacingMultiple:1.35, valign:'top' }));
}
function srcLine(s, t, y) {
  if (t) s.addText(t, T({ x:CX, y, w:CW, h:0.28, fontSize:10, color:C.muted }));
}
function card(s, x, y, w, h, accent) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius:0.09,
    fill:{ color:C.white }, line:{ color:C.line, width:1 } });
  if (accent) s.addShape(pres.ShapeType.rect, { x:x + 0.07, y, w:w - 0.14, h:IN(4),
    fill:{ color:accent }, line:{ color:accent, width:0 } });
}
function fig(s, name, y, maxH) {
  const m = FIGMETA[name];
  let w = CW, h = CW * m.h / m.w;
  if (maxH && h > maxH) { h = maxH; w = h * m.w / m.h; }
  s.addImage({ path:path.join(FIGDIR, name + '.png'), x:CX + (CW - w) / 2, y, w, h });
  return y + h;
}

/* ── 逐版式 ──────────────────────────────── */
const R = {
  cover(s, d) {
    s.addText(d.kicker, T({ x:CX, y:1.32, w:CW, h:0.26, fontSize:10, bold:true, color:C.rust, charSpacing:2.2 }));
    s.addText(d.title, { fontFace:DISPLAY, color:C.navy, margin:0, x:CX, y:1.72, w:CW, h:1.1, fontSize:50, bold:true });
    s.addText(d.sub, T({ x:CX, y:2.92, w:CW, h:0.44, fontSize:19, color:C.muted }));
    const bw = 1.62, gap = 0.2;
    d.chain.forEach((c, i) => {
      const x = CX + i * (bw + gap);
      s.addShape(pres.ShapeType.roundRect, { x, y:3.66, w:bw, h:0.42, rectRadius:0.07,
        fill:{ color:C.white }, line:{ color:C.line, width:1 } });
      s.addText(c, T({ x, y:3.66, w:bw, h:0.42, fontSize:10, color:C.slate, align:'center', valign:'middle' }));
      if (i < d.chain.length - 1) s.addShape(pres.ShapeType.line,
        { x:x + bw, y:3.87, w:gap, h:0, line:{ color:C.line, width:1 } });
    });
    d.meta.forEach((m, i) => {
      const x = CX + i * 2.5;
      s.addText(m[0], T({ x, y:5.0, w:2.3, h:0.24, fontSize:11, color:C.muted }));
      s.addText(m[1], T({ x, y:5.3, w:2.3, h:0.3, fontSize:14, color:C.navy }));
    });
  },
  factfile(s, d) {
    top(s, d);
    s.addText(d.fact.name, { fontFace:DISPLAY, color:C.navy, margin:0, x:CX, y:PAD_T + 1.12,
      w:CW, h:0.55, fontSize:21, bold:true, lineSpacingMultiple:1.35 });
    const cw = (CW - 0.54) / 3;
    d.fact.rows.forEach((r, i) => {
      const x = CX + i * (cw + 0.27);
      card(s, x, 2.72, cw, 0.86, C.slate);
      s.addText(r[0], T({ x:x + 0.2, y:2.88, w:cw - 0.4, h:0.22, fontSize:9.5, color:C.muted }));
      s.addText(r[1], T({ x:x + 0.2, y:3.14, w:cw - 0.4, h:0.3, fontSize:13, color:C.navy }));
    });
    s.addText(d.note, T({ x:CX, y:4.02, w:CW - 1.0, h:0.9, fontSize:16, lineSpacingMultiple:1.4, valign:'top' }));
  },
  quotecards(s, d) {
    const y = top(s, d);
    const qh = 1.42;
    s.addShape(pres.ShapeType.roundRect, { x:CX, y, w:CW, h:qh, rectRadius:0.09,
      fill:{ color:C.white }, line:{ color:C.line, width:1 } });
    s.addShape(pres.ShapeType.rect, { x:CX, y:y + 0.06, w:IN(4), h:qh - 0.12, fill:{ color:C.slate }, line:{ width:0, color:C.slate } });
    s.addText(d.quote, T({ x:CX + 0.28, y:y + 0.16, w:CW - 0.56, h:qh - 0.32, fontSize:15,
      lineSpacingMultiple:1.6, valign:'top' }));
    srcLine(s, d.src, y + qh + 0.14);
    const n = d.cards.length, cw = (CW - 0.15 * (n - 1)) / n;
    d.cards.forEach((c, i) => {
      const x = CX + i * (cw + 0.15);
      card(s, x, 4.28, cw, 0.86, C.slate);
      s.addText(c[0], T({ x:x + 0.14, y:4.44, w:cw - 0.28, h:0.2, fontSize:9.5, color:C.muted }));
      s.addText(c[1], { fontFace:DISPLAY, color:C.navy, margin:0, x:x + 0.14, y:4.66, w:cw - 0.28, h:0.4,
        fontSize:11.5, bold:true, lineSpacingMultiple:1.2, valign:'top' });
    });
    footNote(s, d.foot);
  },
  coverage(s, d) { const y = top(s, d); fig(s, 'coverage', y + 0.1, 3.9); },
  bars(s, d)     { const y = top(s, d); fig(s, 'impact', y + 0.24, 3.5); footNote(s, d.foot); },
  overlay(s, d) {
    const y = top(s, d); const end = fig(s, 'overlap', y + 0.02, 3.5);
    s.addText(d.conclusion, T({ x:CX, y:end + 0.18, w:CW, h:0.4, fontSize:15 }));
  },
  chainflow(s, d) {
    const y = top(s, d); const end = fig(s, 'chain', y + 0.3);
    s.addText(d.local, T({ x:CX, y:end + 0.2, w:CW, h:0.4, fontSize:14 }));
  },
  shape(s, d) {
    const y = top(s, d); const end = fig(s, 'scale', y + 0.16);
    s.addText(d.conclusion, T({ x:CX, y:end + 0.2, w:CW, h:0.44, fontSize:16, color:C.ink }));
    s.addText(d.counter, T({ x:CX, y:end + 0.7, w:CW, h:0.4, fontSize:11.5, color:C.muted, lineSpacingMultiple:1.35 }));
  },
  fourfour(s, d) {
    const y = top(s, d), cw = (CW - 0.5) / 2;
    d.groups.forEach((g, gi) => {
      const x = CX + gi * (cw + 0.5);
      s.addText(g.label, T({ x, y, w:cw, h:0.22, fontSize:9.5, color:C.muted, charSpacing:0.8 }));
      g.items.forEach((it, i) => {
        const yy = y + 0.34 + i * 0.53;
        s.addShape(pres.ShapeType.roundRect, { x, y:yy, w:cw, h:0.44, rectRadius:0.07,
          fill:{ color:C.white }, line:{ color:C.line, width:1 } });
        s.addText(it, T({ x:x + 0.18, y:yy, w:cw - 0.36, h:0.44, fontSize:14, valign:'middle' }));
      });
    });
    srcLine(s, d.src, H - 1.0);
  },
  statement(s, d) {
    let y = 2.7;
    if (d.title) {
      s.addText(d.title, T({ x:CX, y:2.42, w:CW, h:0.26, fontSize:10, bold:true, color:C.rust, charSpacing:2.2 }));
      y = 2.86;
    }
    s.addText(d.big, { fontFace:DISPLAY, color:C.navy, margin:0, x:CX, y, w:CW - 0.9, h:2.5,
      fontSize:25, bold:true, lineSpacingMultiple:1.45, valign:'top' });
    if (d.sub) s.addText(d.sub, T({ x:CX, y:y + 1.6, w:CW - 0.9, h:0.4, fontSize:15, color:C.muted }));
  },
  twoplans(s, d) {
    const y = top(s, d), cw = (CW - 0.24) / 2, bh = 3.1;
    d.plans.forEach((p, i) => {
      const x = CX + i * (cw + 0.24);
      card(s, x, y, cw, bh, i ? C.sev2 : C.slate);
      s.addText(p.tag, T({ x:x + 0.2, y:y + 0.18, w:cw - 0.4, h:0.22, fontSize:9.5, color:C.muted, charSpacing:1 }));
      s.addText(p.lines.map((l, k) => ({ text:l, options:{ breakLine:k < p.lines.length - 1 } })),
        T({ x:x + 0.2, y:y + 0.5, w:cw - 0.4, h:bh - 0.7, fontSize:10, lineSpacingMultiple:1.45,
            paraSpaceAfter:4, valign:'top' }));
    });
    s.addText(d.ask, T({ x:CX, y:y + bh + 0.22, w:CW, h:0.35, fontSize:15, color:C.navy, bold:true }));
  },
  reveal(s, d) { R._pts(s, d, d.points); footNote(s, d.kicker); },
  bridge(s, d) { R._pts(s, d, d.points); },
  _pts(s, d, pts) {
    top(s, d);
    const y0 = 2.6;
    pts.forEach((p, i) => {
      const y = y0 + i * 0.72;
      s.addText(String(i + 1), { fontFace:DISPLAY, color:C.rust, margin:0, x:CX, y, w:0.4, h:0.4, fontSize:15, bold:true });
      s.addText(p, T({ x:CX + 0.52, y:y - 0.03, w:CW - 0.52, h:0.6, fontSize:16, lineSpacingMultiple:1.4, valign:'top' }));
    });
  },
  problems(s, d) {
    top(s, d);
    const cw = (CW - 0.42) / 2;
    d.items.forEach((it, i) => {
      const x = CX + (i % 2) * (cw + 0.42), y = 2.5 + Math.floor(i / 2) * 0.74;
      s.addShape(pres.ShapeType.roundRect, { x, y, w:cw, h:0.58, rectRadius:0.07,
        fill:{ color:C.white }, line:{ color:C.line, width:1 } });
      s.addText(String(i + 1).padStart(2, '0'),
        { fontFace:DISPLAY, color:C.dim, margin:0, x:x + 0.2, y, w:0.4, h:0.58, fontSize:12, bold:true, valign:'middle' });
      s.addText(it, T({ x:x + 0.66, y, w:cw - 0.86, h:0.58, fontSize:14.5, valign:'middle' }));
    });
  },
  evidence(s, d) {
    const y = top(s, d), bh = 2.35;
    card(s, CX, y, CW, bh, C.slate);
    s.addText(d.study.claim, { fontFace:DISPLAY, color:C.navy, margin:0, x:CX + 0.28, y:y + 0.2,
      w:CW - 0.56, h:0.36, fontSize:16, bold:true });
    d.study.rows.forEach((r, i) => {
      const yy = y + 0.72 + i * 0.38;
      s.addShape(pres.ShapeType.line, { x:CX + 0.28, y:yy, w:CW - 0.56, h:0, line:{ color:C.line, width:1 } });
      s.addText(r[0], T({ x:CX + 0.28, y:yy + 0.07, w:0.95, h:0.26, fontSize:9.5, color:C.muted }));
      s.addText(r[1], T({ x:CX + 1.36, y:yy + 0.05, w:CW - 1.64, h:0.3, fontSize:12.5 }));
    });
    srcLine(s, d.study.src, y + bh + 0.16);
    footNote(s, d.caveat);
  },
  counter(s, d) {
    const y = top(s, d), bh = 2.15;
    card(s, CX, y, CW, bh, C.rust);
    d.study.rows.forEach((r, i) => {
      const yy = y + 0.24 + i * 0.38;
      s.addShape(pres.ShapeType.line, { x:CX + 0.28, y:yy, w:CW - 0.56, h:0, line:{ color:C.line, width:1 } });
      s.addText(r[0], T({ x:CX + 0.28, y:yy + 0.07, w:0.95, h:0.26, fontSize:9.5, color:C.muted }));
      s.addText(r[1], T({ x:CX + 1.36, y:yy + 0.05, w:CW - 1.64, h:0.3, fontSize:12.5 }));
    });
    s.addText(d.study.term, T({ x:CX + 0.28, y:y + 1.78, w:CW - 0.56, h:0.28, fontSize:13.5, bold:true, color:C.rust }));
    srcLine(s, d.study.src, y + bh + 0.12);
    d.bounds.forEach((b, i) => s.addText(b,
      T({ x:CX, y:y + bh + 0.42 + i * 0.28, w:CW, h:0.26, fontSize:9.5, color:C.muted })));
    footNote(s, d.caveat);
  },
  tri(s, d) {
    const y = top(s, d), cw = (CW - 0.42) / 3;
    const tone = { alert:C.rust, struct:C.slate, muted:C.line };
    const headC = { alert:C.rust, struct:C.slate, muted:C.muted };
    d.cols.forEach((c, i) => {
      const x = CX + i * (cw + 0.21), bh = 3.5;
      card(s, x, y, cw, bh, tone[c.tone]);
      s.addText(c.head, { fontFace:DISPLAY, color:headC[c.tone], margin:0, x:x + 0.22, y:y + 0.2,
        w:cw - 0.44, h:0.34, fontSize:16, bold:true });
      s.addShape(pres.ShapeType.line, { x:x + 0.22, y:y + 0.62, w:cw - 0.44, h:0, line:{ color:headC[c.tone], width:2 } });
      c.items.forEach((it, k) => {
        const yy = y + 0.72 + k * 0.66;
        s.addText(it, T({ x:x + 0.22, y:yy, w:cw - 0.44, h:0.5, fontSize:13,
          color: c.tone === 'muted' ? C.muted : C.ink, lineSpacingMultiple:1.25, valign:'middle' }));
        if (k < c.items.length - 1) s.addShape(pres.ShapeType.line,
          { x:x + 0.22, y:yy + 0.56, w:cw - 0.44, h:0, line:{ color:C.line, width:1 } });
      });
    });
  },
  threebad(s, d) {
    const y = top(s, d), cw = (CW - 0.4) / 3, acc = [C.slate, C.sev2, C.rust];
    d.items.forEach((it, i) => {
      const x = CX + i * (cw + 0.2);
      card(s, x, y + 0.2, cw, 1.32, acc[i]);
      s.addText(it.t, { fontFace:DISPLAY, color:C.navy, margin:0, x:x + 0.22, y:y + 0.4, w:cw - 0.44, h:0.36, fontSize:16, bold:true });
      s.addText(it.d, T({ x:x + 0.22, y:y + 0.82, w:cw - 0.44, h:0.55, fontSize:11.5, color:C.muted, lineSpacingMultiple:1.35, valign:'top' }));
    });
    srcLine(s, d.src, y + 1.72);
    footNote(s, d.kicker);
  },
  threeq(s, d) {
    top(s, d);
    d.items.forEach((it, i) => {
      const y = 2.7 + i * 0.86;
      s.addText(it.no, { fontFace:DISPLAY, color:C.rust, margin:0, x:CX, y, w:0.45, h:0.5, fontSize:16, bold:true });
      s.addText(it.q, { fontFace:DISPLAY, color:C.navy, margin:0, x:CX + 0.62, y:y - 0.06, w:CW - 0.62, h:0.6, fontSize:23, bold:true, valign:'top' });
    });
    footNote(s, d.kicker);
  },
  threedo(s, d) {
    top(s, d);
    const nw = Math.max(0.5, 0.24 + Math.max.apply(null, d.items.map(x => x.no.length)) * 0.24);
    d.items.forEach((it, i) => {
      const y = 2.5 + i * 1.02, tx = CX + nw + 0.22;
      s.addText(it.no, { fontFace:DISPLAY, color:C.rust, margin:0, x:CX, y, w:nw, h:0.44, fontSize:16, bold:true });
      s.addText(it.t, { fontFace:DISPLAY, color:C.navy, margin:0, x:tx, y, w:CW - nw - 0.22, h:0.42, fontSize:20, bold:true });
      s.addText(it.d, T({ x:tx, y:y + 0.44, w:CW - nw - 0.22, h:0.4, fontSize:11.5, color:C.muted, valign:'top' }));
    });
    footNote(s, d.kicker);
  },
  blankgrid(s, d) {
    const y = top(s, d);
    const rows = [[{ text:'', options:{ fill:{ color:C.paper } } }]
      .concat(d.cols.map(c => ({ text:c, options:{ fill:{ color:C.paper }, color:C.muted, fontSize:9.5 } })))]
      .concat(d.rows.map(r => [{ text:r, options:{ fontSize:12.5 } }, '', '', '']));
    s.addTable(rows, { x:CX, y:y + 0.1, w:CW, colW:[2.3, 2.87, 2.87, 2.87], rowH:0.5,
      border:{ type:'solid', color:C.line, pt:1 }, fill:{ color:C.white },
      fontFace:BODY, color:C.ink, valign:'middle', margin:6 });
    footNote(s, d.foot);
  },
  twotasks(s, d) {
    const y = top(s, d), cw = (CW - 0.24) / 2, bh = 3.25;
    d.tasks.forEach((t, i) => {
      const x = CX + i * (cw + 0.24);
      card(s, x, y, cw, bh, i ? C.sev2 : C.slate);
      s.addText(t.name, { fontFace:DISPLAY, color:C.navy, margin:0, x:x + 0.22, y:y + 0.2, w:cw - 0.44, h:0.36, fontSize:17, bold:true });
      s.addText(t.grade + '　·　' + t.hours, T({ x:x + 0.22, y:y + 0.6, w:cw - 0.44, h:0.22, fontSize:9.5, color:C.muted }));
      s.addText(t.req, T({ x:x + 0.22, y:y + 0.9, w:cw - 0.44, h:0.46, fontSize:10.5, lineSpacingMultiple:1.4, valign:'top' }));
      s.addText(t.steps.map((v, k) => ({ text:(k + 1) + '. ' + v, options:{ breakLine:k < t.steps.length - 1 } })),
        T({ x:x + 0.22, y:y + 1.46, w:cw - 0.44, h:bh - 1.66, fontSize:9.5, color:C.muted,
            lineSpacingMultiple:1.4, paraSpaceAfter:4, valign:'top' }));
    });
    footNote(s, d.foot);
  },
  stage(s, d) {
    eyebrow(s, d);
    headline(s, d.title, PAD_T + 0.34);
    const lw = Math.max(0.9, 0.34 + d.level.length * 0.2);
    const bx = CX + d.title.length * 0.46 + 0.28;
    const fill = { 1:C.sev3, 2:C.sev2, 3:C.sev1, 4:C.white };
    const fg = { 1:C.white, 2:C.white, 3:C.ink, 4:C.muted };
    s.addShape(pres.ShapeType.roundRect, { x:bx, y:PAD_T + 0.46, w:lw, h:0.36, rectRadius:0.18,
      fill:{ color:fill[d.levelIdx] }, line:{ color: d.levelIdx >= 3 ? C.sev1ln : fill[d.levelIdx], width:1 } });
    s.addText(d.level, T({ x:bx, y:PAD_T + 0.46, w:lw, h:0.36, fontSize:11, bold:true,
      color:fg[d.levelIdx], align:'center', valign:'middle' }));
    const cw = (CW - 0.24) / 2, by = 2.1, bh = 1.02;
    [d.left, d.right].forEach((c, i) => {
      const x = CX + i * (cw + 0.24);
      s.addShape(pres.ShapeType.roundRect, { x, y:by, w:cw, h:bh, rectRadius:0.08,
        fill:{ color:C.white }, line:{ color:C.line, width:1 } });
      s.addShape(pres.ShapeType.rect, { x, y:by + 0.06, w:IN(4), h:bh - 0.12,
        fill:{ color: i ? C.sev2 : C.slate }, line:{ width:0, color: i ? C.sev2 : C.slate } });
      s.addText(c.name, T({ x:x + 0.24, y:by + 0.14, w:cw - 0.46, h:0.2, fontSize:9.5, color:C.muted }));
      s.addText(c.body, T({ x:x + 0.24, y:by + 0.4, w:cw - 0.46, h:bh - 0.54, fontSize:13, lineSpacingMultiple:1.4, valign:'top' }));
    });
    s.addText(d.rule, { fontFace:DISPLAY, color:C.navy, margin:0, x:CX, y:by + bh + 0.34,
      w:CW, h:0.7, fontSize:18, bold:true, lineSpacingMultiple:1.4, valign:'top' });
    const ey = H - 1.62, alert = d.extra.tone === 'alert';
    if (alert) s.addShape(pres.ShapeType.roundRect, { x:CX, y:ey - 0.06, w:CW, h:1.02, rectRadius:0.08,
      fill:{ color:C.wash }, line:{ color:C.wash, width:0 } });
    else s.addShape(pres.ShapeType.line, { x:CX, y:ey, w:CW, h:0, line:{ color:C.line, width:1 } });
    const px = alert ? CX + 0.2 : CX;
    s.addText(d.extra.label, T({ x:px, y:ey + 0.12, w:CW - 0.4, h:0.22, fontSize:9.5,
      color: alert ? C.rust : C.muted, bold: alert, charSpacing:0.8 }));
    s.addText(d.extra.text, T({ x:px, y:ey + 0.4, w:CW - 0.4, h:0.55, fontSize:11.5, lineSpacingMultiple:1.4, valign:'top' }));
  },
  twoscales(s, d) {
    const y = top(s, d), cw = (CW - 0.24) / 2;
    d.cases.forEach((c, i) => {
      const x = CX + i * (cw + 0.24);
      card(s, x, y + 0.2, cw, 1.92, i ? C.sev2 : C.slate);
      s.addText(c.name, { fontFace:DISPLAY, color:C.navy, margin:0, x:x + 0.22, y:y + 0.4, w:cw - 0.44, h:0.34, fontSize:16, bold:true });
      s.addText(c.grade + '　·　' + c.hours, T({ x:x + 0.22, y:y + 0.78, w:cw - 0.44, h:0.2, fontSize:9.5, color:C.muted }));
      s.addText(c.scale, T({ x:x + 0.22, y:y + 1.04, w:cw - 0.44, h:0.36, fontSize:13, bold:true, lineSpacingMultiple:1.3, valign:'top' }));
      s.addText(c.detail, T({ x:x + 0.22, y:y + 1.46, w:cw - 0.44, h:0.58, fontSize:10.5, color:C.muted, lineSpacingMultiple:1.4, valign:'top' }));
    });
    footNote(s, d.kicker);
  },
  tracktable(s, d) {
    const y = top(s, d);
    const rows = [d.cols.map(c => ({ text:c, options:{ fill:{ color:C.paper }, color:C.muted, fontSize:9.5 } })),
                  d.sample.map(c => ({ text:c, options:{ fontSize:12, valign:'top' } }))];
    s.addTable(rows, { x:CX, y:y + 0.3, w:CW, colW:[2.73, 2.73, 2.73, 2.72], rowH:[0.4, 1.7],
      border:{ type:'solid', color:C.line, pt:1 }, fill:{ color:C.white },
      fontFace:BODY, color:C.ink, margin:9, lineSpacingMultiple:1.4 });
    footNote(s, d.kicker);
  },
  redlines(s, d) {
    const y = top(s, d);
    d.items.forEach((it, i) => {
      const yy = y + i * 0.66;
      s.addShape(pres.ShapeType.roundRect, { x:CX, y:yy, w:CW, h:0.56, rectRadius:0.07,
        fill:{ color:C.white }, line:{ color:C.line, width:1 } });
      s.addShape(pres.ShapeType.rect, { x:CX, y:yy + 0.05, w:IN(4), h:0.46, fill:{ color:C.rust }, line:{ width:0, color:C.rust } });
      s.addText(it.t, T({ x:CX + 0.24, y:yy, w:1.4, h:0.56, fontSize:13, bold:true, color:C.rust, valign:'middle' }));
      s.addText(it.d, T({ x:CX + 1.76, y:yy, w:CW - 2.0, h:0.56, fontSize:12, lineSpacingMultiple:1.35, valign:'middle' }));
    });
    let ry = y + d.items.length * 0.66 + 0.14;
    if (d.kicker) { s.addText(d.kicker, T({ x:CX, y:ry, w:CW, h:0.3, fontSize:13, color:C.ink })); ry += 0.38; }
    srcLine(s, d.src, ry);
    footNote(s, d.caveat);
  },
  signature(s, d) {
    top(s, d);
    let x = CX;
    d.subjects.forEach(t => {
      const w = 0.44 + t.length * 0.27;
      s.addShape(pres.ShapeType.roundRect, { x, y:2.7, w, h:0.58, rectRadius:0.09,
        fill:{ color:C.white }, line:{ color:C.line, width:1 } });
      s.addText(t, { fontFace:DISPLAY, color:C.navy, margin:0, x, y:2.7, w, h:0.58, fontSize:15, bold:true, align:'center', valign:'middle' });
      x += w + 0.2;
    });
    s.addText(d.absent, T({ x:CX, y:3.52, w:CW, h:0.36, fontSize:15, bold:true, color:C.rust }));
    d.split.forEach((p, i) => {
      const bx = CX + i * (CW / 2);
      s.addText(p[0], T({ x:bx, y:4.36, w:CW / 2 - 0.4, h:0.22, fontSize:9.5, color:C.muted }));
      s.addText(p[1], { fontFace:DISPLAY, color:C.navy, margin:0, x:bx, y:4.64, w:CW / 2 - 0.4, h:0.44, fontSize:21, bold:true });
    });
  },
  toolpos(s, d) {
    const y = top(s, d);
    const head = [{ text:'', options:{ fill:{ color:C.paper } } }]
      .concat(d.cols.map(c => ({ text:c, options:{ fill:{ color:C.paper }, color:C.muted, fontSize:9.5 } })));
    const body = d.rows.map(r => [
      { text:r.t, options:{ fontSize:13, bold:true, color:C.navy } },
      { text:r.yes, options:{ fontSize:12 } },
      { text:r.no, options:{ fontSize:12, color:C.rust } }]);
    s.addTable([head].concat(body), { x:CX, y:y + 0.3, w:CW, colW:[2.2, 4.4, 4.32],
      rowH:[0.4, 0.66, 0.66, 0.66], border:{ type:'solid', color:C.line, pt:1 }, fill:{ color:C.white },
      fontFace:BODY, color:C.ink, valign:'middle', margin:9 });
    footNote(s, d.kicker);
  },
  uses(s, d) {
    const y = top(s, d);
    s.addText(d.lead, T({ x:CX, y:y - 0.06, w:CW, h:0.3, fontSize:11.5, color:C.muted }));
    const cw = (CW - 0.2) / 2, ch = 1.42, acc = [C.slate, C.sev2, C.sev2, C.slate];
    d.items.forEach((it, i) => {
      const x = CX + (i % 2) * (cw + 0.2), yy = y + 0.4 + Math.floor(i / 2) * (ch + 0.18);
      card(s, x, yy, cw, ch, acc[i]);
      s.addText(it.t, { fontFace:DISPLAY, color:C.navy, margin:0, x:x + 0.22, y:yy + 0.16, w:cw - 0.44, h:0.32, fontSize:15, bold:true });
      s.addText(it.how, T({ x:x + 0.22, y:yy + 0.52, w:cw - 0.44, h:0.5, fontSize:11.5, lineSpacingMultiple:1.35, valign:'top' }));
      s.addShape(pres.ShapeType.line, { x:x + 0.22, y:yy + 1.06, w:cw - 0.44, h:0, line:{ color:C.line, width:1 } });
      s.addText([{ text:'产出　', options:{ bold:true, color:C.slate } }, { text:it.out, options:{ color:C.muted } }],
        T({ x:x + 0.22, y:yy + 1.13, w:cw - 0.44, h:0.24, fontSize:10 }));
    });
    footNote(s, d.foot);
  },
  exchange(s, d) {
    const y = top(s, d);
    s.addText(d.lead, T({ x:CX, y:y - 0.06, w:CW, h:0.3, fontSize:11.5, color:C.muted }));
    const tone = { ask:C.slate, ans:C.sev2, judge:C.rust };
    const bg = { ask:C.white, ans:C.paper, judge:C.wash };
    let yy = y + 0.4;
    d.turns.forEach(t => {
      const h = t.tone === 'ans' ? 0.98 : 0.86;
      s.addShape(pres.ShapeType.roundRect, { x:CX, y:yy, w:CW, h, rectRadius:0.08,
        fill:{ color:bg[t.tone] }, line:{ color: t.tone === 'judge' ? C.sev1ln : C.line, width:1 } });
      s.addShape(pres.ShapeType.rect, { x:CX, y:yy + 0.05, w:IN(4), h:h - 0.1,
        fill:{ color:tone[t.tone] }, line:{ width:0, color:tone[t.tone] } });
      s.addText(t.who, T({ x:CX + 0.24, y:yy + 0.14, w:1.05, h:0.24, fontSize:10, bold:true, color:tone[t.tone] }));
      s.addText(t.text, T({ x:CX + 1.44, y:yy + 0.12, w:CW - 1.72, h:h - 0.24, fontSize:12.5,
        color: t.tone === 'ans' ? C.muted : C.ink, lineSpacingMultiple:1.45, valign:'top' }));
      yy += h + 0.14;
    });
    footNote(s, d.foot);
  },
  agentspec(s, d) {
    const y = top(s, d);
    s.addText(d.lead, T({ x:CX, y:y - 0.02, w:CW, h:0.6, fontSize:14, color:C.muted, lineSpacingMultiple:1.45, valign:'top' }));
    const sy = y + 0.78, sh = 1.55;
    s.addShape(pres.ShapeType.roundRect, { x:CX, y:sy, w:CW, h:sh, rectRadius:0.09,
      fill:{ color:C.white }, line:{ color:C.line, width:1 } });
    s.addShape(pres.ShapeType.rect, { x:CX, y:sy + 0.06, w:IN(4), h:sh - 0.12, fill:{ color:C.rust }, line:{ width:0, color:C.rust } });
    s.addText('可直接照抄的指令', T({ x:CX + 0.3, y:sy + 0.18, w:CW - 0.6, h:0.22, fontSize:10, bold:true, color:C.rust, charSpacing:1.2 }));
    s.addText(d.spec, T({ x:CX + 0.3, y:sy + 0.5, w:CW - 0.6, h:sh - 0.68, fontSize:15, lineSpacingMultiple:1.6, valign:'top' }));
    s.addText(d.after, T({ x:CX, y:sy + sh + 0.28, w:CW, h:0.4, fontSize:13.5, lineSpacingMultiple:1.5, valign:'top' }));
  },
  endnote(s, d) {
    d.lines.forEach((l, i) => s.addText(l,
      T({ x:CX, y:2.14 + i * 0.8, w:CW - 1.0, h:0.7, fontSize:13.5, color:C.muted,
          lineSpacingMultiple:1.55, valign:'top' })));
    s.addText(d.sign, T({ x:CX, y:5.0, w:CW, h:0.32, fontSize:14, color:C.navy }));
    s.addShape(pres.ShapeType.roundRect, { x:CX, y:5.46, w:3.2, h:0.5, rectRadius:0.08,
      fill:{ color:C.paper }, line:{ color:C.sev1ln, width:1, dashType:'dash' } });
    s.addText(d.handout, T({ x:CX, y:5.46, w:3.2, h:0.5, fontSize:11.5, color:C.rust, align:'center', valign:'middle' }));
  }
};

SLIDES.forEach((d, i) => {
  const s = pres.addSlide();
  chrome(s, d, i + 1, SLIDES.length);
  if (!R[d.layout]) throw new Error('缺少版式渲染器：' + d.layout + '（第 ' + d.n + ' 页）');
  R[d.layout](s, d);
  s.addNotes(d.notes);
});

const out = process.argv[2] || '做中学与综合实践活动.pptx';
pres.writeFile({ fileName: out }).then(() => console.log('已生成', out, '共', SLIDES.length, '页'));
