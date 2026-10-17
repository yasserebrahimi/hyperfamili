from pathlib import Path
import os,json,re,zipfile,hashlib,html,posixpath,shutil,yaml,mistune,bleach,fitz
from PIL import Image
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph
A=Path(__file__).resolve().parents[1]; P=A/'public'; K=P/'knowledge'; K.mkdir(exist_ok=True)
IN=Path(os.environ.get('FAMILI_INPUT_DIR',str(A/'inputs')))
z=zipfile.ZipFile(IN/'HyperFamili_All_Projects_Benchmarks_2026-10-16.zip')
for entry in z.infolist():
 pp=Path(*Path(entry.filename).parts[1:])
 if not pp.parts or entry.is_dir():continue
 dest=K/pp
 assert dest.resolve().is_relative_to(K.resolve())
 dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(z.read(entry))
def reg(path):return json.loads(re.search(r'```json\s*\n(.*?)\n```',(K/path).read_text(),re.S)[1])
b=reg('13-benchmarks-prices/registers/data.md');a=reg('90-registers/atlas-data.md');old=reg(next(K.rglob('research_register.md')).relative_to(K))
norm=lambda s:re.sub(r'\s+',' ',str(s).replace('ي','ی').replace('ك','ک').replace('\u200c',' ').lower()).strip()
md=mistune.create_markdown(escape=True,plugins=['table','strikethrough','url','task_lists'])
allowed=set(bleach.sanitizer.ALLOWED_TAGS)|{'h1','h2','h3','h4','h5','h6','p','br','hr','table','thead','tbody','tr','th','td','pre','code','span','div','img','input','del','details','summary','sup','sub'}
def render(raw,path):
 body=raw.split('---',2)[2]if raw.startswith('---\n')else raw
 body=re.sub(r'(?:filecite|cite)[^]+','〔ارجاع متن اولیه؛ اصل Markdown محفوظ است〕',body)
 s=bleach.clean(md(body),tags=allowed,attributes={'a':['href','title'],'img':['src','alt','title'],'input':['type','checked','disabled'],'*':['class']},protocols={'http','https','mailto'},strip=True)
 def link(m):
  u=html.unescape(m[1]);label=m[2]
  if re.match(r'^(https?:|mailto:)',u):return '<a href="'+html.escape(u,quote=True)+'" target="_blank" rel="noopener noreferrer">'+label+'</a>'
  if u.startswith('#'):return '<span>'+label+'</span>'
  dest=posixpath.normpath(posixpath.join(posixpath.dirname(path),u.split('#')[0]))
  return '<a href="#" data-doc="'+html.escape(dest,quote=True)+'">'+label+'</a>'
 s=re.sub(r'<a href="([^"]*)"[^>]*>(.*?)</a>',link,s,flags=re.S)
 s=re.sub(r'<img[^>]*src="(https?://[^"]+)"[^>]*>',lambda m:'<a href="'+m[1]+'" target="_blank" rel="noopener noreferrer">تصویر منبع — نیازمند اینترنت</a>',s)
 return s
docs=[];lib={}
def add(path,raw,title=None,kind=None,archive=None):
 try:meta=yaml.safe_load(raw.split('---',2)[1])or{} if raw.startswith('---\n')else{}
 except:meta={}
 title=title or meta.get('title')or (re.search(r'^# (.+)',raw,re.M)[1]if re.search(r'^# (.+)',raw,re.M)else Path(path).stem)
 d={'path':path,'title':str(title),'type':kind or meta.get('type','reference'),'archive':archive if archive is not None else path.startswith('legacy/')or'archive' in path or 'register' in path,'bytes':len(raw.encode()),'sha256':hashlib.sha256(raw.encode()).hexdigest()}
 docs.append(d);lib[path]={'raw':raw,'html':render(raw,path),'search':norm(title+' '+raw)}
for f in sorted(K.rglob('*.md')):add(f.relative_to(K).as_posix(),f.read_text())
base=len(docs)
for f in sorted(IN.glob('*.docx')):
 d=Document(f);parts=[]
 for el in d.element.body:
  if el.tag.endswith('}p'):parts.append(Paragraph(el,d).text)
  elif el.tag.endswith('}tbl'):
   rows=[[c.text.replace('\n',' / ').replace('|',' / ') for c in row.cells]for row in Table(el,d).rows]
   if rows:parts.append('\n'+'\n'.join('| '+' | '.join(row)+' |'for row in rows)+'\n')
 raw='# '+f.stem+'\n\n> مرجع مکمل پروژه افق کوروش/گلرنگ؛ نه وضعیت تأییدشده هایپرفامیلی. متن ورودی استخراج شده است و تصاویر و صفحه‌آرایی در اصل سند می‌مانند. اعداد دوباره راستی‌آزمایی نشده‌اند.\n\n'+'\n\n'.join(x for x in parts if x.strip())
 path='supplemental/'+f.stem+'.md';(K/path).parent.mkdir(exist_ok=True);(K/path).write_text(raw);add(path,raw,kind='supporting',archive=True)
