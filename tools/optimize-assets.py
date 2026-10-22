"""Encode runtime art; retain the original sources outside the installable module.

Requires Pillow. Reruns read the archived sources, never a previous WebP encode.
"""
from pathlib import Path
from PIL import Image
import json

root = Path(__file__).resolve().parents[1]
assets = root / 'tarokka-reading' / 'assets'
archive = root / 'backups' / 'asset-sources'
names = [f'cards/common/{suit}-{n}.png' for suit in ('swords', 'stars', 'coins', 'glyphs') for n in range(1, 11)]
names += [f'cards/high/high-{n}.png' for n in range(1, 15)]
names += ['cards/tarokka-back.png', 'madam-eva-seated.png']
names += [f'materials/{name}.png' for name in ('tent-canvas', 'packed-earth', 'aged-oak', 'threadbare-rug')]
before = after = 0
for name in names:
    source = archive / name
    original = assets / name
    if not source.exists():
        source.parent.mkdir(parents=True, exist_ok=True)
        # Both absolute paths must stay within the named source and archive roots.
        assert original.resolve().is_relative_to(assets.resolve())
        assert source.resolve().is_relative_to(archive.resolve())
        source.write_bytes(original.read_bytes())
    output = original.with_suffix('.webp')
    with Image.open(source) as image:
        image.thumbnail((1536, 1536) if name.startswith('cards/') else (1024, 1024), Image.Resampling.LANCZOS)
        image.save(output, 'WEBP', lossless=not name.startswith('materials/'), quality=90, method=6, exact=True)
    before += source.stat().st_size
    after += output.stat().st_size
    if original.exists():
        original.unlink()
# Superseded source art is kept for editing, outside the installable module.
for name in ('madam-eva-cutout.png', 'madam-eva.jpg', 'madam-eva.png', 'materials/walnut.png', 'cards/tarokka-back.jpg'):
    original = assets / name
    source = archive / name
    if original.exists():
        assert original.resolve().is_relative_to(assets.resolve())
        assert source.resolve().is_relative_to(archive.resolve())
        source.parent.mkdir(parents=True, exist_ok=True)
        if not source.exists():
            source.write_bytes(original.read_bytes())
        assert source.read_bytes() == original.read_bytes()
        original.unlink()
print(json.dumps({'files': len(names), 'sourceBytes': before, 'runtimeBytes': after, 'reductionPercent': round(100 * (1 - after / before), 1)}))
