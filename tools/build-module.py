"""Package the standalone Foundry module, without the workspace or test dependencies."""
from pathlib import Path
import json
import hashlib
import shutil
import zipfile

root = Path(__file__).resolve().parents[1]
module = root / 'tarokka-reading'
manifest_path = module / 'module.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
version = manifest['version']
output = root / 'build' / f'tarokka-reading-{version}.zip'
assert manifest['download'].endswith(f'/v{version}/{output.name}'), 'Download URL must match the packaged version'
output.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(module.rglob('*')):
        if path.is_file():
            archive.write(path, path.relative_to(root).as_posix())
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert json.loads(archive.read('tarokka-reading/module.json')) == manifest
shutil.copyfile(manifest_path, output.parent / 'module.json')
assets = [output.parent / 'module.json', output]
(output.parent / 'SHA256SUMS.txt').write_text(''.join(
    f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n' for path in assets
), encoding='utf-8')
print(f'{output} ({output.stat().st_size:,} bytes)')
