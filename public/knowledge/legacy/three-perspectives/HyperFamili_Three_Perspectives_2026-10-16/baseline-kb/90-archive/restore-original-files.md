---
id: HF-90-ARCHIVE-RESTORE-ORIGINAL-FILES
title: بازیابی فایل‌های اصلی از بسته تمام‌Markdown
type: utility-documentation
language: fa
compiled_on: '2026-10-07'
research_as_of: '2026-10-07'
status: compilation
source_refs: []
provenance: تنظیم و نمایه‌سازی محتوای موجود؛ پژوهش خارجی تازه انجام نشده
rag_include: false
---

# بازیابی فایل‌های اصلی از بسته تمام‌Markdown

نسخه خوانای گزارش، کارت‌ها و منابع برای مطالعه کافی‌اند. این ابزار اختیاری فقط برای بازیابی قالب‌های اولیه، از جمله PDF و JSON، است. کد زیر را در فایلی مانند `restore_sources.py` خارج از این بسته ذخیره و مطابق دستور اجرا کنید. فقط کتابخانه استاندارد Python لازم است؛ متن اسناد اجرا یا به شبکه ارسال نمی‌شود.

```bash
python restore_sources.py ./HyperFamili_Markdown_Knowledge_Base_2026-10-07 ./restored-originals
```

کد با نقشه ورودی‌ها، طول و هش تک‌تک فایل‌ها را بررسی می‌کند و فایل موجود ناسازگار را بازنویسی نمی‌کند. بازسازی محتوای فایل‌ها هدف است؛ زمان ثبت فایل یا بیت‌های ساختاری ZIP قبلی بازتولید نمی‌شوند.

```python
#!/usr/bin/env python3
"""Restore preserved source bytes from the Markdown-only knowledge base.
Usage: python restore_sources.py KB_DIRECTORY DESTINATION_DIRECTORY
Python 3 standard library only. No network requests, no execution of source text.
Existing mismatching files are never overwritten.
"""
from __future__ import annotations
import base64, hashlib, json, re, sys
from pathlib import Path

def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def safe_path(root: Path, name: str) -> Path:
    p = (root / name).resolve()
    p.relative_to(root.resolve())
    return p

def read_records(root: Path) -> list[dict]:
    text = (root / '00-governance/input-map.md').read_text(encoding='utf-8')
    match = re.search(r'```json\n(.*?)\n```', text, flags=re.S)
    if not match:
        raise ValueError('Input map JSON block not found')
    records = json.loads(match.group(1))
    if not isinstance(records, list):
        raise TypeError('Input map must be an array')
    return records

def recover(root: Path, rec: dict) -> bytes:
    path = safe_path(root, rec['output'])
    if rec['method'] == 'identical_bytes':
        data = path.read_bytes()
    else:
        text = path.read_text(encoding='utf-8')
        marker = '<!-- HF-RAW-BEGIN -->\n'
        if text.count(marker) != 1:
            raise ValueError('Ambiguous payload marker: ' + str(path))
        region = text.split(marker, 1)[1].split('<!-- HF-RAW-END -->', 1)[0]
        lines = region.splitlines(keepends=True)
        fence_match = re.match(r'`{3,}', lines[0])
        if not fence_match:
            raise ValueError('Invalid opening fence')
        fence = fence_match.group(0)
        if not lines[-1].strip() == fence:
            raise ValueError('Invalid closing fence')
        payload = ''.join(lines[1:-1])
        if rec['method'] == 'base64_fence':
            data = base64.b64decode(''.join(payload.split()), validate=True)
        elif rec['method'] == 'utf8_fence':
            # Wrapper adds only a final newline when the source lacks one.
            data = payload.encode('utf-8')[:int(rec['bytes'])]
        else:
            raise ValueError('Unknown representation: ' + str(rec['method']))
    if len(data) != rec['bytes'] or sha256(data) != rec['sha256']:
        raise ValueError('Source digest mismatch: ' + rec['input'])
    return data

def restore(root: Path, destination: Path) -> int:
    destination.mkdir(parents=True, exist_ok=True)
    records = read_records(root)
    for rec in records:
        data = recover(root, rec)
        out = safe_path(destination, rec['input'])
        out.parent.mkdir(parents=True, exist_ok=True)
        if out.exists():
            if out.read_bytes() != data:
                raise FileExistsError('Refusing to overwrite: ' + str(out))
        else:
            out.write_bytes(data)
        print(rec['input'] + ': verified')
    return len(records)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit('Usage: python restore_sources.py KB_DIRECTORY DESTINATION_DIRECTORY')
    n = restore(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve())
    print('Restored and verified:', n)

```
