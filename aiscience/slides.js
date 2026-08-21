(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  const currentNumber = document.getElementById('current-number');
  const totalNumber = document.getElementById('total-number');
  const overview = document.getElementById('overview');
  const overviewGrid = document.getElementById('overview-grid');
  const notes = document.getElementById('notes');
  const notesContent = document.getElementById('notes-content');
  const help = document.getElementById('help-dialog');
  const knowledgeDialogs = [...document.querySelectorAll('.knowledge-dialog')];
  const prev = document.querySelector('[data-action="prev"]');
  const next = document.querySelector('[data-action="next"]');
  let current = 0;
  let touchX = 0;
  let touchY = 0;
  let knowledgeReturnFocus = null;
  const clamp = (n) => Math.min(Math.max(n, 0), slides.length - 1);
  const pad = (n) => String(n).padStart(2, '0');
  const fromHash = () => clamp((Number(location.hash.replace(/\D/g, '')) || 1) - 1);

  function updateNotes() {
    notesContent.textContent = slides[current].querySelector('.speaker-note')?.textContent.trim() || '本页没有备注。';
  }

  function show(index, updateHash = true) {
    knowledgeDialogs.forEach((dialog) => { if (dialog.open) dialog.close(); });
    current = clamp(index);
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.classList.toggle('is-before', i < current);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
      if (active) slide.scrollTop = 0;
    });
    currentNumber.textContent = pad(current + 1);
    totalNumber.textContent = pad(slides.length);
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    updateNotes();
    if (updateHash) history.replaceState(null, '', `#${current + 1}`);
    document.title = current === 0
      ? 'AI赋能小学科学教与学'
      : `${slides[current].dataset.title} · AI赋能小学科学教与学`;
  }

  function toggleOverview(force) {
    overview.hidden = !(typeof force === 'boolean' ? force : overview.hidden);
    if (!overview.hidden) overview.querySelector('button')?.focus();
  }

  function toggleNotes(force) {
    notes.hidden = !(typeof force === 'boolean' ? force : notes.hidden);
    if (!notes.hidden) updateNotes();
  }

  function activeKnowledgeDialog() {
    return knowledgeDialogs.find((dialog) => dialog.open) || null;
  }

  function openKnowledge(id, trigger) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    knowledgeDialogs.forEach((item) => { if (item.open) item.close(); });
    toggleNotes(false);
    knowledgeReturnFocus = trigger;
    dialog.showModal();
  }

  function closeKnowledge(dialog) {
    if (dialog?.open) dialog.close();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (_) {
      // Some embedded browsers block fullscreen. The presentation remains usable.
    }
  }

  slides.forEach((slide, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    const series = slide.dataset.seriesTitle
      ? `<em>${slide.dataset.seriesLabel} · ${slide.dataset.seriesTitle} · ${slide.dataset.seriesStep}</em>`
      : '';
    button.classList.toggle('is-case', Boolean(slide.dataset.seriesTitle));
    button.innerHTML = `<span>${pad(i + 1)}</span><strong>${slide.dataset.title}</strong>${series}`;
    button.addEventListener('click', () => { show(i); toggleOverview(false); });
    overviewGrid.appendChild(button);
  });

  function act(action) {
    if (action === 'next') show(current + 1);
    if (action === 'prev') show(current - 1);
    if (action === 'overview') toggleOverview();
    if (action === 'overview-close') toggleOverview(false);
    if (action === 'fullscreen') toggleFullscreen();
    if (action === 'notes') toggleNotes();
    if (action === 'notes-close') toggleNotes(false);
    if (action === 'help') help.showModal();
  }

  document.addEventListener('click', (event) => {
    const knowledgeOpen = event.target.closest('[data-knowledge-open]');
    if (knowledgeOpen) {
      openKnowledge(knowledgeOpen.dataset.knowledgeOpen, knowledgeOpen);
      return;
    }
    const knowledgeClose = event.target.closest('[data-knowledge-close]');
    if (knowledgeClose) {
      closeKnowledge(knowledgeClose.closest('.knowledge-dialog'));
      return;
    }
    if (event.target.matches('.knowledge-dialog')) {
      const bounds = event.target.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
        && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!inside) closeKnowledge(event.target);
      return;
    }
    const target = event.target.closest('[data-action]');
    if (target) act(target.dataset.action);
  });

  knowledgeDialogs.forEach((dialog) => {
    dialog.addEventListener('close', () => {
      if (knowledgeReturnFocus?.isConnected) knowledgeReturnFocus.focus();
      knowledgeReturnFocus = null;
    });
  });

  document.addEventListener('keydown', (event) => {
    if (help.open) return;
    if (activeKnowledgeDialog()) return;
    if (!overview.hidden && event.key === 'Escape') return toggleOverview(false);
    if (!notes.hidden && event.key === 'Escape') return toggleNotes(false);
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
    else if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
    else if (event.key === 'Home') show(0);
    else if (event.key === 'End') show(slides.length - 1);
    else if (event.key.toLowerCase() === 'o') toggleOverview();
    else if (event.key.toLowerCase() === 'f') toggleFullscreen();
    else if (event.key.toLowerCase() === 'n') toggleNotes();
    else if (event.key === '?') help.showModal();
  });

  document.addEventListener('touchstart', (e) => {
    if (activeKnowledgeDialog()) return;
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (activeKnowledgeDialog()) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  addEventListener('hashchange', () => show(fromHash(), false));
  show(fromHash(), false);
})();
