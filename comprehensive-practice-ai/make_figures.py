"""把 figures.js 生成的 SVG 栅格化成 PNG，供 build_pptx.js 嵌入。
   在讲座页面的浏览器上下文里渲染，字体与网页版一致。
   用法：python3 make_figures.py   （需要仓库根目录起一个静态服务在 8795）"""
from playwright.sync_api import sync_playwright
import pathlib, json, sys

OUT = pathlib.Path(__file__).parent / "figures"
OUT.mkdir(exist_ok=True)
PORT = sys.argv[1] if len(sys.argv) > 1 else "8795"
SCALE = 3          # 3 倍图，投影与打印都够

# 按版式查找页面，页码变动不影响
BY = "(S.find(x=>x.layout==='%s'))"
CALLS = {
  "coverage": "FIG.coverage()",
  "overlap":  "FIG.overlap()",
  "impact":   "FIG.impact(%s.rows)" % (BY % "bars"),
  "scale":    "FIG.scale(%s.before, %s.stages, %s.after)" % ((BY % "shape",) * 3),
  "chain":    "FIG.chain(%s.nodes)" % (BY % "chainflow"),
  "agent":    "FIG.agent()",
}

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=SCALE)
    pg.goto(f"http://localhost:{PORT}/comprehensive-practice-ai/")
    pg.wait_for_timeout(2500)          # 等 Google Fonts 落位
    pg.evaluate("""() => {
        const h = document.createElement('div');
        h.id = 'figbox';
        h.style.cssText = 'position:fixed;left:0;top:0;background:transparent;z-index:99999;padding:0';
        document.body.appendChild(h);
        document.getElementById('stage').style.display = 'none';
        document.body.style.background = 'transparent';
    }""")
    meta = {}
    for name, call in CALLS.items():
        dims = pg.evaluate(f"""() => {{
            const FIG = window.DECK_FIGURES, S = window.DECK_SLIDES;
            const svg = {call};
            const box = document.getElementById('figbox');
            box.innerHTML = svg;
            const el = box.querySelector('svg');
            return [+el.getAttribute('width'), +el.getAttribute('height')];
        }}""")
        pg.wait_for_timeout(120)
        pg.locator("#figbox svg").screenshot(path=str(OUT / f"{name}.png"), omit_background=True)
        meta[name] = {"w": dims[0], "h": dims[1]}
        print(f"  {name}.png  {dims[0]}×{dims[1]}")
    (OUT / "meta.json").write_text(json.dumps(meta, indent=1), encoding="utf-8")
    b.close()
print("图示已生成 →", OUT)
