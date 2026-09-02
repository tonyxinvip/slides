const filtersRoot = document.getElementById("filters");
const search = document.getElementById("search");
const grid = document.getElementById("deck-grid");
const empty = document.getElementById("empty-state");
const loadError = document.getElementById("load-error");
const seriesFeature = document.getElementById("series");
const seriesGrid = document.getElementById("series-grid");
const updated = document.getElementById("site-updated");

const filterDefinitions = [
  { label: "全部", type: "all", value: "all" },
  { label: "AI Native 系列", type: "series", value: "ai-native-field-notes" },
  { label: "Agentic AI", type: "tag", value: "Agentic AI" },
  { label: "Education", type: "tag", value: "Education" },
  { label: "Research", type: "tag", value: "Research" },
  { label: "Teacher AI", type: "tag", value: "Teacher AI" },
  { label: "AI Learning", type: "tag", value: "AI Learning" },
  { label: "Robotics", type: "tag", value: "Robotics" },
  { label: "Organization", type: "tag", value: "Organization" }
];

let decks = [];
let activeFilter = filterDefinitions[0];

function normalize(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\-_./·:：—–]+/g, "");
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  }[character]));
}

function dateKey(value) {
  const match = String(value || "").match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  return match ? `${match[1]}-${match[2] || "12"}-${match[3] || "31"}` : "0000-01-01";
}

function todayInShanghai() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date()).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function accessLabel(access) {
  if (access === "public") return "公开";
  if (access === "presentation-lock") return "演示限制";
  return "受限";
}

function eventDateLabel(deck) {
  return deck.eventDateLabel || deck.eventDate || deck.publishedAt;
}

function searchableText(deck) {
  return normalize([
    deck.title,
    deck.eyebrow,
    deck.summary,
    deck.series,
    deck.eventVenue,
    ...(deck.tags || []),
    ...(deck.searchAliases || [])
  ].join(" "));
}

function renderCard(deck, index, section) {
  const tags = (deck.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const published = escapeHtml(deck.publishedAt);
  const eventDate = escapeHtml(deck.eventDate || deck.publishedAt);
  return `<article class="deck-card" data-slug="${escapeHtml(deck.slug)}" data-section="${section}" data-search="${searchableText(deck)}">
    <a class="deck-cover" href="./${escapeHtml(deck.slug)}/" aria-label="打开 ${escapeHtml(deck.title)}">
      <img src="${escapeHtml(deck.cover)}" alt="${escapeHtml(deck.title)}封面" width="1600" height="900">
      <span class="deck-number">${String(index + 1).padStart(2, "0")} / ${String(decks.length).padStart(2, "0")}</span>
      <span class="access-badge">${accessLabel(deck.access)}</span>
    </a>
    <div class="deck-content">
      <p class="deck-eyebrow">${escapeHtml(deck.eyebrow)}</p>
      <div class="deck-title-row"><h3>${escapeHtml(deck.title)}</h3><i aria-hidden="true">↗</i></div>
      <p class="deck-summary">${escapeHtml(deck.summary)}</p>
      <div class="deck-event">
        <time datetime="${eventDate}"><small>${escapeHtml(deck.eventKind)}日期</small><b>${escapeHtml(eventDateLabel(deck))}</b></time>
        <span><small>举办地点</small><b>${escapeHtml(deck.eventVenue)}</b></span>
      </div>
      <div class="deck-meta"><span><b>${deck.slideCount}</b> 张</span><span><b>${deck.durationMinutes}</b> 分钟</span><span>${escapeHtml(deck.author)}</span><span><b>${published}</b> 发布</span></div>
      <div class="deck-tags">${tags}</div>
    </div>
  </article>`;
}

function renderSeries() {
  const entries = decks.filter((deck) => deck.seriesId === "ai-native-field-notes").sort((a, b) => a.episode - b.episode);
  if (!entries.length) return;
  seriesGrid.innerHTML = entries.map((deck) => `<a class="series-item" href="./${escapeHtml(deck.slug)}/">
    <span>${String(deck.episode).padStart(2, "0")}</span>
    <small>${escapeHtml(deck.eventDate)}</small>
    <b>${escapeHtml(deck.title)}</b>
    <i aria-hidden="true">↗</i>
  </a>`).join("");
  seriesFeature.hidden = false;
}

function renderFilters() {
  filtersRoot.innerHTML = filterDefinitions.map((filter, index) => `<button class="filter-button" type="button" data-filter-index="${index}" aria-pressed="${index === 0}">${filter.label}</button>`).join("");
  filtersRoot.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter-index]");
    if (!button) return;
    activeFilter = filterDefinitions[Number(button.dataset.filterIndex)];
    filtersRoot.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    applyFilter();
  });
}

