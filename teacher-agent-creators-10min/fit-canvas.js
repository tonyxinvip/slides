(() => {
  const fit = () => {
    // Keep the content clear of the toolbar and slide controls on any screen.
    const scale = Math.min(innerWidth / 1280, Math.max(240, innerHeight - 58) / 720);
    document.body.style.setProperty('--deck-scale', String(scale));
  };
  addEventListener('resize', fit);
  addEventListener('orientationchange', fit);
  fit();
})();
