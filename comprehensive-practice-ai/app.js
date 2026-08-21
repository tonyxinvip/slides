(function () {
  'use strict';
  var S = window.DECK_SLIDES || [], FIG = window.DECK_FIGURES || {};
  var deck = document.getElementById('deck');
  if (!deck || !S.length) { document.body.innerHTML = '<p class="fatal">演讲数据未能载入，请刷新页面。</p>'; return; }

  var SECTIONS = {
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
  var ORDER = Object.keys(SECTIONS);

  var e = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };

  var eyebrow = function (s) { return '<p class="eyebrow">' + e(s.sec) + '　·　' + e(SECTIONS[s.sec] || '') + '</p>'; };
  var head    = function (s) { return s.title ? '<h1 class="head">' + e(s.title) + '</h1>' : ''; };
  var top     = function (s) { return eyebrow(s) + head(s); };
  var src     = function (t) { return t ? '<p class="src">' + e(t) + '</p>' : ''; };
  var foot    = function (t) { return t ? '<p class="foot">' + e(t) + '</p>' : ''; };
  var kick    = function (t) { return t ? '<p class="kicker">' + e(t) + '</p>' : ''; };

  var LEVELS = S.filter(function (x) { return x.layout === 'stage'; })
    .sort(function (a, b) { return a.step - b.step; })
    .map(function (x) { return x.levelIdx; });

  var R = {
    cover: function (s) {
      return '<p class="eyebrow">' + e(s.kicker) + '</p><h1 class="head">' + e(s.title) + '</h1>' +
        '<p class="csub">' + e(s.sub) + '</p>' +
        '<div class="chainrow">' + s.chain.map(function (c, i) {
          return '<span>' + e(c) + '</span>' + (i < s.chain.length - 1 ? '<i></i>' : ''); }).join('') + '</div>' +
        '<div class="cmeta">' + s.meta.map(function (m) {
          return '<span><small>' + e(m[0]) + '</small><b>' + e(m[1]) + '</b></span>'; }).join('') + '</div>';
    },
    factfile: function (s) {
      return top(s) + '<p class="factname">' + e(s.fact.name) + '</p>' +
        '<div class="factrows">' + s.fact.rows.map(function (r) {
          return '<div><p class="k">' + e(r[0]) + '</p><p class="v">' + e(r[1]) + '</p></div>'; }).join('') + '</div>' +
        '<p class="factnote">' + e(s.note) + '</p>';
    },
    quotecards: function (s) {
      return top(s) + '<p class="quote">' + e(s.quote) + '</p>' + src(s.src) +
        '<div class="g6 mt">' + s.cards.map(function (c) {
          return '<div class="card"><p class="k cap">' + e(c[0]) + '</p><h4 style="font-size:16px;margin-top:6px">' +
            e(c[1]) + '</h4></div>'; }).join('') + '</div>' + foot(s.foot);
    },
    fourfour: function (s) {
      return top(s) + '<div class="g2 mt">' + s.groups.map(function (g) {
        return '<div><p class="glabel">' + e(g.label) + '</p>' +
          g.items.map(function (i) { return '<div class="gitem">' + e(i) + '</div>'; }).join('') + '</div>'; }).join('') +
        '</div>' + src(s.src);
    },
    coverage:  function (s) { return top(s) + FIG.coverage(); },
    statement: function (s) {
      return head(s) + '<p class="big">' + e(s.big) + '</p>' + (s.sub ? '<p class="ssub">' + e(s.sub) + '</p>' : '');
    },
    twoplans: function (s) {
      return top(s) + '<div class="plans">' + s.plans.map(function (p, i) {
        return '<div class="plan' + (i ? ' b' : '') + '"><p class="tag">' + e(p.tag) + '</p>' +
          p.lines.map(function (l) { return '<p>' + e(l) + '</p>'; }).join('') + '</div>'; }).join('') + '</div>' +
        '<p class="ask">' + e(s.ask) + '</p>';
    },
    reveal: function (s) { return top(s) + R._pts(s.points) + foot(s.kicker); },
    bridge: function (s) { return top(s) + R._pts(s.points); },
    _pts: function (pts) {
      return '<ul class="pts">' + pts.map(function (p, i) {
        return '<li><span class="k">' + (i + 1) + '</span><span class="v">' + e(p) + '</span></li>'; }).join('') + '</ul>';
    },
    problems: function (s) {
      return top(s) + '<div class="probs">' + s.items.map(function (i, k) {
        return '<div class="prob"><b>' + pad(k + 1) + '</b><span>' + e(i) + '</span></div>'; }).join('') + '</div>';
    },
    bars:    function (s) { return top(s) + FIG.impact(s.rows) + foot(s.foot); },
    overlay: function (s) { return top(s) + FIG.overlap() + '<p class="kicker">' + e(s.conclusion) + '</p>'; },
    evidence: function (s) {
      return top(s) + '<div class="study"><p class="claim">' + e(s.study.claim) + '</p>' +
        s.study.rows.map(function (r) {
          return '<div class="srow"><span class="k">' + e(r[0]) + '</span><span class="v">' + e(r[1]) + '</span></div>'; }).join('') +
        '</div>' + src(s.study.src) + foot(s.caveat);
    },
    counter: function (s) {
      return top(s) + '<div class="study warn">' + s.study.rows.map(function (r) {
          return '<div class="srow"><span class="k">' + e(r[0]) + '</span><span class="v">' + e(r[1]) + '</span></div>'; }).join('') +
        '<p class="term">' + e(s.study.term) + '</p></div>' + src(s.study.src) +
        '<ul class="bounds">' + s.bounds.map(function (b) { return '<li>' + e(b) + '</li>'; }).join('') + '</ul>' + foot(s.caveat);
    },
    tri: function (s) {
      return top(s) + '<div class="tri">' + s.cols.map(function (c) {
        return '<div class="tricol ' + c.tone + '"><p class="head">' + e(c.head) + '</p>' +
          c.items.map(function (i) { return '<li>' + e(i) + '</li>'; }).join('') + '</div>'; }).join('') + '</div>';
    },
    threebad: function (s) {
      var tone = ['', ' mid', ' rust'];
      return top(s) + '<div class="g3 mt">' + s.items.map(function (i, k) {
        return '<div class="card' + tone[k] + '"><h4>' + e(i.t) + '</h4><p>' + e(i.d) + '</p></div>'; }).join('') + '</div>' +
        src(s.src) + foot(s.kicker);
    },
    threeq: function (s) {
      return top(s) + '<div class="qs">' + s.items.map(function (i) {
        return '<div class="q"><span class="no">' + e(i.no) + '</span><span><span class="qt">' + e(i.q) + '</span>' +
          (i.then ? '<span class="qthen">' + e(i.then) + '</span>' : '') + '</span></div>'; }).join('') +
        '</div>' + foot(s.kicker);
    },
    blankgrid: function (s) {
      var h = '<div class="grid"><div class="gh"></div>';
      s.cols.forEach(function (c) { h += '<div class="gh">' + e(c) + '</div>'; });
      s.rows.forEach(function (r) { h += '<div class="gr">' + e(r) + '</div><div></div><div></div><div></div>'; });
      return top(s) + h + '</div>' + foot(s.foot);
    },
    shape: function (s) {
      return top(s) + FIG.scale(s.before, s.stages, s.after) +
        '<p class="kicker">' + e(s.conclusion) + '</p>' +
        '<p class="cap" style="margin-top:12px">' + e(s.counter) + '</p>';
    },
    twotasks: function (s) {
      return top(s) + '<div class="tasks">' + s.tasks.map(function (t, i) {
        return '<div class="task' + (i ? ' b' : '') + '"><p class="tn">' + e(t.name) + '</p>' +
          '<p class="tg">' + e(t.grade) + '　·　' + e(t.hours) + '</p><p class="tr">' + e(t.req) + '</p><ol>' +
          t.steps.map(function (x) { return '<li>' + e(x) + '</li>'; }).join('') + '</ol></div>'; }).join('') +
        '</div>' + foot(s.foot);
    },
    stage: function (s) {
      return eyebrow(s) +
        '<div class="stagehead"><h1 class="head">' + e(s.title) + '</h1>' +
        '<span class="stagelevel L' + s.levelIdx + '">' + e(s.level) + '</span>' +
        '<span class="stepwrap">' + FIG.stepbar(s.step, LEVELS) +
        '<i>六个环节的收放形态　第 ' + s.step + ' 步</i></span></div>' +
        '<div class="stagemain"><div class="twocol">' +
          '<div class="sc"><p class="n">' + e(s.left.name) + '</p><p class="b2">' + e(s.left.body) + '</p></div>' +
          '<div class="sc b"><p class="n">' + e(s.right.name) + '</p><p class="b2">' + e(s.right.body) + '</p></div>' +
        '</div><p class="rule">' + e(s.rule) + '</p></div>' +
        '<div class="extra' + (s.extra.tone === 'alert' ? ' alert' : '') + '"><p class="el">' + e(s.extra.label) + '</p>' +
        '<p class="et">' + e(s.extra.text) + '</p></div>';
    },
    twoscales: function (s) {
      return top(s) + '<div class="scales">' + s.cases.map(function (c, i) {
        return '<div class="scale' + (i ? ' b' : '') + '"><p class="sn">' + e(c.name) + '</p>' +
          '<p class="sg">' + e(c.grade) + '　·　' + e(c.hours) + '</p><p class="ss">' + e(c.scale) + '</p>' +
          '<p class="sd">' + e(c.detail) + '</p></div>'; }).join('') + '</div>' + foot(s.kicker);
    },
    tracktable: function (s) {
      var h = '<div class="track">';
      s.cols.forEach(function (c) { h += '<div class="th">' + e(c) + '</div>'; });
      s.sample.forEach(function (c) { h += '<div class="td">' + e(c) + '</div>'; });
      return top(s) + h + '</div>' + foot(s.kicker);
    },
    chainflow: function (s) { return top(s) + FIG.chain(s.nodes) + '<p class="kicker">' + e(s.local) + '</p>'; },
    redlines: function (s) {
      return top(s) + '<div class="red">' + s.items.map(function (i) {
        return '<div class="redrow"><span class="k">' + e(i.t) + '</span><span class="v">' + e(i.d) + '</span></div>'; }).join('') +
        '</div>' + (s.kicker ? '<p class="kicker" style="margin-top:16px;font-size:17px">' + e(s.kicker) + '</p>' : '') +
        src(s.src) + foot(s.caveat);
    },
    signature: function (s) {
      return top(s) + '<div class="subj">' + s.subjects.map(function (x) { return '<span>' + e(x) + '</span>'; }).join('') + '</div>' +
        '<p class="absent">' + e(s.absent) + '</p>' +
        '<div class="split">' + s.split.map(function (p) {
          return '<div><p class="sk">' + e(p[0]) + '</p><p class="sv">' + e(p[1]) + '</p></div>'; }).join('') + '</div>';
    },
    toolpos: function (s) {
      var h = '<div class="tp"><div class="th"></div>';
      s.cols.forEach(function (c) { h += '<div class="th">' + e(c) + '</div>'; });
      s.rows.forEach(function (r) {
        h += '<div class="tn">' + e(r.t) + '</div><div class="ty">' + e(r.yes) + '</div><div class="tno">' + e(r.no) + '</div>';
      });
      return top(s) + h + '</div>' + foot(s.kicker);
    },
    threedo: function (s) {
      return top(s) + '<div class="qs">' + s.items.map(function (i) {
        return '<div class="q"><span class="no">' + e(i.no) + '</span><span><span class="qh">' + e(i.t) + '</span>' +
          '<span class="qd">' + e(i.d) + '</span></span></div>'; }).join('') + '</div>' + foot(s.kicker);
    },
    uses: function (s) {
      return top(s) + '<p class="cap" style="margin-top:2px;font-size:15px">' + e(s.lead) + '</p>' +
        '<div class="uses">' + s.items.map(function (i) {
          return '<div class="use"><p class="ut">' + e(i.t) + '</p><p class="uh">' + e(i.how) + '</p>' +
            '<p class="uo"><b>产出</b>　' + e(i.out) + '</p></div>'; }).join('') + '</div>' + foot(s.foot);
    },
    specs: function (s) {
      return top(s) + '<p class="cap" style="margin-top:2px;font-size:15px">' + e(s.lead) + '</p>' +
        '<div class="partkey">' + s.parts.map(function (p, k) {
          return '<span class="pk sg' + (k + 1) + '"><b>' + e(p.n) + '</b>' + e(p.t) +
            '<i>' + e(p.d) + '</i></span>'; }).join('') + '</div>' +
        '<div class="speclist">' + s.specs.map(function (i) {
          return '<div class="specitem"><p class="spk">' + e(i.k) + '</p><p class="spv">' +
            i.seg.map(function (g, k) { return '<span class="sg' + (k + 1) + '">' + e(g) + '</span>'; }).join('') +
            '</p></div>'; }).join('') + '</div>' + foot(s.foot);
    },
    allow: function (s) {
      return top(s) + '<p class="cap" style="margin-top:2px;font-size:15px">' + e(s.lead) + '</p>' +
        '<div class="allow">' + s.items.map(function (i) {
          return '<div class="al"><p class="alt">' + e(i.t) + '</p><p class="ala">' + e(i.act) + '</p>' +
            '<p class="alr"><b>约束</b>　' + e(i.lim) + '</p>' +
            '<p class="alk"><b>留痕</b>　' + e(i.rec) + '</p></div>'; }).join('') + '</div>' + foot(s.foot);
    },
    exchange: function (s) {
      return top(s) + '<p class="cap" style="margin-top:2px;font-size:15px">' + e(s.lead) + '</p>' +
        '<div class="turns">' + s.turns.map(function (t) {
          var body = t.items
            ? '<span class="rets">' + t.items.map(function (i) {
                return '<span class="ret' + (i.ok ? '' : ' no') + '"><span class="rn">' + e(i.no) + '</span>' +
                  '<span class="rm">' + (i.ok ? '√' : '×') + '</span>' +
                  '<span class="rt">' + e(i.t) + '</span></span>'; }).join('') + '</span>'
            : '<span class="txt">' + e(t.text) + '</span>';
          return '<div class="turn ' + t.tone + '"><span class="who">' + e(t.who) + '</span>' +
            body + '</div>'; }).join('') + '</div>' +
        (s.legend ? '<p class="cap" style="margin-top:10px;font-size:13px">' + e(s.legend) + '</p>' : '') +
        foot(s.foot);
    },
    agentspec: function (s) {
      return top(s) + '<p class="cap" style="margin-top:2px;font-size:15px">' + e(s.lead) + '</p>' +
        FIG.agent() +
        '<div class="spec agspec"><p class="lbl">可直接照抄的指令</p><p>' + e(s.spec) + '</p></div>' +
        foot(s.after);
    },
    apxcover: function (s) {
      return top(s) + '<p class="cap" style="margin-top:2px;font-size:15px">' + e(s.lead) + '</p>' +
        '<div class="apxlist">' + s.items.map(function (i) {
          return '<div class="apxrow"><span class="ax-t">' + e(i.t) + '</span>' +
            '<span class="ax-k">' + e(i.task) + '</span>' +
            '<span class="ax-g">' + e(i.grade) + '</span>' +
            '<span class="ax-p">' + e(i.p) + '</span></div>'; }).join('') + '</div>' +
        '<p class="apxdims">' + e(s.dims) + '</p>' + foot(s.caveat);
    },
    apxtask: function (s) {
      return eyebrow(s) + '<p class="apxtheme">' + e(s.theme) + '</p>' +
        '<h1 class="head apxhead">' + e(s.title) + '</h1>' +
        '<div class="apxmeta">' + s.meta.map(function (m) {
          return '<span><b>' + e(m[0]) + '</b>　' + e(m[1]) + '</span>'; }).join('') + '</div>' +
        '<div class="apxreq"><p class="lbl">任务要求（附件原文）</p><p>' + e(s.req) + '</p></div>' +
        '<div class="apxsteps"><p class="lbl">实施建议（附件原文）</p><ol>' +
          s.steps.map(function (x) { return '<li>' + e(x) + '</li>'; }).join('') + '</ol></div>' +
        '<p class="cap apxsrc">' + e(s.src) + '</p>' + foot(s.foot);
    },
    apxflow: function (s) {
      var h = '<div class="apxflow"><div class="fh">环节</div><div class="fh">学生须自行完成</div>' +
        '<div class="fh">AI 可承担</div>';
      s.rows.forEach(function (r) {
        h += '<div class="fs"><span class="fn">' + e(r.stage) + '</span>' +
          '<span class="fl L' + r.levelIdx + '">' + e(r.level) + '</span></div>' +
          '<div class="fd">' + e(r.self) + '</div><div class="fd fa">' + e(r.ai) + '</div>';
      });
      return eyebrow(s) + '<p class="apxtheme">' + e(s.theme) + '</p>' +
        '<h1 class="head apxhead sm">' + e(s.title) + '</h1>' + h + '</div>' + foot(s.foot);
    },
    apxrule: function (s) {
      return eyebrow(s) + '<p class="apxtheme">' + e(s.theme) + '</p>' +
        '<h1 class="head apxhead sm">' + e(s.title) + '</h1>' +
        '<div class="red apxred">' + s.limits.map(function (i) {
          return '<div class="redrow"><span class="k">' + e(i.t) + '</span><span class="v">' + e(i.d) + '</span></div>'; }).join('') +
        '</div>' +
        '<p class="apxtrack"><b>留痕</b>　' + e(s.track) + '</p>' +
        '<div class="spec apxspec"><p class="lbl">教师侧可直接照抄的指令</p><p>' + e(s.spec) + '</p></div>';
    },
    endnote: function (s) {
      return '<p class="takelbl">' + e(s.take.label) + '</p>' +
        '<div class="takes">' + s.take.items.map(function (i) {
          return '<div class="take"><span class="tkt">' + e(i.t) + '</span>' +
            '<span class="tkp">' + e(i.p) + '</span></div>'; }).join('') + '</div>' +
        '<ul class="endlines">' + s.lines.map(function (l) { return '<li>' + e(l) + '</li>'; }).join('') + '</ul>' +
        '<p class="sign">' + e(s.sign) + '</p><p class="handout">' + e(s.handout) + '</p>';
    }
  };

  var chrome =
    '<div class="spine" id="spine">' + ORDER.map(function (_, i) {
      return '<i style="top:' + (i / (ORDER.length - 1) * 100) + '%"></i>'; }).join('') + '</div>' +
    '<div class="phase-label" id="phase"></div>' +
    '<div class="chrome-foot"><span class="pageno" id="pageno"></span><span class="tiermark" id="tiermark"></span></div>';

  deck.innerHTML = chrome + S.map(function (s) {
    var body = R[s.layout] ? R[s.layout](s) : top(s) + '<p class="body">缺少版式：' + e(s.layout) + '</p>';
    var cls = 'slide' + (s.layout === 'cover' ? ' cover' : '') + (s.layout === 'statement' ? ' statement' : '') +
      (s.layout.indexOf('apx') === 0 ? ' apx' : '');
    return '<section class="' + cls + '" data-n="' + s.n + '">' + body + '</section>';
  }).join('');

  var nodes = [].slice.call(deck.querySelectorAll('.slide'));
  var ticks = [].slice.call(document.querySelectorAll('#spine i'));
  var phase = document.getElementById('phase'), pageno = document.getElementById('pageno');
  var tiermark = document.getElementById('tiermark');
  var hud = document.getElementById('hud'), notes = document.getElementById('notes'), help = document.getElementById('help');
  var cur = Math.max(0, (parseInt(location.hash.slice(1), 10) || 1) - 1);

  function fit() { deck.style.transform = 'scale(' + Math.min(innerWidth / 1280, innerHeight / 720) + ')'; }
  function show(i) {
    cur = Math.max(0, Math.min(nodes.length - 1, i));
    nodes.forEach(function (n, k) { n.classList.toggle('is-active', k === cur); });
    var s = S[cur], si = ORDER.indexOf(s.sec);
    ticks.forEach(function (t, k) {
      t.className = k < si ? 'done' : (k === si ? 'on' : '');
    });
    phase.innerHTML = s.sec.split('').map(function (ch) { return '<span>' + e(ch) + '</span>'; }).join('');
    pageno.innerHTML = '<b>' + pad(cur + 1) + '</b> / ' + nodes.length;
    tiermark.textContent = s.tier === '附' ? '附录' : s.tier + ' 档';
    hud.textContent = pad(cur + 1) + ' / ' + pad(nodes.length) + '　' + s.sec;
    notes.innerHTML = '<p class="nh">讲稿 · 第 ' + (cur + 1) + ' 页</p>' + e(s.notes);
    document.title = (cur + 1) + '/' + nodes.length + ' · 做中学与综合实践活动';
    try { history.replaceState(null, '', '#' + (cur + 1)); } catch (x) {}
  }
  addEventListener('resize', fit);
  addEventListener('keydown', function (ev) {
    var k = ev.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { ev.preventDefault(); show(cur + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { ev.preventDefault(); show(cur - 1); }
    else if (k === 'Home') show(0);
    else if (k === 'End') show(nodes.length - 1);
    else if (k === 'n' || k === 'N') notes.classList.toggle('on');
    else if (k === '?' || k === 'h') help.classList.toggle('on');
    else if (k === 'f' || k === 'F') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); }
    else if (k === 'Escape') { notes.classList.remove('on'); help.classList.remove('on'); }
  });
  addEventListener('click', function (ev) { show(ev.clientX > innerWidth * 0.55 ? cur + 1 : cur - 1); });
  fit(); show(cur);
})();
