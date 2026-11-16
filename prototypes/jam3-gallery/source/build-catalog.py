"""Build the local gallery data from itch.io's captured public entries payload."""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse
import csv
import json
import time

root = Path(__file__).resolve().parent.parent
source = root / 'source' / 'entries-api.json'
payload = json.loads(source.read_text(encoding='utf-8'))
rows = payload['jam_games']
assets = root / 'assets' / 'games'
assets.mkdir(parents=True, exist_ok=True)

def extract(row):
    game = row['game']
    thumb = game.get('cover') or None
    result = {
        'id': game['id'], 'title': game['title'],
        'author': game.get('user', {}).get('name', ''),
        'url': game['url'],
        'entryUrl': 'https://itch.io' + row['url'],
        'thumbnailUrl': thumb,
        'description': game.get('short_text', ''),
        'image': None,
    }
    if thumb:
        extension = Path(urlparse(thumb).path).suffix.lower() or '.jpg'
        destination = assets / (str(game['id']) + extension)
        if not destination.exists():
            for attempt in range(3):
                try:
                    request = Request(thumb, headers={'User-Agent': 'Mozilla/5.0'})
                    with urlopen(request, timeout=35) as response:
                        data = response.read()
                        if not response.headers.get('Content-Type', '').startswith('image/'):
                            raise ValueError('Thumbnail response is not an image')
                        destination.write_bytes(data)
                    break
                except Exception:
                    if attempt == 2:
                        raise
                    time.sleep(attempt + 1)
        result['image'] = './assets/games/' + destination.name
    return result

entries = []
with ThreadPoolExecutor(max_workers=6) as executor:
    futures = {executor.submit(extract, row): index for index, row in enumerate(rows)}
    indexed = {}
    for future in as_completed(futures):
        indexed[futures[future]] = future.result()
    entries = [indexed[index] for index in range(len(rows))]

assert len(entries) == len({entry['id'] for entry in entries})
(root / 'games.json').write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding='utf-8')
(root / 'games.js').write_text(
    '// Extracted from the public Jam #3 entries payload. Full provenance: source/README.md.\n'
    + 'window.JAM3_GAMES = ' + json.dumps(entries, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8'
)
with (root / 'games.csv').open('w', encoding='utf-8-sig', newline='') as stream:
    writer = csv.DictWriter(stream, fieldnames=list(entries[0]))
    writer.writeheader()
    writer.writerows(entries)
print(json.dumps({'entries': len(entries), 'downloaded_thumbnails': sum(bool(e['image']) for e in entries), 'without_thumbnails': [e['title'] for e in entries if not e['image']]}, ensure_ascii=False))
