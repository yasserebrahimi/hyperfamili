"""Verify shipped research preservation and references, without network access."""
from pathlib import Path
import base64,hashlib,json,re,zipfile
R=Path(__file__).resolve().parents[1];P=R/'public'
def load(name,prefix):return json.loads((P/name).read_text().removeprefix(prefix).removesuffix(';'))
D=load('catalog.js','window.FAMILI_DATA=');L=load('library.js','window.FAMILI_LIBRARY=')
assert len(D['projects'])==102 and len(D['cases'])==76 and len(D['quotes'])==67
assert len(D['docs'])==len(L)==749
for key in ['projects','cases','quotes','sources']:
 assert len({x['id']for x in D[key]})==len(D[key]),key
ids={s['id']for s in D['sources']};cases={c['id']for c in D['cases']};quotes={q['id']for q in D['quotes']}
for p in D['projects']:
 assert p['path']in L,p['id'];assert set(p['case_ids'])<=cases;assert set(p['quotes'])<=quotes
 assert set(p['iran']+p['foreign'])<=ids
 for ref in p.get('foreign_refs',[]):
  matches=[s['id'] for s in D['sources'] if s['id'].lower()==ref.lower() or s.get('key')==ref]
  assert matches and any(x in p['foreign'] for x in matches),(p['id'],ref)
 assert set(p['perspectives'])=={'management','employee','customer'}
 for path in p['docs']:assert path in L,path
for d in D['docs']:
 assert hashlib.sha256(L[d['path']]['raw'].encode()).hexdigest()==d['sha256'],d['path']
 assert (P/'knowledge'/d['path']).is_file(),d['path']
for c in D['cases']:
 assert set(c['sources'])<=ids
 assert c['path'] in L
for q in D['quotes']:assert q['sourceId']in ids
for k,m in D['models'].items():
 assert sum(x[1]for x in m['wbs'])==m['low_hours'];assert sum(x[2]for x in m['wbs'])==m['high_hours']
with zipfile.ZipFile(P/'downloads/research-original.zip')as z:
 count=0
 for e in z.infolist():
  rel=Path(*Path(e.filename).parts[1:])
  if not rel.parts or e.is_dir():continue
  assert z.read(e)==(P/'knowledge'/rel).read_bytes(),str(rel);count+=1
 for name,key in [('13-benchmarks-prices/registers/data.md','quotes')]:
  txt=(P/'knowledge'/name).read_text();o=json.loads(re.search(r'```json\s*\n(.*?)\n```',txt,re.S)[1]);qmap={q['id']:q for q in D[key]}
  for original in o[key]:assert all(qmap[original['id']][k]==v for k,v in original.items()),original['id']
media=list((P/'media').glob('*.webp'))
original_media=[m for m in media if m.name.startswith(('page-','figure-'))]
assert len(original_media)==80
concept_media=[m for m in media if m not in original_media]
assert {m.name for m in concept_media}=={'vision-market.webp','vision-cafe.webp','brand-market.webp','brand-cafe.webp'}
for asset in concept_media:
 provenance=json.loads(asset.with_suffix('.provenance.json').read_text())
 assert provenance['asset']==asset.name
 assert 'Concept visualization' in provenance['status']
 assert provenance['sha256']==hashlib.sha256(asset.read_bytes()).hexdigest()
 assert provenance['bytes']==asset.stat().st_size
