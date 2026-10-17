from pathlib import Path
import json,base64,mimetypes,re,sys
R=Path(__file__).resolve().parents[1];P=R/'public';s=(P/'START-HERE.html').read_text()
js=lambda x:x.replace('</script','<\\/script')
media={f.relative_to(P/'media').as_posix():'data:'+mimetypes.guess_type(f.name)[0]+';base64,'+base64.b64encode(f.read_bytes()).decode()for f in (P/'media').rglob('*') if f.suffix in ('.webp','.png')}
files={f.name:{'type':mimetypes.guess_type(f.name)[0]or'application/octet-stream','base64':base64.b64encode(f.read_bytes()).decode()}for f in(P/'downloads').iterdir()if f.name!='supporting-originals.zip'}
css=(P/'app.css').read_text()
embedded_fonts=set()
def embed_font(match):
 font=(P/match.group(2)).resolve()
 if not font.is_relative_to((P/'fonts').resolve()):raise ValueError('Font must be inside public/fonts')
 data=font.read_bytes()
 if data[:4]!=b'wOF2':raise ValueError('Expected a WOFF2 font: '+font.name)
 embedded_fonts.add(font.name)
 return 'url("data:font/woff2;base64,'+base64.b64encode(data).decode()+'")'
css=re.sub(r'''url\(\s*(['"]?)(fonts/[^)'"\s]+\.woff2)\1\s*\)''',embed_font,css)
if embedded_fonts:
 # The single-file distribution carries the font's license with the embedded font.
 css='/*\n'+(P/'fonts'/'OFL.txt').read_text().replace('*/','* /')+'\n*/\n'+css
s=s.replace('<link rel="stylesheet" href="app.css">','<style>'+css+'</style>')
s=s.replace('href="favicon.svg"','href="data:image/svg+xml;base64,'+base64.b64encode((P/'favicon.svg').read_bytes()).decode()+'"')
for f in ['vendor/react.min.js','vendor/react-dom.min.js','catalog.js']:
 s=s.replace('<script src="'+f+'"></script>','<script>'+js((P/f).read_text())+'</script>')
lib=(P/'library.js').read_text().removeprefix('window.FAMILI_LIBRARY=').removesuffix(';');json.loads(lib)
payload='<script>window.FAMILI_MEDIA='+json.dumps(media)+';window.FAMILI_FILES='+json.dumps(files)+';</script><script type="application/json" id="famili-library">'+js(lib)+'</script><script>'+js((P/'app.js').read_text())+'</script>'
s=s.replace('<script src="app.js"></script>',payload)
out=Path(sys.argv[1]) if len(sys.argv)>1 else R/'START-HERE.html';out.write_text(s);print('Standalone',out.stat().st_size,'bytes;',len(media),'images;',len(embedded_fonts),'fonts; documents fully embedded')
