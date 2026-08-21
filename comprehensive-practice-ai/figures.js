/* 骨架图示。每个函数返回一段独立 SVG，供网页直接内联、供 pptx 栅格化后嵌入。
 * 画布宽度统一 1048（1280 减去左侧书脊区 136 与右边距 96）。
 * 颜色与 styles.css 的口径一致，改色请两处同改。 */
(function (root) {
  'use strict';

  var C = {
    navy:'#0F1B2D', ink:'#1A2029', muted:'#5B6470', line:'#E2E7F0',
    paper:'#F5F7FB', white:'#FFFFFF', rust:'#B0472A', slate:'#33414F',
    sev3:'#99341A', sev2:'#C9714C', sev1:'#EBC4B2', sev1ln:'#D9A98F'
  };
  var SANS = "'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif";
  var SERIF = "'Noto Serif SC','Songti SC',serif";
  var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;' }[c]; }); };

  function wrap(w, h, inner) {
    return '<svg class="fig" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h +
      '" width="' + w + '" height="' + h + '" role="img" aria-hidden="true">' +
      '<style>text{font-family:' + SANS + '}.s{font-family:' + SERIF + '}</style>' + inner + '</svg>';
  }
  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.fill || C.ink) + '" font-size="' + (o.size || 15) +
      '" font-weight="' + (o.weight || 400) + '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.serif ? ' class="s"' : '') + (o.spacing ? ' letter-spacing="' + o.spacing + '"' : '') +
      '>' + esc(s) + '</text>';
  }
  function rect(x, y, w, h, o) {
    o = o || {};
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.r == null ? 8 : o.r) +
      '" fill="' + (o.fill || C.white) + '"' + (o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 1) + '"' : '') +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
  }

  var F = {};

  /* ── 覆盖关系：嵌套（第 07 页）──────────────────── */
  F.coverage = function () {
    var W = 1048, H = 372, s = '';
    s += rect(0, 40, 620, 300, { fill: C.white, stroke: C.line, r: 14 });
    s += txt(28, 70, '综合实践活动　四种活动方式', { size: 13, fill: C.muted, spacing: 1 });
    s += rect(24, 88, 572, 128, { fill: '#FBF1EC', stroke: C.sev1ln, r: 12 });
    s += txt(44, 114, '做中学覆盖的一半', { size: 13, fill: C.rust, weight: 700, spacing: 1 });
    [['考察探究', '六个环节的主干'], ['设计制作', '对应制作改进']].forEach(function (it, i) {
      var x = 44 + i * 268;
      s += txt(x, 152, it[0], { size: 22, weight: 700, fill: C.navy, serif: true });
      s += txt(x, 180, it[1], { size: 13.5, fill: C.muted });
    });
    s += txt(44, 250, '做中学没有覆盖的一半', { size: 13, fill: C.slate, weight: 700, spacing: 1 });
    [['社会服务', '身体必须在场'], ['职业体验', '身体必须在场']].forEach(function (it, i) {
      var x = 44 + i * 268;
      s += txt(x, 288, it[0], { size: 22, weight: 700, fill: C.navy, serif: true });
      s += txt(x, 314, it[1], { size: 13.5, fill: C.muted });
    });

    s += '<path d="M636 190 L676 190" stroke="' + C.muted + '" stroke-width="1.5"/>' +
         '<path d="M670 185 L678 190 L670 195 Z" fill="' + C.muted + '"/>';

    s += rect(690, 40, 358, 300, { fill: C.white, stroke: C.line, r: 14 });
    s += txt(718, 70, '四项培养目标', { size: 13, fill: C.muted, spacing: 1 });
    var goals = [
      ['问题解决', '完全覆盖，要求更严', 'full'],
      ['创意物化', '覆盖，且带迭代要求', 'full'],
      ['价值体认', '部分覆盖，路径不同', 'part'],
      ['责任担当', '停在态度层', 'part']];
    goals.forEach(function (g, i) {
      var y = 100 + i * 60;
      s += '<circle cx="726" cy="' + (y + 6) + '" r="7" fill="' + (g[2] === 'full' ? C.rust : C.white) +
           '" stroke="' + C.rust + '" stroke-width="2.5"/>';
      s += txt(748, y + 12, g[0], { size: 18, weight: 700, fill: C.navy, serif: true });
      s += txt(748, y + 34, g[1], { size: 13, fill: C.muted });
    });
    s += txt(718, 340, '实心为完全覆盖，空心为部分覆盖', { size: 11.5, fill: C.muted });
    return wrap(W, H, s);
  };

  /* ── 四种活动方式的冲击强度（第 11 页）──────────── */
  F.impact = function (rows) {
    var W = 1048, rowH = 46, gap = 12, whyH = 26;
    var nameW = 128, x0 = nameW + 22, trackW = W - x0 - 8;
    var fill = { 3: C.sev3, 2: C.sev2, 1: C.sev1 }, wid = { 3: 1, 2: 0.66, 1: 0.3 };
    var y = 8, s = '';
    rows.forEach(function (r) {
      var bw = trackW * wid[r.level], light = r.level === 1;
      s += txt(nameW, y + rowH * 0.66, r.name, { size: 18, weight: 500, anchor: 'end', fill: C.ink });
      s += rect(x0, y, bw, rowH, { fill: fill[r.level], stroke: light ? C.sev1ln : fill[r.level], r: 4 });
      s += txt(x0 + bw - 16, y + rowH * 0.64, r.label, { size: 15, weight: 700, anchor: 'end', fill: light ? C.ink : C.white });
      y += rowH + (r.why ? 6 : gap);
      if (r.why) { s += txt(x0, y + 15, r.why, { size: 14, fill: C.muted }); y += whyH + gap; }
    });
    return wrap(W, y + 4, s);
  };

  /* ── 两张图叠起来看（第 12 页）───────────────────── */
  F.overlap = function () {
    var W = 1048, H = 366, cx = W / 2, cy = 186, r = 134, off = 70, s = '';
    s += '<circle cx="' + (cx - off) + '" cy="' + cy + '" r="' + r + '" fill="' + C.slate + '" fill-opacity=".10" stroke="' + C.slate + '" stroke-width="1.5"/>';
    s += '<circle cx="' + (cx + off) + '" cy="' + cy + '" r="' + r + '" fill="' + C.rust + '" fill-opacity=".10" stroke="' + C.rust + '" stroke-width="1.5"/>';
    s += txt(cx - off - 74, cy - r - 20, '做中学没有覆盖的', { size: 14.5, weight: 700, anchor: 'middle', fill: C.slate });
    s += txt(cx + off + 70, cy - r - 20, 'AI 冲击最轻的', { size: 14.5, weight: 700, anchor: 'middle', fill: C.rust });
    s += txt(cx, cy - 10, '社会服务', { size: 22, weight: 700, anchor: 'middle', fill: C.navy, serif: true });
    s += txt(cx, cy + 22, '职业体验', { size: 22, weight: 700, anchor: 'middle', fill: C.navy, serif: true });
    s += txt(cx - off - 74, cy + 2, '考察探究', { size: 15, anchor: 'middle', fill: C.muted });
    s += txt(cx - off - 74, cy + 26, '设计制作', { size: 15, anchor: 'middle', fill: C.muted });
    s += txt(cx + off + 70, cy + 14, '身体必须在场', { size: 15, anchor: 'middle', fill: C.muted });
    s += txt(cx, H - 12, '两个集合的交集即综合实践活动教师的专业位置', { size: 14, anchor: 'middle', fill: C.muted });
    return wrap(W, H, s);
  };

  /* ── 收放刻度（第 23 页）─────────────────────────── */
  F.scale = function (before, stages, after) {
    var W = 1048, H = 214, s = '';
    var lvl = function (t) { return t === '收' ? 3 : (t === '半收' || t.indexOf('采集') === 0) ? 2 : t === '半放' ? 1 : 0; };
    var fill = { 3: C.sev3, 2: C.sev2, 1: C.sev1, 0: C.paper };
    var fg = { 3: C.white, 2: C.white, 1: C.ink, 0: C.muted };
    var edgeW = 120, gap = 9;
    var midW = (W - edgeW * 2 - gap * (stages.length + 1)) / stages.length;
    var cells = [{ n: before.label + '\n' + before.body, v: before.level, w: edgeW }]
      .concat(stages.map(function (x) { return { n: x.t, v: x.level, w: midW }; }))
      .concat([{ n: after.label + '\n' + after.body, v: after.level, w: edgeW }]);
    var x = 0;
    cells.forEach(function (c) {
      var k = lvl(c.v);
      c.n.split('\n').forEach(function (l, i, arr) {
        s += txt(x + c.w / 2, 42 - (arr.length - 1 - i) * 17, l, { size: 12.5, anchor: 'middle', fill: C.muted });
      });
      s += rect(x, 56, c.w, 62, { fill: fill[k], stroke: k === 1 ? C.sev1ln : (k === 0 ? C.line : fill[k]), r: 6 });
      s += txt(x + c.w / 2, 94, c.v, { size: 12.5, anchor: 'middle', fill: fg[k], weight: 500 });
      x += c.w + gap;
    });
    var bx = edgeW + gap, bw = W - (edgeW + gap) * 2;
    s += '<line x1="' + bx + '" y1="136" x2="' + (bx + bw) + '" y2="136" stroke="' + C.line + '" stroke-width="1.5"/>';
    s += '<line x1="' + bx + '" y1="132" x2="' + bx + '" y2="140" stroke="' + C.line + '" stroke-width="1.5"/>';
    s += '<line x1="' + (bx + bw) + '" y1="132" x2="' + (bx + bw) + '" y2="140" stroke="' + C.line + '" stroke-width="1.5"/>';
    s += txt(bx + bw / 2, 158, '内核：六个环节', { size: 13, anchor: 'middle', fill: C.muted });
    s += txt(edgeW / 2, 158, '外圈', { size: 13, anchor: 'middle', fill: C.muted });
    s += txt(W - edgeW / 2, 158, '外圈', { size: 13, anchor: 'middle', fill: C.muted });
    s += txt(0, 196, '颜色越深表示收得越紧。六个环节自身呈前紧后松，任务前的检索与任务后的表达可以放开。', { size: 13.5, fill: C.muted });
    return wrap(W, H, s);
  };

  /* ── 证据链条（第 36 页）─────────────────────────── */
  F.chain = function (nodes) {
    var W = 1048, H = 244, aw = 40, n = nodes.length;
    var bw = (W - aw * (n - 1)) / n, s = '';
    nodes.forEach(function (nd, i) {
      var x = i * (bw + aw), last = i === n - 1;
      s += rect(x, 20, bw, 168, { fill: last ? '#FBF1EC' : C.white, stroke: last ? C.sev1ln : C.line, r: 12 });
      s += '<rect x="' + x + '" y="20" width="' + bw + '" height="4" rx="2" fill="' + (last ? C.rust : C.slate) + '"/>';
      s += txt(x + 20, 60, nd.t, { size: 17, weight: 700, fill: C.navy, serif: true });
      var cur = '', line = 0;
      nd.d.split('').forEach(function (ch) {
        if (cur.length >= 13) { s += txt(x + 20, 88 + line * 20, cur, { size: 12.5, fill: C.muted }); line++; cur = ch; }
        else cur += ch;
      });
      if (cur) s += txt(x + 20, 88 + line * 20, cur, { size: 12.5, fill: C.muted });
      if (!last) {
        var ax = x + bw + aw / 2;
        s += '<path d="M' + (ax - 9) + ' 104 L' + (ax + 7) + ' 104" stroke="' + C.muted + '" stroke-width="1.5"/>' +
             '<path d="M' + (ax + 2) + ' 99 L' + (ax + 9) + ' 104 L' + (ax + 2) + ' 109 Z" fill="' + C.muted + '"/>';
      }
    });
    s += txt(0, 226, '过程证据具有制度出口，留痕是该链条的入口。', { size: 13.5, fill: C.muted });
    return wrap(W, H, s);
  };

  /* ── 智能体：一段指令 × 每次提问（第 41 页）───── */
  F.agent = function () {
    var W = 1048, H = 244, s = '';
    var bx = 0, bw = 316, by = 30, bh = 128;
    s += rect(bx, by, bw, bh, { fill: '#FBF1EC', stroke: C.sev1ln, r: 12 });
    s += rect(bx, by + 6, 4, bh - 12, { fill: C.rust, r: 2 });
    s += txt(bx + 22, by + 30, '写一次', { size: 12, fill: C.rust, weight: 700, spacing: 1.4 });
    s += txt(bx + 22, by + 64, '预先写好的指令', { size: 22, weight: 700, fill: C.navy, serif: true });
    s += txt(bx + 22, by + 94, '规定身份、只提问、', { size: 13.5, fill: C.muted });
    s += txt(bx + 22, by + 116, '不给结论、最多三条', { size: 13.5, fill: C.muted });

    /* 三次提问 */
    var qx = 398, qw = 250, qy = 8;
    s += txt(qx, qy + 6, '每次提问', { size: 12, fill: C.slate, weight: 700, spacing: 1.4 });
    ['第 1 次：这份方案有什么问题', '第 2 次：这组数据够不够', '第 3 次：这个结论站得住吗'].forEach(function (t, i) {
      var y = qy + 22 + i * 56;
      s += rect(qx, y, qw, 42, { fill: C.white, stroke: C.line, r: 8 });
      s += txt(qx + 14, y + 26, t, { size: 13, fill: C.ink });
      /* 指令框汇入的短横 */
      s += '<path d="M' + (bx + bw + 10) + ' ' + (by + bh / 2) + ' H' + (qx - 30) +
           ' V' + (y + 21) + ' H' + (qx - 8) + '" fill="none" stroke="' + C.sev1ln +
           '" stroke-width="1.5"/>';
      s += '<path d="M' + (qx - 14) + ' ' + (y + 16) + ' L' + (qx - 4) + ' ' + (y + 21) +
           ' L' + (qx - 14) + ' ' + (y + 26) + ' Z" fill="' + C.sev1ln + '"/>';
      /* 提问到返回 */
      s += '<path d="M' + (qx + qw + 8) + ' ' + (y + 21) + ' H' + (qx + qw + 44) +
           '" stroke="' + C.muted + '" stroke-width="1.5"/>';
      s += '<path d="M' + (qx + qw + 38) + ' ' + (y + 16) + ' L' + (qx + qw + 48) + ' ' + (y + 21) +
           ' L' + (qx + qw + 38) + ' ' + (y + 26) + ' Z" fill="' + C.muted + '"/>';
    });
    s += txt(bx + bw + 18, by + bh / 2 - 10, '附在每次提问之前', { size: 12, fill: C.rust });

    var rx = 700, rw = W - rx;
    s += rect(rx, qy + 22, rw, 154, { fill: C.white, stroke: C.line, r: 12 });
    s += txt(rx + 20, qy + 52, '三次返回', { size: 12, fill: C.slate, weight: 700, spacing: 1.4 });
    s += txt(rx + 20, qy + 84, '都只有问题', { size: 20, weight: 700, fill: C.navy, serif: true });
    s += txt(rx + 20, qy + 112, '没有改好的方案，', { size: 13.5, fill: C.muted });
    s += txt(rx + 20, qy + 134, '没有结论，每次至多三条。', { size: 13.5, fill: C.muted });

    s += txt(0, H - 6, '指令写一次，三次对话都受同一段约束。要换用途，只改左边那一段。',
      { size: 13, fill: C.muted });
    return wrap(W, H, s);
  };

  /* ── 环节位置的迷你刻度（案例段每页）──────────── */
  F.stepbar = function (step, levels) {
    var W = 448, H = 34, n = 6, gap = 5;
    var bw = (W - gap * (n - 1)) / n, s = '';
    var fill = [null, C.sev3, C.sev2, C.sev1, C.white];
    for (var i = 0; i < n; i++) {
      var on = i + 1 === step, x = i * (bw + gap);
      var lv = levels[i];
      s += rect(x, on ? 6 : 11, bw, on ? 16 : 8, {
        fill: fill[lv], r: 3,
        stroke: lv === 4 ? C.line : (lv === 3 ? C.sev1ln : fill[lv]), sw: 1 });
      if (on) s += rect(x, 27, bw, 3, { fill: C.rust, r: 1.5 });
    }
    return '<svg class="stepbar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H +
      '" width="' + W + '" height="' + H + '" role="img" aria-hidden="true">' +
      '<style>text{font-family:' + SANS + '}</style>' + s + '</svg>';
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = F; }
  else { root.DECK_FIGURES = F; }
})(typeof globalThis !== 'undefined' ? globalThis : this);