for f in sorted(IN.iterdir()):
 if f.is_file()and f.suffix in ['.md','.js','.txt']:
  raw=f.read_text(errors='replace');path='supplemental/'+f.name+(''if f.suffix=='.md'else'.md')
  if f.suffix=='.js':raw='# کد مرجع '+f.name+'\n\n> فقط متن منبع؛ اجرا نمی‌شود.\n\n```javascript\n'+raw+'\n```'
  (K/path).write_text(raw);add(path,raw,kind='supporting',archive=True)
pdf=fitz.open(IN/'هایپرفامیلی14050723(1).pdf');pages=[];media=[]
for i,page in enumerate(pdf):
 pix=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False);name=f'page-{i+1:02}.webp';Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(P/'media'/name,quality=86)
 pages.append({'number':i+1,'image':name,'text':page.get_text()})
 for j,img in enumerate(page.get_images(full=True)):
  xref,w,h=img[0],img[2],img[3]
  if w<200 or h<170:continue
  rects=page.get_image_rects(xref)
  if not rects:continue
  pix=page.get_pixmap(matrix=fitz.Matrix(2,2),clip=rects[0]&page.rect,alpha=False);name=f'figure-{i+1:02}-{j:02}.webp';Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(P/'media'/name,quality=87);media.append({'image':name,'page':i+1,'area':pix.width*pix.height})
raw='# سند مدیر — راهکارهای نوآورانه هایپرفامیلی\n\n'+'\n\n'.join('## صفحه '+str(p['number'])+'\n\n'+p['text']for p in pages);path='supplemental/manager.md';(K/path).write_text(raw);add(path,raw,kind='manager',archive=False)
F={
'marketing':['رسانه و بازاریابی','megaphone','customer'], 'store':['خرید و تجهیزات هوشمند','cart','customer'],'customer':['تجربه و وفاداری مشتری','heart','customer'],'service':['خدمات مکمل','sparkles','customer'],'operations':['عملیات دقیق فروشگاه','scan','employee'],'employee':['کارکنان و منابع انسانی','users','employee'],'management':['مدیریت و تصمیم‌سازی','chart','management'],'energy':['انرژی و تاب‌آوری','bolt','management'],'supply':['انبار و زنجیره تأمین','box','employee'],'business':['درآمدهای تازه','store','management'],'future':['آینده و پژوهش','orbit','management'],'vending':['فامیلی کافه و اسنک','coffee','customer'],'refill':['ایستگاه ریفیل','leaf','customer'],'refill-products':['سبد محصولات ریفیل','bottle','customer'],'platform':['زیرساخت مشترک','layers','management']}
F={k:dict(zip(['title','icon','lead'],v))for k,v in F.items()}
imagePages={'signage':4,'screen':4,'transparent':4,'hologram':4,'audio':4,'gobo':5,'scent':5,'interactive':5,'ar':5,'print':6,'influencer':7,'campaign':8,'esl':10,'cart':11,'checkout':12,'refill':13,'pricechecker':14,'phonecharge':15,'photobooth':16,'rvm':17,'health':18,'cleanrobot':19,'servicerobot':19,'shelf':21,'queue':21,'safety':21,'indoor':22,'payment':23,'energy':25,'coldchain':26,'solar':27,'ess':27,'ev':29,'bike':29,'messaging':31,'sms':32,'ussd':33,'budget':11}
for p in b['projects']:
 p['path']=f"13-benchmarks-prices/projects/{p['id']}-{p['key']}.md";raw=lib[p['path']]['raw']
 m=re.search(r'\| مشتری \| کارکنان \| مدیر \|\n\|[^\n]+\n\| (.*?) \| (.*?) \| (.*?) \|',raw)
 p['perspectives']=dict(zip(['customer','employee','management'],list(m.groups())if m else[p['scope'],p['risk'],p['scope']]))
 p['ideas']=[x for x in old['initiatives']if x['id'] in p['original']]
 p['quotes']=[q['id']for q in b['quotes']if q['key']in p['quote_keys']]
 p['iran']=[s['id']for s in b['sources']if s['key']in p['iran_refs']]
 p['foreign']=[s['id']for s in b['sources']if s['key']in p.get('foreign_refs',[])]
 p['papers']=[x['id']for x in b['papers']if p['key']in x.get('project_keys',[])]
 p['repos']=[x['id']for x in b['repos']if p['key']in x.get('project_keys',[])]
 p['pages']=[int(m['page'])for m in a['manager_topics']if m['id']in p['original']]
 pg=imagePages.get(p['key'],13 if p['family'].startswith('refill')else None);choices=[x for x in media if x['page']==pg];p['image']=max(choices,key=lambda x:x['area'])['image']if choices else None;p['imagePage']=pg
 p['lead']=F[p['family']]['lead'];p['search']=norm(' '.join([p['title'],p['id'],p['key'],p['scope'],p['risk'],F[p['family']]['title']]+p['original']))
 refs=[]
 for o in p['original']:
  refs.extend(d['path']for d in docs if ('/devices/'+o+'-'in d['path'])or('/initiatives/'+o+'-'in d['path']))
 if p['family']=='vending':refs.extend(d['path']for d in docs if d['path'].startswith('11-vending-food-beverage/')and re.match(r'\d\d-',Path(d['path']).name))
 if p['family'].startswith('refill'):refs.extend(d['path']for d in docs if d['path'].startswith('12-refill-reuse/')and re.match(r'\d\d-',Path(d['path']).name))
 refs.extend(d['path']for d in docs if not d['archive']and d['path']!=p['path']and p['id']in lib[d['path']]['raw']and not any(t in d['path']for t in ['MANIFEST','README','quality/']))
 p['docs']=list(dict.fromkeys(refs))
