"""Embed the slide data so index.html also works without a local web server."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent
pages = json.loads((ROOT / 'slide-layouts.json').read_text(encoding='utf-8'))
if not isinstance(pages, list) or not pages:
    raise ValueError('slide-layouts.json must contain a nonempty array of slides')
data = json.dumps(pages, ensure_ascii=False, separators=(',', ':'))
data = data.replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
target = ROOT / 'index.html'
source = target.read_text(encoding='utf-8')
pattern = r'(<script id="deck-data" type="application/json">).*?(</script>)'
source, count = re.subn(pattern, lambda match: match[1] + data + match[2], source, count=1, flags=re.S)
if count != 1:
    raise ValueError('index.html is missing its deck-data container')
target.write_text(source, encoding='utf-8')
print(f'Embedded {len(pages)} slides in index.html')
