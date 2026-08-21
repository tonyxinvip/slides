/* 从 slides.data.js 生成 .pptx。内容与 HTML deck 同源，不要在两边分别改。
   版面 13.333 × 7.5 英寸，与 HTML 的 1280 × 720 px 一一对应（96 px/英寸）。 */
const pptxgen = require('pptxgenjs');
const SLIDES = require('./slides.data.js');

const IN = px => px / 96;          // px → 英寸
const PT = px => px * 0.75;        // px → 磅

const W = 13.333, H = 7.5, PAD = IN(72), GAP = IN(48), GAPS = IN(24);
const CW = W - PAD * 2;            // 内容宽 11.833

const C = {
  ink:'1A2029', ink2:'5A6472', struct:'33414F', struct2:'8C97A3',
  hair:'E2E6EA', soft:'F4F6F8', white:'FFFFFF',
  alert:'B0472A', sev3:'99341A', sev2:'C9714C', sev1:'EBC4B2', sev1ln:'D9A98F'
};
const F = 'Microsoft YaHei';       // 目标机器为中文 Windows；LibreOffice 预览会替换字体，宽度仅供参考

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';       // 必须在 addSlide 之前
pres.author = '辛海洋';
pres.title = '做中学与综合实践活动';

const txt = o => Object.assign({ fontFace:F, color:C.ink, margin:0 }, o);
const TITLE_Y = 0.62, TITLE_H = 0.62, BODY_TOP = 1.55;

function addTitle(s, t) {
  if (!t) return BODY_TOP - 0.35;
  s.addText(t, txt({ x:PAD, y:TITLE_Y, w:CW, h:TITLE_H, fontSize:36, bold:true, valign:'top' }));
  return BODY_TOP;
}
function addFoot(s, t) {
  if (!t) return;
  s.addShape(pres.ShapeType.line, { x:PAD, y:H - 0.98, w:CW, h:0, line:{ color:C.hair, width:1 } });
  s.addText(t, txt({ x:PAD, y:H - 0.9, w:CW, h:0.55, fontSize:11, color:C.ink2, lineSpacingMultiple:1.35, valign:'top' }));
}
function addSrc(s, t, y) {
  if (!t) return;
  s.addText(t, txt({ x:PAD, y, w:CW, h:0.3, fontSize:11, color:C.ink2, valign:'top' }));
}
function tag(s, n, tier) {
  s.addText(String(n).padStart(2,'0') + ' · ' + tier,
    txt({ x:W-1.5, y:0.16, w:1.0, h:0.24, fontSize:9, color:C.struct2, align:'right' }));
}
function softBox(s, x, y, w, h) {
  s.addShape(pres.ShapeType.rect, { x, y, w, h, fill:{ color:C.soft }, line:{ color:C.soft, width:0 } });
}
function ruleTop(s, x, y, w, color, width) {
  s.addShape(pres.ShapeType.line, { x, y, w, h:0, line:{ color:color||C.struct, width:width||2 } });
}