for q in b['quotes']:
 s=next(s for s in b['sources']if s['key']==q['source_key']);q.update({'sourceId':s['id'],'url':s['url'],'market':s['market'],'publisher':s['publisher'],'date':s['checked_on'],'projects':[p['id']for p in b['projects']if q['id']in p['quotes']]})
for c in a['cases']:
 c['sources']=[s['id']for s in a['sources']if s['key']in c['source_keys']];c['projects']=[p['id']for p in b['projects']if c['id']in p['case_ids']];c['search']=norm(' '.join([c['title'],c['organization'],c['fact']]+c['countries']))
paths=json.loads((A/'src/world-paths.json').read_text()) if (A/'src/world-paths.json').exists() else []
try:
 if paths:raise RuntimeError('Use bundled Natural Earth outlines')
 import geopandas as gpd
 geo=gpd.read_file('/opt/pyvenv/lib/python3.13/site-packages/pyogrio/tests/fixtures/naturalearth_lowres/naturalearth_lowres.shp')
 for g in geo.geometry:
  for poly in ([g]if g.geom_type=='Polygon'else g.geoms):paths.append('M'+'L'.join(f'{(x+180)/360*960:.1f},{(83-y)/143*410:.1f}'for x,y in poly.exterior.coords)+'Z')
except Exception:pass
D={'date':b['as_of'],'projects':b['projects'],'cases':a['cases'],'sources':a['sources']+b['sources'],'quotes':b['quotes'],'papers':b['papers'],'repos':b['repos'],'concepts':a['analyst_concepts'],'topics':a['manager_topics'],'models':b['effort_models'],'rates':b['illustrative_rates'],'families':F,'docs':docs,'pages':pages,'media':media,'worldPaths':paths,'baseFiles':base}
(P/'catalog.js').write_text('window.FAMILI_DATA='+json.dumps(D,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';')
(P/'library.js').write_text('window.FAMILI_LIBRARY='+json.dumps(lib,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';')
for f,n in [('HyperFamili_All_Projects_Benchmarks_2026-10-16.zip','research-original.zip'),('HyperFamili_Benchmark_Pricebook_2026-10-16.xlsx','pricebook.xlsx'),('هایپرفامیلی14050723(1).pdf','manager-original.pdf')]:shutil.copyfile(IN/f,P/'downloads'/n)
with zipfile.ZipFile(P/'downloads/supporting-originals.zip','w',zipfile.ZIP_DEFLATED)as zz:
 for f in IN.glob('*.docx'):zz.write(f,f.name)
# Exact-preservation proof: all base files compared byte-for-byte with input archive.
for e in z.infolist():
 pp=Path(*Path(e.filename).parts[1:])
 if pp.parts and not e.is_dir():assert z.read(e)==(K/pp).read_bytes()
summary={'base_files':base,'documents':len(docs),'projects':len(D['projects']),'cases':len(D['cases']),'quotes':len(D['quotes']),'manager_pages':len(pages),'figures':len(media),'preservation':'all input archive bytes verified'}
(A/'docs/coverage.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2));print(summary)
