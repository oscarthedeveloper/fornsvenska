# Prepare an isolated pages.dev review copy; never mutate the canonical dist build.
from pathlib import Path
import shutil,json
root=Path('/private/tmp/fornsvenska-cloudflare-upload')
root.mkdir(exist_ok=True)
mapping={'www.fornsvenska.se':'fornsvenska-www.pages.dev',**{f'ord-0{i}.fornsvenska.se':f'fornsvenska-ord-0{i}.pages.dev' for i in range(1,8)}}
for group in [f'ord-0{i}' for i in range(1,8)]+['www']:
 src=Path('dist')/group; dest=root/group
 shutil.copytree(src,dest,dirs_exist_ok=True)
 for p in dest.rglob('*'):
  if not p.is_file() or p.suffix not in ['.html','.js','.json','.txt','.css','.xml'] and p.name not in ['_headers','_redirects']:continue
  text=p.read_text()
  for old,new in mapping.items():text=text.replace(old,new)
  text=text.replace('https://fornsvenska.se','https://fornsvenska-www.pages.dev')
  p.write_text(text)
 with (dest/'_headers').open('a') as f:f.write('\n/*\n  X-Robots-Tag: noindex\n')
 print(group,flush=True)
(root/'mapping.json').write_text(json.dumps(mapping,indent=2))
