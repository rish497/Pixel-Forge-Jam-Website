"""Validate public-page SEO and local HTML assets. Run: python scripts/verify-seo.py"""
import json,re,sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
BASE='https://pixelforgejam.org'
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.tags=[];self.jsonld=[];self.capture=False;self.data='';self.h1=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags.append((tag,a))
  if tag=='h1':self.h1+=1
  if tag=='script' and a.get('type')=='application/ld+json':self.capture=True;self.data=''
 def handle_data(self,data):
  if self.capture:self.data+=data
 def handle_endtag(self,tag):
  if tag=='script' and self.capture:self.jsonld.append(json.loads(self.data));self.capture=False

def audit():
 errors=[];warnings=[];rows=[];sitemap=ET.parse(ROOT/'sitemap.xml');urls=[e.text for e in sitemap.findall('{*}url/{*}loc')]
 for image in sitemap.findall('.//{http://www.google.com/schemas/sitemap-image/1.1}loc'):
  if not (ROOT/unquote(urlsplit(image.text).path).lstrip('/')).is_file():errors.append('Missing image sitemap asset: '+image.text)
 for url in urls:
  route=urlsplit(url).path;file=ROOT/route.lstrip('/')/'index.html';p=Page();source=file.read_text(encoding='utf-8');p.feed(source)
  metas={a.get('name',a.get('property')):a.get('content','') for t,a in p.tags if t=='meta'}
  canon=[a.get('href') for t,a in p.tags if t=='link' and a.get('rel')=='canonical']
  missing=[]
  if canon!=[url]:errors.append(f'{route}: wrong or missing canonical')
  if p.h1!=1:errors.append(f'{route}: expected one h1, found {p.h1}')
  for key in ['description','robots','og:title','og:description','og:url','og:image','og:image:alt','twitter:card','twitter:image:alt']:
   if not metas.get(key):errors.append(f'{route}: missing {key}')
  if 'noindex' in metas.get('robots',''):errors.append(f'{route}: indexed sitemap URL has noindex')
  if not p.jsonld:errors.append(f'{route}: no structured data')
  for tag,a in p.tags:
   if tag=='a' and a.get('href'):
    link=urlsplit(a['href'])
    if not link.scheme and not link.netloc and link.path:
     target=ROOT/unquote(link.path).lstrip('/') if link.path.startswith('/') else file.parent/unquote(link.path)
     if not target.exists():
      message=f'{route}: unresolved local link {a["href"]}'
      if a['href'].startswith('farclip.ai/'):
       warnings.append(message+' (existing content error preserved for owner review)')
      else:errors.append(message)
   if tag=='img' and 'alt' not in a:errors.append(f'{route}: image missing alt: {a.get("src")}')
   value=a.get('src') if tag in ['img','script','source'] else a.get('href') if tag=='link' else None
   if not value:continue
   part=urlsplit(value.replace('\\','/'))
   if part.scheme or part.netloc:continue
   target=ROOT/unquote(part.path).lstrip('/') if part.path.startswith('/') else file.parent/unquote(part.path)
   if not target.is_file():missing.append(value);errors.append(f'{route}: missing asset {value}')
  rows.append({'url':url,'h1':p.h1,'images':sum(t=='img' for t,a in p.tags),'missingAlt':sum(t=='img' and 'alt' not in a for t,a in p.tags),'structuredData':[n['@type'] for graph in p.jsonld for n in graph.get('@graph',[])],'missingAssets':missing})
 for file in ['404.html','mega-jam/index.html','blog/blogsample/blog-post.html','prototypes/jam3-gallery/index.html']:
  p=Page();p.feed((ROOT/file).read_text(encoding='utf-8'));robots=[a.get('content','') for t,a in p.tags if t=='meta' and a.get('name')=='robots']
  if not any('noindex' in r for r in robots):errors.append(file+': missing noindex')
 report={'pages':rows,'errors':errors,'warnings':warnings};(ROOT/'docs/seo/verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
 print(json.dumps({'pages':len(rows),'images':sum(x['images'] for x in rows),'errors':errors,'warnings':warnings},indent=2));return bool(errors)
if __name__=='__main__':sys.exit(audit())