# Check the shipped web bundle; local build dependencies are not distributed fonts.
font_path='fonts/Vazirmatn.woff2';font_hash='4e3fa217d38fdafc1fea4414ceb58ca5e662cf0ab5fa735a8c8c20e8b42cad92'
font_files={p.relative_to(P).as_posix() for p in P.rglob('*') if 'node_modules' not in p.parts and p.suffix.lower() in {'.ttf','.otf','.woff','.woff2'}}
assert font_files=={font_path},font_files
font=(P/font_path).read_bytes();assert font[:4]==b'wOF2'
assert hashlib.sha256(font).hexdigest()==font_hash,'Vazirmatn bytes differ from upstream v33.003'
license_text=(P/'fonts/OFL.txt').read_text()
assert hashlib.sha256((P/'fonts/OFL.txt').read_bytes()).hexdigest()=='17e355067c8284f47743a1ee3b1ef7ff684ff0601eda357f9353b10b3016ab31'
assert 'SIL OPEN FONT LICENSE Version 1.1' in license_text
assert 'Copyright 2015 The Vazirmatn Project Authors' in license_text
assert 'Saber Rastikerdar' in (P/'fonts/AUTHORS.txt').read_text()
font_faces=lambda css:re.findall(r'@font-face\s*\{([^}]*)\}',css,re.S)
css_urls=lambda css:re.findall(r'''url\(\s*['"]?([^)'"\s]+)['"]?\s*\)''',css)
for css_path in [R/'src/style.css',P/'app.css']:
 faces=font_faces(css_path.read_text());assert len(faces)==1,css_path
 assert re.search(r'''font-family\s*:\s*['"]?Vazirmatn['"]?\s*;''',faces[0])
 assert css_urls(faces[0])==[font_path],css_path
 assert re.search(r'font-weight\s*:\s*100\s+900\s*;',faces[0])
standalone=(R/'START-HERE.html').read_text()
standalone_css='\n'.join(re.findall(r'<style[^>]*>(.*?)</style>',standalone,re.S))
faces=font_faces(standalone_css);assert len(faces)==1
urls=css_urls(faces[0]);assert len(urls)==1 and urls[0].startswith('data:font/woff2;base64,')
assert base64.b64decode(urls[0].split(',',1)[1],validate=True)==font,'Standalone font bytes differ'
assert not any(re.search(r'\.(?:ttf|otf|woff2?)(?:[?#]|$)',u,re.I) for u in css_urls(standalone_css)),'Standalone still references a font file URL'
assert license_text in standalone_css,'Standalone font license is missing'
identity=json.loads((P/'media/brand-identity.json').read_text())
embedded_media=json.loads(re.search(r'window.FAMILI_MEDIA=(.*?);window.FAMILI_FILES=',standalone,re.S)[1])
for key in ['logo','swatch']:
 asset=P/'media'/identity[key]
 assert hashlib.sha256(asset.read_bytes()).hexdigest()==identity[key+'_sha256']
 assert base64.b64decode(embedded_media[asset.name].split(',',1)[1],validate=True)==asset.read_bytes()
assert identity['css_srgb']=='#02b1c5'
# Presentation-only spelling repairs keep all archived research and source media intact.
corrections_file=P/'media/corrections.json'
corrected=[]
if corrections_file.exists():
 corrections=json.loads(corrections_file.read_text())
 corrected=corrections['edits']
 assert len({x['original'] for x in corrected})==len(corrected)
 app=(P/'app.js').read_text()
 resolver=json.loads(re.search(r'window.FAMILI_MEDIA_CORRECTIONS=(.*?);',app)[1])
 assert resolver=={x['original']:x['corrected'] for x in corrected}
 for edit in corrected:
  original=P/'media'/edit['original'];derivative=P/'media'/edit['corrected']
  assert hashlib.sha256(original.read_bytes()).hexdigest()==edit['original_sha256']
  assert hashlib.sha256(derivative.read_bytes()).hexdigest()==edit['sha256']
  assert base64.b64decode(embedded_media[edit['corrected']].split(',',1)[1],validate=True)==derivative.read_bytes()

report={'spelling_corrected_display_images':len(corrected),'spelling_corrections_embedded':bool(corrected),'brand_identity_originals_unchanged':True,'brand_identity_standalone_embedded':True,'status':'PASS' ,'projects':102,'cases':76,'quotes':67,'documents':len(L),'original_archive_files_byte_identical':count,'images_and_page_renders':len(media),'original_images_and_page_renders':len(original_media),'generated_concept_images_with_provenance':len(concept_media),'price_fields_unchanged':True,'reference_integrity':True,'markdown_sha256_verified':True,'wbs_arithmetic':True,'font_files_bundled':True,'font':{'family':'Vazirmatn','version':'33.003','file':font_path,'sha256':font_hash,'license':'SIL Open Font License 1.1','license_file':'fonts/OFL.txt','authors_file':'fonts/AUTHORS.txt','source':'https://github.com/rastikerdar/vazirmatn/tree/v33.003','standalone_byte_identical':True,'standalone_license_embedded':True,'standalone_font_network_requests_required':False}}
(R/'docs/integrity.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
