const data = JSON.parse(document.getElementById("slides-data").textContent);
const cards = [...document.querySelectorAll(".deck-card")];
const filters = [...document.querySelectorAll(".filter-button")];
const search = document.getElementById("search");
const empty = document.getElementById("empty-state");
let activeTag = "all";

function applyFilter() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const tags = card.dataset.tags.split("|");
    const matchesTag = activeTag === "all" || tags.includes(activeTag);
    const matchesQuery = !query || card.dataset.search.includes(query);
    const show = matchesTag && matchesQuery;
    card.hidden = !show;
    if (show) visible += 1;
  });
  empty.hidden = visible > 0;
}

filters.forEach((button) => button.addEventListener("click", () => {
  activeTag = button.dataset.tag;
  filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  applyFilter();
}));
search.addEventListener("input", applyFilter);

const orbit = document.querySelector(".hero-orbit");
if (orbit && matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)").matches) {
  orbit.addEventListener("pointermove", (event) => {
    const bounds = orbit.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    orbit.querySelectorAll(".signal-card").forEach((card, index) => {
      const depth = 10 + index * 6;
      card.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
  orbit.addEventListener("pointerleave", () => orbit.querySelectorAll(".signal-card").forEach((card) => { card.style.translate = "0 0"; }));
}

const canvas = document.getElementById("sky");
const context = canvas.getContext("2d");
let points = [];
function resize() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  points = Array.from({ length: Math.min(54, Math.floor(innerWidth / 24)) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.4 + .3 }));
  draw();
}
function draw() {
  context.clearRect(0, 0, innerWidth, innerHeight);
  points.forEach((point, index) => {
    context.fillStyle = index % 7 === 0 ? "rgba(194,85,47,.7)" : "rgba(125,211,252,.65)";
    context.beginPath(); context.arc(point.x, point.y, point.r, 0, Math.PI * 2); context.fill();
    for (let next = index + 1; next < points.length; next += 1) {
      const other = points[next]; const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 120) {
        context.strokeStyle = `rgba(125,211,252,${.09 * (1 - distance / 120)})`;
        context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke();
      }
    }
  });
}
addEventListener("resize", resize, { passive: true });
resize();

document.documentElement.dataset.deckCount = String(data.length);
