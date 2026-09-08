(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const deck = $('deck');
  const stage = $('stage');
  const overview = $('overview');
  const notes = $('notes');
  let pages = [];
  let slides = [];
  let current = 0;
  let touch = null;
  const pad = number => String(number).padStart(2, '0');
  const clamp = index => Math.max(0, Math.min(pages.length - 1, index));
  const hashIndex = () => clamp((Number(location.hash.replace(/^#(?:slide-)?/, '')) || 1) - 1);
  const clock = seconds => `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

  function fitCanvas() {
    const bounds = stage.getBoundingClientRect();
    document.documentElement.style.setProperty('--deck-scale', Math.min(bounds.width / 1280, bounds.height / 720));
  }

  function makeElement(element) {
    const node = document.createElement(element.kind === 'image' ? 'img' : 'div');
    node.className = `element element-${element.kind}`;
    for (const [property, value] of Object.entries({left:element.x,top:element.y,width:element.w,height:element.h})) {
      node.style[property] = `${Number(value) || 0}px`;
    }
    if (element.kind === 'text') {
      node.textContent = element.text || '';
      Object.assign(node.style, {
        fontSize: `${element.size || 26}px`,
        color: element.color || '#152A36',
        fontWeight: element.bold ? '700' : '400',
        textAlign: element.align || 'left',
        lineHeight: String(element.lh || 1.35)
      });
    } else if (element.kind === 'rect') {
      node.style.background = element.fill || 'transparent';
      node.setAttribute('aria-hidden', 'true');
    } else if (element.kind === 'image') {
      const source = String(element.src || '');
      node.src = /^(?:\.\/)?assets\//.test(source) ? source : `./assets/${source}`;
      node.alt = element.alt || '';
      node.draggable = false;
      node.style.objectFit = element.fit || 'contain';
    }
    return node;
  }

  function renderPages() {
    const fragment = document.createDocumentFragment();
    pages.forEach((page, index) => {
      const slide = document.createElement('section');
      slide.className = 'slide';
      slide.id = `slide-${index + 1}`;
      slide.setAttribute('aria-roledescription', '幻灯片');
      slide.setAttribute('aria-label', `第 ${index + 1} 页：${page.title}`);
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.setProperty('--slide-background', page.background || '#FFFFFF');
      (page.elements || []).forEach(element => canvas.appendChild(makeElement(element)));
      slide.appendChild(canvas);
      fragment.appendChild(slide);
    });
    deck.replaceChildren(fragment);
    slides = [...deck.children];
  }

  function renderOverview() {
    const fragment = document.createDocumentFragment();
    let lastSection = null;
    let grid = null;
    pages.forEach((page, index) => {
      const section = page.section || '讲座';
      if (section !== lastSection) {
        const group = document.createElement('section');
        group.className = 'overview-section';
        const heading = document.createElement('h2');
        heading.textContent = section;
        grid = document.createElement('div');
        grid.className = 'overview-grid';
        group.append(heading, grid);
        fragment.appendChild(group);
        lastSection = section;
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'overview-item';
      button.dataset.page = String(index);
      const number = document.createElement('span');
      number.className = 'overview-number';
      number.textContent = pad(index + 1);
      const title = document.createElement('span');
      title.className = 'overview-title';
      title.textContent = page.title;
      button.append(number, title);
      button.addEventListener('click', () => { show(index); overview.close(); });
      grid.appendChild(button);
    });
    $('overview-content').replaceChildren(fragment);
  }

  function updateNotes() {
    const page = pages[current];
    $('notes-position').textContent = `第 ${pad(current + 1)} / ${pages.length} 页 · ${page.section || '讲座'}`;
    $('notes-title').textContent = page.title;
    const start = pages.slice(0, current).reduce((sum, item) => sum + Number(item.duration || 0), 0);
    const duration = Number(page.duration || 0);
    $('notes-timing').textContent = duration ? `建议时间 ${clock(start)}–${clock(start + duration)} · 本页 ${duration < 60 ? `${duration} 秒` : `${Math.floor(duration / 60)} 分${duration % 60 ? ` ${duration % 60} 秒` : ''}`}` : '';
    $('notes-content').textContent = page.notes || '本页可结合现场讨论展开。';
  }

  function show(index, updateHash = true) {
    if (!pages.length) return;
    current = clamp(index);
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      slide.inert = i !== current;
    });
    $('page-current').textContent = pad(current + 1);
    $('page-total').textContent = pad(pages.length);
    $('section-name').textContent = pages[current].section || '教师专业发展';
    $('progress-fill').style.width = `${(current + 1) / pages.length * 100}%`;
    $('progress').setAttribute('aria-valuemax', String(pages.length));
    $('progress').setAttribute('aria-valuenow', String(current + 1));
    $('progress').setAttribute('aria-valuetext', `第 ${current + 1} 页，共 ${pages.length} 页`);
    $('announcement').textContent = `第 ${current + 1} 页，共 ${pages.length} 页。${pages[current].title}`;
    document.querySelector('[data-action="previous"]').disabled = current === 0;
    document.querySelector('[data-action="next"]').disabled = current === pages.length - 1;
    document.querySelectorAll('.overview-item').forEach(button => {
      const selected = Number(button.dataset.page) === current;
      button.classList.toggle('is-current', selected);
      if (selected) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    updateNotes();
    if (updateHash) {
      try { history.replaceState(null, '', `#${current + 1}`); }
      catch (_) { location.hash = String(current + 1); }
    }
  }

  function openOverview() {
    if (notes.open) notes.close();
    if (overview.open) return overview.close();
    overview.showModal();
    overview.querySelector('.is-current')?.scrollIntoView({block:'nearest'});
  }

  function openNotes() {
    if (overview.open) overview.close();
    if (notes.open) return notes.close();
    updateNotes();
    notes.showModal();
  }

  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    } catch (_) { /* The browser may require a direct user gesture. */ }
  }

  const actions = {
    previous: () => show(current - 1), next: () => show(current + 1),
    overview: openOverview, notes: openNotes, fullscreen,
    'close-overview': () => overview.close(), 'close-notes': () => notes.close()
  };
  document.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (pages.length && action && actions[action]) actions[action]();
  });
  [overview, notes].forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }));
  document.addEventListener('keydown', event => {
    if (!pages.length || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    if (overview.open || notes.open) return;
    if (['ArrowRight','PageDown',' '].includes(event.key)) {
      if (event.key === ' ' && event.target.closest('button,a')) return;
      event.preventDefault(); show(current + 1);
    } else if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
    else if (event.key === 'Home') { event.preventDefault(); show(0); }
    else if (event.key === 'End') { event.preventDefault(); show(pages.length - 1); }
    else if (event.key.toLowerCase() === 'o') openOverview();
    else if (event.key.toLowerCase() === 'n') openNotes();
    else if (event.key.toLowerCase() === 'f') fullscreen();
  });
  stage.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) { touch = null; return; }
    const point = event.changedTouches[0];
    touch = {x:point.clientX, y:point.clientY};
  }, {passive:true});
  stage.addEventListener('touchend', event => {
    if (!touch || overview.open || notes.open) return;
    const point = event.changedTouches[0];
    const dx = point.clientX - touch.x, dy = point.clientY - touch.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) show(current + (dx < 0 ? 1 : -1));
    touch = null;
  }, {passive:true});
  stage.addEventListener('touchcancel', () => { touch = null; }, {passive:true});
  addEventListener('hashchange', () => show(hashIndex(), false));
  addEventListener('resize', fitCanvas);
  document.addEventListener('fullscreenchange', () => {
    document.querySelector('[data-action="fullscreen"]').textContent = document.fullscreenElement ? '退出全屏' : '全屏';
    fitCanvas();
  });
  if (!document.documentElement.requestFullscreen) document.querySelector('[data-action="fullscreen"]').hidden = true;
  if ('ResizeObserver' in window) new ResizeObserver(fitCanvas).observe(stage);

  async function start() {
    try {
      const embedded = JSON.parse($('deck-data').textContent || '[]');
      if (Array.isArray(embedded) && embedded.length) pages = embedded;
      else {
        const response = await fetch('./slide-layouts.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        pages = await response.json();
      }
      if (!Array.isArray(pages) || !pages.length) throw new Error('Empty presentation');
      renderPages(); renderOverview(); show(hashIndex(), false); fitCanvas();
      $('loading').hidden = true;
      if (document.fonts?.ready) document.fonts.ready.then(fitCanvas);
    } catch (error) {
      $('loading').textContent = '讲座暂时未能打开，请刷新重试，或下载 PPT 查看。';
      console.error('Unable to open presentation:', error);
    }
  }
  start();
})();