function matchesFilter(deck) {
  if (activeFilter.type === "all") return true;
  if (activeFilter.type === "series") return deck.seriesId === activeFilter.value;
  const target = normalize(activeFilter.value);
  return (deck.tags || []).some((tag) => normalize(tag).includes(target));
}

function applyFilter() {
  const query = normalize(search.value);
  const counts = { upcoming: 0, completed: 0 };
  let visible = 0;
  grid.querySelectorAll("article.deck-card").forEach((card) => {
    const deck = decks.find((item) => item.slug === card.dataset.slug);
    const show = matchesFilter(deck) && (!query || card.dataset.search.includes(query));
    card.hidden = !show;
    if (show) {
      visible += 1;
      counts[card.dataset.section] += 1;
    }
  });
  grid.querySelectorAll(".deck-section-title").forEach((heading) => {
    const count = counts[heading.dataset.section];
    heading.hidden = count === 0;
    heading.querySelector("small").textContent = `${count} 项`;
  });
  seriesFeature.hidden = Boolean(query) || activeFilter.type !== "all";
  empty.hidden = visible > 0;
}

function renderGallery() {
  const today = todayInShanghai();
  const entries = decks.map((deck, index) => ({ deck, index, date: dateKey(deck.eventDate || deck.publishedAt) }));
  const upcoming = entries.filter((entry) => entry.date > today).sort((a, b) => a.date.localeCompare(b.date) || a.index - b.index);
  const completed = entries.filter((entry) => entry.date <= today).sort((a, b) => b.date.localeCompare(a.date) || a.index - b.index);
  const ordered = [...upcoming, ...completed];
  const position = new Map(ordered.map((entry, index) => [entry.deck.slug, index]));
  const section = (title, name, entriesInSection) => {
    if (!entriesInSection.length) return "";
    return `<h2 class="deck-section-title" data-section="${name}"><span>${title}</span><small>${entriesInSection.length} 项</small></h2>${entriesInSection.map((entry) => renderCard(entry.deck, position.get(entry.deck.slug), name)).join("")}`;
  };
  grid.innerHTML = section("即将进行", "upcoming", upcoming) + section("往期演讲", "completed", completed);
  grid.setAttribute("aria-busy", "false");
}

function updatePublicationDate() {
  const latest = decks.map((deck) => deck.publishedAt).filter(Boolean).sort().at(-1);
  updated.textContent = latest || "—";
  if (latest) updated.setAttribute("datetime", latest);
}

async function loadGallery() {
  try {
    const response = await fetch("./decks.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
    decks = await response.json();
    renderFilters();
    renderSeries();
    renderGallery();
    updatePublicationDate();
    search.addEventListener("input", applyFilter);
    document.documentElement.dataset.deckCount = String(decks.length);
  } catch (error) {
    console.error(error);
    grid.setAttribute("aria-busy", "false");
    loadError.hidden = false;
  }
}

const orbit = document.querySelector(".hero-orbit");
if (orbit && matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)").matches) {
  orbit.addEventListener("pointermove", (event) => {
    const bounds = orbit.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    orbit.querySelectorAll(".signal-card").forEach((card, index) => {
      const depth = 10 + index * 6;
      card.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
  orbit.addEventListener("pointerleave", () => orbit.querySelectorAll(".signal-card").forEach((card) => { card.style.translate = "0 0"; }));
}

const canvas = document.getElementById("sky");
const context = canvas?.getContext("2d");
let points = [];
function resizeSky() {
  if (!canvas || !context) return;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  points = Array.from({ length: Math.min(54, Math.floor(innerWidth / 24)) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.4 + 0.3 }));
  drawSky();
}
function drawSky() {
  if (!context) return;
  context.clearRect(0, 0, innerWidth, innerHeight);
  points.forEach((point, index) => {
    context.fillStyle = index % 7 === 0 ? "rgba(194,85,47,.7)" : "rgba(125,211,252,.65)";
    context.beginPath(); context.arc(point.x, point.y, point.r, 0, Math.PI * 2); context.fill();
    for (let next = index + 1; next < points.length; next += 1) {
      const other = points[next];
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 120) {
        context.strokeStyle = `rgba(125,211,252,${0.09 * (1 - distance / 120)})`;
        context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke();
      }
    }
  });
}
addEventListener("resize", resizeSky, { passive: true });
resizeSky();
loadGallery();
