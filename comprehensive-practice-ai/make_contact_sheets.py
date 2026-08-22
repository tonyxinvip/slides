"""把逐页 PNG 组成便于目视检查的接触表。"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

src = Path(sys.argv[1])
dst = Path(sys.argv[2])
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
rows = int(sys.argv[4]) if len(sys.argv) > 4 else 3
files = sorted(src.glob('*.png'))
if not files:
    raise SystemExit(f'没有 PNG：{src}')
dst.parent.mkdir(parents=True, exist_ok=True)
font = ImageFont.load_default()

with Image.open(files[0]) as first:
    ratio = first.height / first.width
tw = 300
th = round(tw * ratio)
label_h = 22

for start in range(0, len(files), cols * rows):
    batch = files[start:start + cols * rows]
    sheet = Image.new('RGB', (cols * tw, rows * (th + label_h)), 'white')
    draw = ImageDraw.Draw(sheet)
    for offset, file in enumerate(batch):
        image = Image.open(file).convert('RGB')
        image.thumbnail((tw, th))
        x = (offset % cols) * tw
        y = (offset // cols) * (th + label_h)
        sheet.paste(image, (x, y))
        draw.text((x + 5, y + th + 4), file.stem, fill='#172337', font=font)
    number = start // (cols * rows) + 1
    sheet.save(dst.parent / f'{dst.name}-{number:02d}.jpg', quality=88)
print(f'{len(files)} 页，生成 {(len(files) + cols * rows - 1) // (cols * rows)} 张接触表')