const R = {
  cover(s, d) {
    s.addText(d.kicker, txt({ x:PAD, y:1.75, w:CW, h:0.3, fontSize:14, color:C.ink2, charSpacing:2 }));
    s.addText(d.title, txt({ x:PAD, y:2.15, w:CW, h:0.95, fontSize:48, bold:true }));
    s.addText(d.sub, txt({ x:PAD, y:3.15, w:CW, h:0.45, fontSize:21, color:C.ink2 }));
    const n = d.chain.length, bw = 1.62, gap = 0.16;
    d.chain.forEach((c, i) => {
      const x = PAD + i * (bw + gap);
      s.addShape(pres.ShapeType.rect, { x, y:3.95, w:bw, h:0.42,
        fill:{ color:C.white }, line:{ color:C.hair, width:1 } });
      s.addText(c, txt({ x, y:3.95, w:bw, h:0.42, fontSize:10, color:C.struct, align:'center', valign:'middle' }));
      if (i < n - 1) s.addShape(pres.ShapeType.line,
        { x:x + bw, y:4.16, w:gap, h:0, line:{ color:C.hair, width:1 } });
    });
    d.meta.forEach((m, i) => {
      const x = PAD + i * 2.4;
      s.addText(m[0], txt({ x, y:6.15, w:2.2, h:0.24, fontSize:12, color:C.ink2 }));
      s.addText(m[1], txt({ x, y:6.42, w:2.2, h:0.3, fontSize:16 }));
    });
  },
  factfile(s, d) {
    addTitle(s, d.title);
    s.addText(d.fact.name, txt({ x:PAD, y:BODY_TOP, w:CW, h:0.6, fontSize:24, lineSpacingMultiple:1.4 }));
    d.fact.rows.forEach((r, i) => {
      const x = PAD + i * 3.45, w = 3.25;
      ruleTop(s, x, 2.62, w);
      s.addText(r[0], txt({ x, y:2.72, w, h:0.26, fontSize:11, color:C.ink2 }));
      s.addText(r[1], txt({ x, y:3.0, w, h:0.32, fontSize:16 }));
    });
    s.addText(d.note, txt({ x:PAD, y:4.25, w:CW - 0.6, h:1.0, fontSize:21, lineSpacingMultiple:1.45, valign:'top' }));
  },
  quotecards(s, d) {
    addTitle(s, d.title);
    const qh = 1.55;
    softBox(s, PAD, BODY_TOP, CW, qh);
    s.addText(d.quote, txt({ x:PAD + 0.3, y:BODY_TOP + 0.16, w:CW - 0.6, h:qh - 0.32,
      fontSize:17, lineSpacingMultiple:1.55, valign:'top' }));
    addSrc(s, d.src, BODY_TOP + qh + 0.14);
    const n = d.cards.length, cw = (CW - 0.24 * (n - 1)) / n;
    d.cards.forEach((c, i) => {
      const x = PAD + i * (cw + 0.24);
      ruleTop(s, x, 4.15, cw);
      s.addText(c[0], txt({ x, y:4.25, w:cw, h:0.24, fontSize:11, color:C.ink2 }));
      s.addText(c[1], txt({ x, y:4.53, w:cw, h:0.5, fontSize:13, lineSpacingMultiple:1.25, valign:'top' }));
    });
    addFoot(s, d.foot);
  },
  timeline(s, d) {
    addTitle(s, d.title);
    const rh = 0.78;
    d.nodes.forEach((n, i) => {
      const y = BODY_TOP + i * rh;
      s.addShape(pres.ShapeType.line, { x:PAD, y, w:CW, h:0, line:{ color:C.hair, width:1 } });
      s.addText(n[0], txt({ x:PAD, y:y + 0.16, w:1.5, h:0.32, fontSize:16, bold:true, color:C.struct }));
      s.addText(n[1], txt({ x:PAD + 1.65, y:y + 0.16, w:CW - 1.65, h:0.5, fontSize:14, lineSpacingMultiple:1.3, valign:'top' }));
    });
    s.addShape(pres.ShapeType.line, { x:PAD, y:BODY_TOP + d.nodes.length * rh, w:CW, h:0, line:{ color:C.hair, width:1 } });
  },
  fourfour(s, d) {
    addTitle(s, d.title);
    const cw = (CW - GAP) / 2;
    d.groups.forEach((g, gi) => {
      const x = PAD + gi * (cw + GAP);
      s.addText(g.label, txt({ x, y:BODY_TOP, w:cw, h:0.26, fontSize:11, color:C.ink2, charSpacing:1 }));
      g.items.forEach((it, i) => {
        const y = BODY_TOP + 0.44 + i * 0.56;
        s.addShape(pres.ShapeType.line, { x, y, w:0, h:0.44, line:{ color:C.hair, width:2 } });
        s.addText(it, txt({ x:x + 0.18, y, w:cw - 0.18, h:0.44, fontSize:16, valign:'middle' }));
      });
    });
    addSrc(s, d.src, H - 1.15);
  },
  coverage(s, d) {
    addTitle(s, d.title);
    const cw = (CW - GAP) / 2;
    [d.left, d.right].forEach((side, si) => {
      const x = PAD + si * (cw + GAP);
      s.addText(side.label, txt({ x, y:BODY_TOP, w:cw, h:0.26, fontSize:11, color:C.ink2, charSpacing:1 }));
      side.items.forEach((it, i) => {
        const y = BODY_TOP + 0.46 + i * 0.92;
        s.addShape(pres.ShapeType.line, { x, y, w:cw, h:0, line:{ color:C.hair, width:1 } });
        const on = it.on === true, part = it.on === 'part';
        s.addShape(pres.ShapeType.ellipse, { x:x + 0.03, y:y + 0.2, w:0.15, h:0.15,
          fill:{ color: on ? C.struct : C.white },
          line:{ color: on ? C.struct : (part ? C.struct : C.struct2), width: part ? 3 : 1 } });
        s.addText(it.t, txt({ x:x + 0.34, y:y + 0.13, w:cw - 0.34, h:0.3, fontSize:16,
          color: (on || part) ? C.ink : C.ink2 }));
        s.addText(it.why, txt({ x:x + 0.34, y:y + 0.44, w:cw - 0.34, h:0.28, fontSize:11, color:C.ink2 }));
      });
      s.addShape(pres.ShapeType.line, { x, y:BODY_TOP + 0.46 + side.items.length * 0.92, w:cw, h:0,
        line:{ color:C.hair, width:1 } });
    });
  },
  statement(s, d) {
    let y = 2.5;
    if (d.title) { s.addText(d.title, txt({ x:PAD, y:2.05, w:CW, h:0.6, fontSize:36, bold:true })); y = 2.85; }
    s.addText(d.big, txt({ x:PAD, y, w:CW - 0.9, h:2.0, fontSize:30, lineSpacingMultiple:1.45, valign:'top' }));
    if (d.sub) s.addText(d.sub, txt({ x:PAD, y:y + 1.35, w:CW - 0.9, h:0.5, fontSize:21, color:C.ink2 }));
  },
  twoplans(s, d) {
    addTitle(s, d.title);
    const cw = (CW - GAPS) / 2, bh = 3.85;
    d.plans.forEach((p, i) => {
      const x = PAD + i * (cw + GAPS);
      softBox(s, x, BODY_TOP, cw, bh);
      s.addText(p.tag, txt({ x:x + 0.22, y:BODY_TOP + 0.18, w:cw - 0.44, h:0.24, fontSize:11, color:C.ink2, charSpacing:1 }));
      s.addText(p.lines.map(l => ({ text:l, options:{ breakLine:true } })),
        txt({ x:x + 0.22, y:BODY_TOP + 0.52, w:cw - 0.44, h:bh - 0.72, fontSize:11,
              lineSpacingMultiple:1.45, paraSpaceAfter:5, valign:'top' }));
    });
    s.addText(d.ask, txt({ x:PAD, y:BODY_TOP + bh + 0.22, w:CW, h:0.35, fontSize:16 }));
  },
  reveal(s, d) { R._points(s, d, d.points); addFoot(s, d.kicker); },
  bridge(s, d) { R._points(s, d, d.points); },
  _points(s, d, pts) {
    addTitle(s, d.title);
    pts.forEach((p, i) => {
      const y = BODY_TOP + 0.15 + i * 0.75;
      s.addText(String(i + 1), txt({ x:PAD, y, w:0.35, h:0.4, fontSize:16, bold:true, color:C.struct2 }));
      s.addText(p, txt({ x:PAD + 0.45, y:y - 0.04, w:CW - 0.45, h:0.6, fontSize:21, lineSpacingMultiple:1.35, valign:'top' }));
    });
  },
  problems(s, d) {
    addTitle(s, d.title);
    const cw = (CW - GAP) / 2;
    d.items.forEach((it, i) => {
      const x = PAD + (i % 2) * (cw + GAP), y = 2.25 + Math.floor(i / 2) * 0.85;
      s.addShape(pres.ShapeType.line, { x, y, w:cw, h:0, line:{ color:C.hair, width:1 } });
      s.addText(String(i + 1).padStart(2,'0'), txt({ x, y:y + 0.2, w:0.45, h:0.35, fontSize:16, bold:true, color:C.struct2 }));
      s.addText(it, txt({ x:x + 0.52, y:y + 0.18, w:cw - 0.52, h:0.4, fontSize:21 }));
    });
  },
  bars(s, d) {
    addTitle(s, d.title);
    const nameW = 1.4, trackX = PAD + nameW + 0.2, trackW = CW - nameW - 0.2;
    const wid = { 3:1.0, 2:0.66, 1:0.30 }, col = { 3:C.sev3, 2:C.sev2, 1:C.sev1 };
    let y = BODY_TOP + 0.2;
    d.rows.forEach(r => {
      const bw = trackW * wid[r.level];
      s.addText(r.name, txt({ x:PAD, y, w:nameW, h:0.46, fontSize:16, align:'right', valign:'middle' }));
      s.addShape(pres.ShapeType.rect, { x:trackX, y, w:bw, h:0.46,
        fill:{ color:col[r.level] },
        line:{ color: r.level === 1 ? C.sev1ln : col[r.level], width:1 } });
      s.addText(r.label, txt({ x:trackX, y, w:bw - 0.16, h:0.46, fontSize:14, bold:true,
        color: r.level === 1 ? C.ink : C.white, align:'right', valign:'middle' }));
      y += 0.46 + 0.12;
      if (r.why) {
        s.addText(r.why, txt({ x:trackX, y:y - 0.02, w:trackW, h:0.3, fontSize:14, color:C.ink2 }));
        y += 0.42;
      }
    });
    addFoot(s, d.foot);
  },
  overlay(s, d) {
    addTitle(s, d.title);
    const cw = (CW - GAP) / 2, bh = 1.9;
    [d.a, d.b].forEach((o, i) => {
      const x = PAD + i * (cw + GAP);
      softBox(s, x, BODY_TOP, cw, bh);
      s.addText(o.label, txt({ x:x + 0.26, y:BODY_TOP + 0.2, w:cw - 0.52, h:0.24, fontSize:11, color:C.ink2 }));
      o.items.forEach((it, k) => s.addText(it,
        txt({ x:x + 0.26, y:BODY_TOP + 0.58 + k * 0.48, w:cw - 0.52, h:0.4, fontSize:19, bold:true })));
    });
    s.addText(d.conclusion, txt({ x:PAD, y:BODY_TOP + bh + 0.45, w:CW, h:0.8, fontSize:24, lineSpacingMultiple:1.4, valign:'top' }));
  },
  evidence(s, d) {
    addTitle(s, d.title);
    const bh = 2.5;
    softBox(s, PAD, BODY_TOP, CW, bh);
    s.addText(d.study.claim, txt({ x:PAD + 0.3, y:BODY_TOP + 0.2, w:CW - 0.6, h:0.4, fontSize:21 }));
    d.study.rows.forEach((r, i) => {
      const y = BODY_TOP + 0.78 + i * 0.42;
      s.addShape(pres.ShapeType.line, { x:PAD + 0.3, y, w:CW - 0.6, h:0, line:{ color:C.hair, width:1 } });
      s.addText(r[0], txt({ x:PAD + 0.3, y:y + 0.08, w:1.0, h:0.28, fontSize:11, color:C.ink2 }));
      s.addText(r[1], txt({ x:PAD + 1.42, y:y + 0.06, w:CW - 1.72, h:0.3, fontSize:14 }));
    });
    addSrc(s, d.study.src, BODY_TOP + bh + 0.16);
    addFoot(s, d.caveat);
  },
  counter(s, d) {
    addTitle(s, d.title);
    const bh = 2.35;
    softBox(s, PAD, BODY_TOP, CW, bh);
    d.study.rows.forEach((r, i) => {
      const y = BODY_TOP + 0.22 + i * 0.42;
      s.addShape(pres.ShapeType.line, { x:PAD + 0.3, y, w:CW - 0.6, h:0, line:{ color:C.hair, width:1 } });
      s.addText(r[0], txt({ x:PAD + 0.3, y:y + 0.08, w:1.0, h:0.28, fontSize:11, color:C.ink2 }));
      s.addText(r[1], txt({ x:PAD + 1.42, y:y + 0.06, w:CW - 1.72, h:0.3, fontSize:14 }));
    });
    s.addText(d.study.term, txt({ x:PAD + 0.3, y:BODY_TOP + 1.98, w:CW - 0.6, h:0.3, fontSize:16, bold:true, color:C.alert }));
    addSrc(s, d.study.src, BODY_TOP + bh + 0.14);
    d.bounds.forEach((b, i) => s.addText(b,
      txt({ x:PAD, y:BODY_TOP + bh + 0.46 + i * 0.3, w:CW, h:0.28, fontSize:11, color:C.ink2 })));
    addFoot(s, d.caveat);
  },
  tri(s, d) {
    addTitle(s, d.title);
    const cw = (CW - GAPS * 2) / 3;
    const tone = { alert:C.alert, struct:C.struct, muted:C.ink2 };
    d.cols.forEach((c, i) => {
      const x = PAD + i * (cw + GAPS), col = tone[c.tone];
      s.addText(c.head, txt({ x, y:BODY_TOP, w:cw, h:0.4, fontSize:21, bold:true, color:col }));
      s.addShape(pres.ShapeType.line, { x, y:BODY_TOP + 0.46, w:cw, h:0, line:{ color:col, width:2 } });
      c.items.forEach((it, k) => {
        const y = BODY_TOP + 0.46 + (k + 1) * 0.78;
        s.addText(it, txt({ x, y:y - 0.62, w:cw, h:0.56, fontSize:16,
          color: c.tone === 'muted' ? C.ink2 : C.ink, lineSpacingMultiple:1.2, valign:'middle' }));
        s.addShape(pres.ShapeType.line, { x, y, w:cw, h:0, line:{ color:C.hair, width:1 } });
      });
    });
  },
  threebad(s, d) {
    addTitle(s, d.title);
    const cw = (CW - GAPS * 2) / 3;
    d.items.forEach((it, i) => {
      const x = PAD + i * (cw + GAPS);
      ruleTop(s, x, 2.5, cw);
      s.addText(it.t, txt({ x, y:2.62, w:cw, h:0.45, fontSize:20, bold:true }));
      s.addText(it.d, txt({ x, y:3.14, w:cw, h:0.6, fontSize:14, color:C.ink2, lineSpacingMultiple:1.35, valign:'top' }));
    });
    addSrc(s, d.src, 4.05);
    addFoot(s, d.kicker);
  },
  threeq(s, d) {
    addTitle(s, d.title);
    d.items.forEach((it, i) => {
      const y = 2.35 + i * 0.86;
      s.addText(it.no, txt({ x:PAD, y, w:0.45, h:0.5, fontSize:21, bold:true, color:C.struct2 }));
      s.addText(it.q, txt({ x:PAD + 0.6, y:y - 0.04, w:CW - 0.6, h:0.6, fontSize:26, valign:'top' }));
    });
    addFoot(s, d.kicker);
  },
  threedo(s, d) {
    addTitle(s, d.title);
    d.items.forEach((it, i) => {
      const y = 2.2 + i * 1.05;
      s.addText(it.no, txt({ x:PAD, y, w:0.45, h:0.45, fontSize:21, bold:true, color:C.struct2 }));
      s.addText(it.t, txt({ x:PAD + 0.6, y, w:CW - 0.6, h:0.42, fontSize:23, bold:true }));
      s.addText(it.d, txt({ x:PAD + 0.6, y:y + 0.44, w:CW - 0.6, h:0.4, fontSize:14, color:C.ink2, valign:'top' }));
    });
    addFoot(s, d.kicker);
  },
  blankgrid(s, d) {
    addTitle(s, d.title);
    const rows = [[{ text:'', options:{ fill:{ color:C.soft } } }]
      .concat(d.cols.map(c => ({ text:c, options:{ fill:{ color:C.soft }, color:C.ink2, fontSize:11 } })))]
      .concat(d.rows.map(r => [{ text:r, options:{ fontSize:14 } }, '', '', '']));
    s.addTable(rows, { x:PAD, y:BODY_TOP, w:CW, colW:[2.6, 3.08, 3.08, 3.07], rowH:0.52,
      border:{ type:'solid', color:C.hair, pt:1 }, fontFace:F, color:C.ink, valign:'middle', margin:6 });
    addFoot(s, d.foot);
  },
  shape(s, d) {
    addTitle(s, d.title);
    const lvl = t => t === '收' ? 1 : (t === '半收' || t.indexOf('采集') === 0) ? 2 : t === '半放' ? 3 : 4;
    const fill = { 1:C.sev3, 2:C.sev2, 3:C.sev1, 4:C.soft };
    const fg   = { 1:C.white, 2:C.white, 3:C.ink, 4:C.ink2 };
    const cells = [{ n:d.before.label + '\n' + d.before.body, v:d.before.level, e:true }]
      .concat(d.stages.map(x => ({ n:x.t, v:x.level, e:false })))
      .concat([{ n:d.after.label + '\n' + d.after.body, v:d.after.level, e:true }]);
    const gapx = 0.1, edgeW = 1.2;
    const totalEdge = edgeW * 2 + gapx * (cells.length - 1);
    const midW = (CW - totalEdge) / d.stages.length;
    let x = PAD;
    cells.forEach(c => {
      const w = c.e ? edgeW : midW, k = lvl(c.v);
      s.addText(c.n, txt({ x, y:2.35, w, h:0.5, fontSize:9.5, color:C.ink2, align:'center',
        valign:'bottom', lineSpacingMultiple:1.2 }));
      s.addShape(pres.ShapeType.rect, { x, y:2.95, w, h:0.62,
        fill:{ color:fill[k] }, line:{ color: k === 3 ? C.sev1ln : fill[k], width:1 } });
      s.addText(c.v, txt({ x, y:2.95, w, h:0.62, fontSize:9.5, color:fg[k], align:'center', valign:'middle' }));
      x += w + gapx;
    });
    s.addText(d.conclusion, txt({ x:PAD, y:4.05, w:CW, h:0.75, fontSize:22, lineSpacingMultiple:1.4, valign:'top' }));
    s.addText(d.counter, txt({ x:PAD, y:4.9, w:CW, h:0.5, fontSize:14, color:C.ink2, lineSpacingMultiple:1.4, valign:'top' }));
  },
  twotasks(s, d) {
    addTitle(s, d.title);
    const cw = (CW - GAPS) / 2, bh = 3.9;
    d.tasks.forEach((t, i) => {
      const x = PAD + i * (cw + GAPS);
      softBox(s, x, BODY_TOP, cw, bh);
      s.addText(t.name, txt({ x:x + 0.26, y:BODY_TOP + 0.2, w:cw - 0.52, h:0.4, fontSize:20, bold:true }));
      s.addText(t.grade + ' · ' + t.hours, txt({ x:x + 0.26, y:BODY_TOP + 0.6, w:cw - 0.52, h:0.24, fontSize:11, color:C.ink2 }));
      s.addText(t.req, txt({ x:x + 0.26, y:BODY_TOP + 0.92, w:cw - 0.52, h:0.5, fontSize:11.5, lineSpacingMultiple:1.4, valign:'top' }));
      s.addText(t.steps.map((x2, k) => ({ text:(k + 1) + '. ' + x2, options:{ breakLine:k < t.steps.length - 1 } })),
        txt({ x:x + 0.26, y:BODY_TOP + 1.55, w:cw - 0.52, h:bh - 1.75, fontSize:10.5, color:C.ink2,
              lineSpacingMultiple:1.4, paraSpaceAfter:5, valign:'top' }));
    });
    addFoot(s, d.foot);
  },
  stage(s, d) {
    s.addText(d.title, txt({ x:PAD, y:TITLE_Y, w:5.4, h:TITLE_H, fontSize:36, bold:true }));
    const lw = Math.max(0.95, 0.36 + d.level.length * 0.2);   // 14pt 中文字宽约 0.194 英寸
    const bx = PAD + d.title.length * 0.5 + 0.3;   // 36pt 中文字宽约 0.5 英寸，标签紧跟标题
    const fill = { 1:C.sev3, 2:C.sev2, 3:C.sev1, 4:C.soft };
    const fg = { 1:C.white, 2:C.white, 3:C.ink, 4:C.ink2 };
    s.addShape(pres.ShapeType.rect, { x:bx, y:TITLE_Y + 0.12, w:lw, h:0.4,
      fill:{ color:fill[d.levelIdx] }, line:{ color: d.levelIdx === 3 ? C.sev1ln : fill[d.levelIdx], width:1 } });
    s.addText(d.level, txt({ x:bx, y:TITLE_Y + 0.12, w:lw, h:0.4, fontSize:14, bold:true,
      color:fg[d.levelIdx], align:'center', valign:'middle' }));
    const cw = (CW - GAPS) / 2, by = 2.05, bh = 1.1;
    [d.left, d.right].forEach((c, i) => {
      const x = PAD + i * (cw + GAPS);
      softBox(s, x, by, cw, bh);
      s.addText(c.name, txt({ x:x + 0.24, y:by + 0.16, w:cw - 0.48, h:0.22, fontSize:11, color:C.ink2 }));
      s.addText(c.body, txt({ x:x + 0.24, y:by + 0.44, w:cw - 0.48, h:bh - 0.6, fontSize:15,
        lineSpacingMultiple:1.35, valign:'top' }));
    });
    s.addText(d.rule, txt({ x:PAD, y:by + bh + 0.4, w:CW, h:0.8, fontSize:20, lineSpacingMultiple:1.4, valign:'top' }));
    const ey = H - 1.55;
    s.addShape(pres.ShapeType.line, { x:PAD, y:ey, w:CW, h:0, line:{ color:C.hair, width:1 } });
    s.addText(d.extra.label, txt({ x:PAD, y:ey + 0.14, w:CW, h:0.24, fontSize:11,
      color: d.extra.tone === 'alert' ? C.alert : C.ink2, bold: d.extra.tone === 'alert' }));
    s.addText(d.extra.text, txt({ x:PAD, y:ey + 0.42, w:CW, h:0.75, fontSize:13.5, lineSpacingMultiple:1.4, valign:'top' }));
  },
  twoscales(s, d) {
    addTitle(s, d.title);
    const cw = (CW - GAP) / 2;
    d.cases.forEach((c, i) => {
      const x = PAD + i * (cw + GAP);
      ruleTop(s, x, 2.3, cw);
      s.addText(c.name, txt({ x, y:2.42, w:cw, h:0.4, fontSize:20, bold:true }));
      s.addText(c.grade + ' · ' + c.hours, txt({ x, y:2.86, w:cw, h:0.24, fontSize:11, color:C.ink2 }));
      s.addText(c.scale, txt({ x, y:3.22, w:cw, h:0.5, fontSize:16, bold:true, lineSpacingMultiple:1.3, valign:'top' }));
      s.addText(c.detail, txt({ x, y:3.85, w:cw, h:1.1, fontSize:13.5, color:C.ink2, lineSpacingMultiple:1.45, valign:'top' }));
    });
    addFoot(s, d.kicker);
  },
  tracktable(s, d) {
    addTitle(s, d.title);
    const rows = [d.cols.map(c => ({ text:c, options:{ fill:{ color:C.soft }, color:C.ink2, fontSize:11 } })),
                  d.sample.map(c => ({ text:c, options:{ fontSize:13.5, valign:'top' } }))];
    s.addTable(rows, { x:PAD, y:BODY_TOP + 0.35, w:CW, colW:[2.96, 2.96, 2.96, 2.95], rowH:[0.42, 1.9],
      border:{ type:'solid', color:C.hair, pt:1 }, fontFace:F, color:C.ink, margin:9, lineSpacingMultiple:1.4 });
    addFoot(s, d.kicker);
  },
  chainflow(s, d) {
    addTitle(s, d.title);
    const n = d.nodes.length, aw = 0.36, nw = (CW - aw * (n - 1)) / n, ny = 2.35, nh = 1.75;
    d.nodes.forEach((node, i) => {
      const x = PAD + i * (nw + aw);
      softBox(s, x, ny, nw, nh);
      s.addText(node.t, txt({ x:x + 0.2, y:ny + 0.2, w:nw - 0.4, h:0.32, fontSize:16, bold:true }));
      s.addText(node.d, txt({ x:x + 0.2, y:ny + 0.58, w:nw - 0.4, h:nh - 0.75, fontSize:11,
        color:C.ink2, lineSpacingMultiple:1.4, valign:'top' }));
      if (i < n - 1) s.addText('→', txt({ x:x + nw, y:ny + nh / 2 - 0.16, w:aw, h:0.32,
        fontSize:16, color:C.struct2, align:'center' }));
    });
    s.addText(d.local, txt({ x:PAD, y:ny + nh + 0.45, w:CW, h:0.4, fontSize:14 }));
  },
  redlines(s, d) {
    addTitle(s, d.title);
    d.items.forEach((it, i) => {
      const y = BODY_TOP + i * 0.66;
      s.addShape(pres.ShapeType.line, { x:PAD, y, w:CW, h:0, line:{ color:C.hair, width:1 } });
      s.addText(it.t, txt({ x:PAD, y:y + 0.16, w:1.6, h:0.34, fontSize:16, bold:true, color:C.alert }));
      s.addText(it.d, txt({ x:PAD + 1.75, y:y + 0.14, w:CW - 1.75, h:0.42, fontSize:14, lineSpacingMultiple:1.4, valign:'top' }));
    });
    s.addShape(pres.ShapeType.line, { x:PAD, y:BODY_TOP + d.items.length * 0.66, w:CW, h:0, line:{ color:C.hair, width:1 } });
    addSrc(s, d.src, BODY_TOP + d.items.length * 0.66 + 0.16);
    addFoot(s, d.caveat);
  },
  signature(s, d) {
    addTitle(s, d.title);
    let x = PAD;
    d.subjects.forEach(t => {
      const w = 0.5 + t.length * 0.28;
      s.addShape(pres.ShapeType.rect, { x, y:2.5, w, h:0.6, fill:{ color:C.white }, line:{ color:C.hair, width:1 } });
      s.addText(t, txt({ x, y:2.5, w, h:0.6, fontSize:19, align:'center', valign:'middle' }));
      x += w + 0.25;
    });
    s.addText(d.absent, txt({ x:PAD, y:3.35, w:CW, h:0.4, fontSize:21, bold:true, color:C.alert }));
    d.split.forEach((p, i) => {
      const bx = PAD + i * (CW / 2);
      s.addText(p[0], txt({ x:bx, y:4.35, w:CW / 2 - 0.3, h:0.24, fontSize:11, color:C.ink2 }));
      s.addText(p[1], txt({ x:bx, y:4.65, w:CW / 2 - 0.3, h:0.45, fontSize:23, bold:true }));
    });
  },
  toolpos(s, d) {
    addTitle(s, d.title);
    const head = [{ text:'', options:{ fill:{ color:C.soft } } }]
      .concat(d.cols.map(c => ({ text:c, options:{ fill:{ color:C.soft }, color:C.ink2, fontSize:11 } })));
    const body = d.rows.map(r => [
      { text:r.t, options:{ fontSize:16, bold:true } },
      { text:r.yes, options:{ fontSize:14 } },
      { text:r.no, options:{ fontSize:14, color:C.alert } }]);
    s.addTable([head].concat(body), { x:PAD, y:BODY_TOP + 0.25, w:CW, colW:[2.4, 4.75, 4.68],
      rowH:[0.42, 0.72, 0.72, 0.72], border:{ type:'solid', color:C.hair, pt:1 },
      fontFace:F, color:C.ink, valign:'middle', margin:9 });
    addFoot(s, d.kicker);
  },
  endnote(s, d) {
    d.lines.forEach((l, i) => s.addText(l,
      txt({ x:PAD, y:2.2 + i * 0.85, w:CW - 1.2, h:0.75, fontSize:16, color:C.ink2,
            lineSpacingMultiple:1.55, valign:'top' })));
    s.addShape(pres.ShapeType.rect, { x:PAD, y:5.5, w:4.2, h:0.55,
      fill:{ color:C.white }, line:{ color:C.sev1ln, width:1, dashType:'dash' } });
    s.addText(d.handout, txt({ x:PAD, y:5.5, w:4.2, h:0.55, fontSize:13, color:C.alert, align:'center', valign:'middle' }));
  }
};

SLIDES.forEach(d => {
  const s = pres.addSlide();
  s.background = { color: C.white };
  tag(s, d.n, d.tier);
  if (!R[d.layout]) throw new Error('缺少版式渲染器：' + d.layout + '（第 ' + d.n + ' 页）');
  R[d.layout](s, d);
  s.addNotes(d.notes);
});

const out = process.argv[2] || '做中学与综合实践活动.pptx';
pres.writeFile({ fileName: out }).then(() => console.log('已生成', out, '共', SLIDES.length, '页'));
