import html,json,re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
talk=json.loads((ROOT/'talk-content.json').read_text())
models=json.loads((ROOT/'slide-layouts.json').read_text())
esc=lambda s:html.escape(str(s),quote=True)
def render(page,lang):
    p=talk['slides'][page];rows=[]
    for e in models[lang][page]['elements']:
        if e.get('role')=='offline-meta':continue
        style=f'left:{e["x"]}px;top:{e["y"]}px;width:{e["w"]}px;height:{e["h"]}px;'
        if e['kind']=='image':
            inner=f'<img src="./assets/{esc(e["asset"])}" alt="{esc(e.get("alt") or p[lang].get("caption") or p[lang]["title"])}" style="object-fit:{e["fit"]};object-position:{esc(e.get("objectPosition","center"))}">'
            if e.get('link'):inner=f'<a href="{esc(e["link"])}" target="_blank" rel="noopener" aria-label="{esc(p[lang]["blocks"][0 if e["asset"].startswith("current") else 1]["title"])}">{inner}</a>'
            rows.append(f'<div class="canvas-elt canvas-image" style="{style}">{inner}</div>')
        elif e['kind']=='rect':
            rows.append(f'<div class="canvas-elt canvas-rule" aria-hidden="true" style="{style}background:{e["color"]}"></div>')
        else:
            role=e.get('role','body');tag='h1' if p['layout']=='cover' and role=='title' else 'h2' if role=='title' else 'h3' if role=='subheading' else 'p'
            style+=f'font-size:{e["size"]}px;font-weight:{700 if e["bold"] else 400};color:{e["color"]};line-height:{e["line"]};text-align:{e.get("align","left")};'
            inner=esc(e['text'])
            if e.get('link'):inner=f'<a href="{esc(e["link"])}">{inner}</a>'
            rows.append(f'<{tag} class="canvas-elt canvas-text role-{role}" style="{style}">{inner}</{tag}>')
    return '\n'.join(rows)

current=(ROOT/'index.html').read_text()
header=current.split('  <main class="deck"')[0]
header=re.sub(r'  <link rel="stylesheet" href="\./(?:short|cases|visual)\.css">\n','',header)
header=header.replace('</head>','  <link rel="stylesheet" href="./visual.css">\n</head>')
header=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="AI agents explained, Guangdong policy, Shenzhen practice, teacher learning and a four-partner research-practice model. 17 slides with a simple English script.">',header)
header=re.sub(r'<title>.*?</title>','<title>From AI Tool Users to AI Agent Creators · 17-slide edition</title>',header)
if 'class="download-link"' not in header:
    header=header.replace('      <div class="language-switcher"','      <a class="download-link" href="./downloads/UNESCO_Teacher_AI_Agents_EN.pptx" download>PowerPoint ↓</a>\n      <a class="download-link" href="./downloads/UNESCO_Teacher_AI_Agents_EN.pdf" download>PDF ↓</a>\n      <div class="language-switcher"')
footer='  <div class="progress">'+current.split('  <div class="progress">',1)[1]
footer=footer.replace('</body>','  <script src="./fit-canvas.js"></script>\n</body>') if './fit-canvas.js' not in footer else footer
sections=[]
for i,p in enumerate(talk['slides']):
    title=p['en']['title'].replace('\n',' ')
    visual_theme='dark' if models['en'][i]['background']=='#10283F' else 'paper'
    sections.append(f'<section class="slide {visual_theme} visual-slide {"is-active" if i==0 else ""}" style="background:{models["en"][i]["background"]}" id="slide-{i+1}" data-title="{esc(title)}" data-seconds="{p["seconds"]}" aria-hidden="{str(i!=0).lower()}"><div class="slide-inner" style="background:{models["en"][i]["background"]}">{render(i,"en")}</div><aside class="speaker-note">{esc(p["note"])}</aside></section>')
(ROOT/'index.html').write_text(header+'  <main class="deck" id="deck" aria-live="polite">\n'+'\n\n'.join(sections)+'\n  </main>\n\n'+footer)
bundles=json.loads((ROOT/'i18n.js').read_text().removeprefix('window.deckTranslations = ').rstrip(';\n'))
for lang,b in bundles.items():
    if 'title' in b['meta']: b['meta']['title']=b['meta']['title'].replace('15-slide','17-slide').replace('15页','17页').replace('15 diapositives','17 diapositives')
    b['slides']=[] if lang=='en' else [dict(title=p[lang]['title'].replace('\n',' '),html=render(i,lang),note=p['note']) for i,p in enumerate(talk['slides'])]
    b['meta']['description']={'en':'17 slides: AI agents, provincial policy, classroom practice, research and partnership.','zh':'17页：教学智能体入门、实践案例、研究与深圳参访邀请。','fr':'17 diapositives : agents pédagogiques, pratique, recherche et invitation à Shenzhen.'}[lang]
(ROOT/'i18n.js').write_text('window.deckTranslations = '+json.dumps(bundles,ensure_ascii=False,indent=2)+';\n')
print('Built 17 slides in English, Chinese and French from the same layout source as the PowerPoint.')
