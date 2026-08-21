(function () {
  'use strict';
  var S = window.DECK_SLIDES || [];
  var deck = document.getElementById('deck');
  if (!deck || !S.length) { document.body.innerHTML = '<p class="fatal">演讲数据未能载入，请刷新页面。</p>'; return; }

  var e = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var lv = function (t) {
    if (t === '收') return 'L1';
    if (t === '半收' || t.indexOf('采集') === 0) return 'L2';
    if (t === '半放') return 'L3';
    return 'L4';
  };
  var title = function (s) { return s.title ? '<h2 class="t">' + e(s.title) + '</h2>' : ''; };
  var src   = function (t) { return t ? '<p class="src">' + e(t) + '</p>' : ''; };
  var foot  = function (t) { return t ? '<p class="foot">' + e(t) + '</p>' : ''; };
  var kick  = function (t) { return t ? '<p class="kicker">' + e(t) + '</p>' : ''; };

  var R = {
    cover: function (s) {
      return '<p class="eyebrow">' + e(s.kicker) + '</p><h1>' + e(s.title) + '</h1>' +
        '<p class="csub">' + e(s.sub) + '</p>' +
        '<div class="chain">' + s.chain.map(function (c, i) {
          return '<span class="node">' + e(c) + '</span>' + (i < s.chain.length - 1 ? '<i class="link"></i>' : ''); }).join('') + '</div>' +
        '<div class="cmeta">' + s.meta.map(function (m) {
          return '<span><small>' + e(m[0]) + '</small><b>' + e(m[1]) + '</b></span>'; }).join('') + '</div>';
    },
    factfile: function (s) {
      return title(s) + '<p class="factname">' + e(s.fact.name) + '</p>' +
        '<div class="factrows">' + s.fact.rows.map(function (r) {
          return '<div><p class="k">' + e(r[0]) + '</p><p class="v">' + e(r[1]) + '</p></div>'; }).join('') + '</div>' +
        '<p class="factnote">' + e(s.note) + '</p>';
    },
    quotecards: function (s) {
      return title(s) + '<p class="quote">' + e(s.quote) + '</p>' + src(s.src) +
        '<div class="cards" style="grid-template-columns:repeat(6,1fr)">' + s.cards.map(function (c) {
          return '<div class="card"><p class="k">' + e(c[0]) + '</p><p class="v">' + e(c[1]) + '</p></div>'; }).join('') + '</div>' +
        foot(s.foot);
    },
    timeline: function (s) {
      return title(s) + '<div class="timeline">' + s.nodes.map(function (n) {
        return '<div class="tl"><span class="y">' + e(n[0]) + '</span><span class="d">' + e(n[1]) + '</span></div>'; }).join('') + '</div>';
    },
    fourfour: function (s) {
      return title(s) + '<div class="groups">' + s.groups.map(function (g) {
        return '<div class="group"><p class="glabel">' + e(g.label) + '</p><ul>' +
          g.items.map(function (i) { return '<li>' + e(i) + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div>' + src(s.src);
    },
    coverage: function (s) {
      var side = function (o) {
        return '<div><p class="glabel">' + e(o.label) + '</p>' + o.items.map(function (i) {
          var k = i.on === true ? 'on' : (i.on === 'part' ? 'part' : 'off');
          return '<div class="covitem' + (k === 'off' ? ' isoff' : '') + '"><span class="dot ' + k + '"></span>' +
            '<span><span class="t">' + e(i.t) + '</span><span class="w">' + e(i.why) + '</span></span></div>'; }).join('') + '</div>';
      };
      return title(s) + '<div class="cov">' + side(s.left) + side(s.right) + '</div>';
    },
    statement: function (s) {
      return title(s) + '<p class="big">' + e(s.big) + '</p>' + (s.sub ? '<p class="ssub">' + e(s.sub) + '</p>' : '');
    },
    twoplans: function (s) {
      return title(s) + '<div class="plans">' + s.plans.map(function (p) {
        return '<div class="plan"><p class="tag">' + e(p.tag) + '</p>' +
          p.lines.map(function (l) { return '<p>' + e(l) + '</p>'; }).join('') + '</div>'; }).join('') + '</div>' +
        '<p class="ask">' + e(s.ask) + '</p>';
    },
    reveal: function (s) {
      return title(s) + '<ul class="pts">' + s.points.map(function (p, i) {
        return '<li><b>' + (i + 1) + '</b><span>' + e(p) + '</span></li>'; }).join('') + '</ul>' + foot(s.kicker);
    },
    bars: function (s) {
      var h = '<div class="chart">';
      s.rows.forEach(function (r) {
        h += '<div class="brow"><span class="bname">' + e(r.name) + '</span>' +
             '<span class="bar s' + r.level + '">' + e(r.label) + '</span></div>';
        if (r.why) h += '<div class="bwhy"><span></span><span>' + e(r.why) + '</span></div>';
      });
      return title(s) + h + '</div>' + foot(s.foot);
    },
    overlay: function (s) {
      var box = function (o) {
        return '<div class="ovbox"><p class="glabel">' + e(o.label) + '</p>' +
          o.items.map(function (i) { return '<li>' + e(i) + '</li>'; }).join('') + '</div>';
      };
      return title(s) + '<div class="ov">' + box(s.a) + box(s.b) + '</div>' +
        '<p class="ovconc">' + e(s.conclusion) + '</p>';
    },
    bridge: function (s) {
      return title(s) + '<ul class="pts">' + s.points.map(function (p, i) {
        return '<li><b>' + (i + 1) + '</b><span>' + e(p) + '</span></li>'; }).join('') + '</ul>';
    },
    problems: function (s) {
      return title(s) + '<div class="probs">' + s.items.map(function (i, k) {
        return '<div class="prob"><b>' + pad(k + 1) + '</b><span>' + e(i) + '</span></div>'; }).join('') + '</div>';
    },
    evidence: function (s) {
      return title(s) + '<div class="study"><p class="claim">' + e(s.study.claim) + '</p>' +
        s.study.rows.map(function (r) {
          return '<div class="srow"><span class="k">' + e(r[0]) + '</span><span class="v">' + e(r[1]) + '</span></div>'; }).join('') +
        '</div>' + src(s.study.src) + foot(s.caveat);
    },
    tri: function (s) {
      return title(s) + '<div class="tri">' + s.cols.map(function (c) {
        return '<div class="tricol ' + c.tone + '"><p class="head">' + e(c.head) + '</p>' +
          c.items.map(function (i) { return '<li>' + e(i) + '</li>'; }).join('') + '</div>'; }).join('') + '</div>';
    },
    threebad: function (s) {
      return title(s) + '<div class="trio">' + s.items.map(function (i) {
        return '<div class="box"><p class="bt">' + e(i.t) + '</p><p class="bd">' + e(i.d) + '</p></div>'; }).join('') + '</div>' +
        src(s.src) + foot(s.kicker);
    },
    counter: function (s) {
      return title(s) + '<div class="study">' + s.study.rows.map(function (r) {
          return '<div class="srow"><span class="k">' + e(r[0]) + '</span><span class="v">' + e(r[1]) + '</span></div>'; }).join('') +
        '<p class="term">' + e(s.study.term) + '</p></div>' + src(s.study.src) +
        '<ul class="bounds">' + s.bounds.map(function (b) { return '<li>' + e(b) + '</li>'; }).join('') + '</ul>' +
        foot(s.caveat);
    },
    threeq: function (s) {
      return title(s) + '<div class="qs">' + s.items.map(function (i) {
        return '<div class="q"><span class="no">' + e(i.no) + '</span><span class="qt">' + e(i.q) + '</span></div>'; }).join('') + '</div>' +
        foot(s.kicker);
    },
    blankgrid: function (s) {
      var h = '<div class="grid"><div class="gh"></div>';
      s.cols.forEach(function (c) { h += '<div class="gh">' + e(c) + '</div>'; });
      s.rows.forEach(function (r) { h += '<div class="gr">' + e(r) + '</div><div></div><div></div><div></div>'; });
      return title(s) + h + '</div>' + foot(s.foot);
    },
    shape: function (s) {
      var col = function (name, text, cls, edge) {
        return '<div class="scol' + (edge ? ' edge' : '') + '"><p class="sname">' + e(name) + '</p>' +
          '<div class="slev ' + cls + '">' + e(text) + '</div></div>';
      };
      var h = '<div class="shape">';
      h += col(s.before.label + '\n' + s.before.body, s.before.level, 'L4', true);
      s.stages.forEach(function (st) { h += col(st.t, st.level, lv(st.level), false); });
      h += col(s.after.label + '\n' + s.after.body, s.after.level, 'L4', true);
      h += '</div><p class="shconc">' + e(s.conclusion) + '</p><p class="shcounter">' + e(s.counter) + '</p>';
      return title(s) + h;
    },
    twotasks: function (s) {
      return title(s) + '<div class="tasks">' + s.tasks.map(function (t) {
        return '<div class="task"><p class="tn">' + e(t.name) + '</p><p class="tg">' + e(t.grade) + ' · ' + e(t.hours) + '</p>' +
          '<p class="tr">' + e(t.req) + '</p><ol>' + t.steps.map(function (x) { return '<li>' + e(x) + '</li>'; }).join('') + '</ol></div>'; }).join('') +
        '</div>' + foot(s.foot);
    },
    stage: function (s) {
      return '<div class="stagehead"><h2 class="t">' + e(s.title) + '</h2>' +
        '<span class="stagelevel L' + s.levelIdx + '">' + e(s.level) + '</span></div>' +
        '<div class="stagemain"><div class="twocol">' +
          '<div class="sc"><p class="n">' + e(s.left.name) + '</p><p class="b">' + e(s.left.body) + '</p></div>' +
          '<div class="sc"><p class="n">' + e(s.right.name) + '</p><p class="b">' + e(s.right.body) + '</p></div>' +
        '</div><p class="rule">' + e(s.rule) + '</p></div>' +
        '<div class="extra' + (s.extra.tone === 'alert' ? ' alert' : '') + '"><p class="el">' + e(s.extra.label) + '</p>' +
        '<p class="et">' + e(s.extra.text) + '</p></div>';
    },
    twoscales: function (s) {
      return title(s) + '<div class="scales">' + s.cases.map(function (c) {
        return '<div class="scale"><p class="sn">' + e(c.name) + '</p><p class="sg">' + e(c.grade) + ' · ' + e(c.hours) + '</p>' +
          '<p class="ss">' + e(c.scale) + '</p><p class="sd">' + e(c.detail) + '</p></div>'; }).join('') + '</div>' + foot(s.kicker);
    },
    tracktable: function (s) {
      var h = '<div class="track">';
      s.cols.forEach(function (c) { h += '<div class="th">' + e(c) + '</div>'; });
      s.sample.forEach(function (c) { h += '<div class="td">' + e(c) + '</div>'; });
      return title(s) + h + '</div>' + foot(s.kicker);
    },
    chainflow: function (s) {
      var h = '<div class="flow">';
      s.nodes.forEach(function (n, i) {
        h += '<div class="fnode"><p class="ft">' + e(n.t) + '</p><p class="fd">' + e(n.d) + '</p></div>';
        if (i < s.nodes.length - 1) h += '<div class="farrow">→</div>';
      });
      return title(s) + h + '</div><p class="local">' + e(s.local) + '</p>';
    },
    redlines: function (s) {
      return title(s) + '<div class="red">' + s.items.map(function (i) {
        return '<div class="redrow"><span class="k">' + e(i.t) + '</span><span class="v">' + e(i.d) + '</span></div>'; }).join('') + '</div>' +
        src(s.src) + foot(s.caveat);
    },
    signature: function (s) {
      return title(s) + '<div class="subj">' + s.subjects.map(function (x) { return '<span>' + e(x) + '</span>'; }).join('') + '</div>' +
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
      return title(s) + h + '</div>' + foot(s.kicker);
    },
    threedo: function (s) {
      return title(s) + '<div class="qs">' + s.items.map(function (i) {
        return '<div class="q"><span class="no">' + e(i.no) + '</span><span><span class="qh">' + e(i.t) + '</span>' +
          '<span class="qd">' + e(i.d) + '</span></span></div>'; }).join('') + '</div>' + foot(s.kicker);
    },
    endnote: function (s) {
      return '<ul class="endlines">' + s.lines.map(function (l) { return '<li>' + e(l) + '</li>'; }).join('') + '</ul>' +
        '<p class="handout">' + e(s.handout) + '</p>';
    }
  };

  deck.innerHTML = S.map(function (s) {
    var body = R[s.layout] ? R[s.layout](s) : '<h2 class="t">' + e(s.title) + '</h2><p class="body">缺少版式：' + e(s.layout) + '</p>';
    var cls = 'slide' + (s.layout === 'cover' ? ' cover' : '') + (s.layout === 'statement' ? ' statement' : '');
    return '<section class="' + cls + '" data-n="' + s.n + '"><span class="slide-tag">' + pad(s.n) + ' · ' + s.tier + '</span>' + body + '</section>';
  }).join('');

  var nodes = [].slice.call(deck.querySelectorAll('.slide'));
  var bar = document.querySelector('#bar i'), hud = document.getElementById('hud');
  var notes = document.getElementById('notes'), help = document.getElementById('help');
  var cur = Math.max(0, (parseInt(location.hash.slice(1), 10) || 1) - 1);

  function fit() {
    var k = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    deck.style.transform = 'scale(' + k + ')';
  }
  function show(i) {
    cur = Math.max(0, Math.min(nodes.length - 1, i));
    nodes.forEach(function (n, k) { n.classList.toggle('is-active', k === cur); });
    hud.textContent = pad(cur + 1) + ' / ' + pad(nodes.length) + '　' + S[cur].sec;
    bar.style.width = ((cur + 1) / nodes.length * 100) + '%';
    notes.innerHTML = '<p class="nh">讲稿 · 第 ' + (cur + 1) + ' 页</p>' + e(S[cur].notes);
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
  addEventListener('click', function (ev) { if (ev.clientX > innerWidth * 0.55) show(cur + 1); else show(cur - 1); });
  fit(); show(cur);
})();
