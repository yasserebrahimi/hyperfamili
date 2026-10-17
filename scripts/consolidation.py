"""Consolidate the visible catalogue around the manager's six PDF families.

The source register remains available in ``projectArchive``.  This module is
deliberately data-only so both the generator and the checked-in catalogue use
the same taxonomy.
"""

from copy import deepcopy
from html import escape
from pathlib import Path
import hashlib
import re


FAMILIES = {
    "advertising": {"title": "خدمات تبلیغات و بازاریابی", "icon": "megaphone", "lead": "customer"},
    "automation": {"title": "خدمات اتوماسیون فروشگاهی و هوش مصنوعی", "icon": "scan", "lead": "employee"},
    "self-service": {"title": "خدمات هوشمند سلف‌سرویس", "icon": "sparkles", "lead": "customer"},
    "energy": {"title": "خدمات مدیریت و مصرف انرژی", "icon": "bolt", "lead": "management"},
    "ev-services": {"title": "خدمات پارکینگ و شارژ خودروهای برقی", "icon": "store", "lead": "customer"},
    "customer-outside": {"title": "خدمات تعامل با مشتری در بیرون از فروشگاه", "icon": "heart", "lead": "customer"},
}


GROUPS = [
    ("M01", "رسانه و نمایش هوشمند تبلیغات", "advertising", ["BP001", "BP002", "BP003", "BP004", "BP005", "BP006"]),
    ("M02", "بازاریابی تجربه‌محور", "advertising", ["BP007", "BP008", "BP009"]),
    ("M03", "تبلیغات محیطی و چاپی", "advertising", ["BP010"]),
    ("M04", "بازاریابی دیجیتال و اینفلوئنسری", "advertising", ["BP011", "BP044"]),
    ("M05", "طراحی و اجرای کمپین‌های بازاریابی", "advertising", ["BP012"]),
    ("M06", "لیبل الکترونیکی قیمت (ESL)", "automation", ["BP013"]),
    ("M07", "ترولی هوشمند", "automation", ["BP014", "BP038"]),
    ("M08", "خودپرداخت فروشگاهی (Self-Checkout)", "self-service", ["BP015"]),
    ("M09", "ایستگاه ریفیل و سبد محصولات قابل‌پرکردن", "self-service", ["BP016"] + [f"BP{i:03d}" for i in range(83, 103)]),
    ("M10", "کیوسک کنترل قیمت (Price Checker)", "self-service", ["BP017"]),
    ("M11", "کیوسک شارژ موبایل", "self-service", ["BP018"]),
    ("M12", "کیوسک عکس فوری و پرسنلی", "self-service", ["BP019"]),
    ("M13", "کیوسک بازیافت معکوس (Reverse Vending Machine)", "self-service", ["BP020"]),
    ("M14", "کیوسک پایش سلامت مشتریان", "self-service", ["BP021"]),
    ("M15", "ربات فروشگاهی", "automation", ["BP022", "BP023", "BP081"]),
    ("M16", "بینایی ماشین و تحلیل فروشگاهی", "automation", ["BP024", "BP025", "BP026", "BP039", "BP054"]),
    ("M17", "مسیریابی داخل فروشگاه (Indoor Tracking)", "automation", ["BP027"]),
    ("M18", "پرداخت هوشمند با NFC", "self-service", ["BP028", "BP082"]),
    ("M19", "پایش و مدیریت مصرف انرژی", "energy", ["BP029", "BP076"]),
    ("M20", "پایش تجهیزات برودتی", "energy", ["BP030"]),
    ("M21", "سامانه خورشیدی و ذخیره‌ساز انرژی", "energy", ["BP031", "BP032"]),
    ("M22", "پارکینگ و شارژ خودرو و موتورسیکلت برقی", "ev-services", ["BP033", "BP034"]),
    ("M23", "ارتباط از طریق پیام‌رسان‌های داخلی", "customer-outside", ["BP035"]),
    ("M24", "خدمات پیامکی", "customer-outside", ["BP036"]),
    ("M25", "درگاه تعاملی USSD", "customer-outside", ["BP037"]),
    ("VEND", "وندینگ‌ماشین‌های خوراکی و نوشیدنی", "self-service", [f"BP{i:03d}" for i in range(66, 76)]),
]


GROUP_NOTES = {
    "advertising": ("برای دیده‌شدن بهتر، تجربه روشن‌تر و ارتباط منسجم‌تر با مشتری در فروشگاه.", "اثرگذاری به مکان، محتوا، مجوز و سنجش واقعی وابسته است."),
    "automation": ("برای کاهش کار تکراری و تصمیم‌گیری دقیق‌تر با داده، تجهیز و مسئول مشخص.", "اتصال به سامانه‌ها، کیفیت داده، ایمنی و پذیرش کارکنان باید جداگانه آزموده شود."),
    "self-service": ("برای کوتاه‌تر و شفاف‌تر کردن بخشی از مسیر خرید و خدمت مشتری.", "تجربه کاربر، نگهداری، پرداخت، ایمنی و دسترسی‌پذیری شرط موفقیت‌اند."),
    "energy": ("برای اندازه‌گیری، کنترل و تصمیم‌گیری درباره مصرف و تاب‌آوری فروشگاه.", "صرفه‌جویی یا بازگشت سرمایه بدون خط پایه و اندازه‌گیری میدانی قابل ادعا نیست."),
    "ev-services": ("برای آماده‌سازی خدمت پارکینگ و شارژ وسایل نقلیه برقی در دامنه مشخص.", "ظرفیت برق، مجوز، ایمنی، محل و الگوی استفاده باید پیش از خرید تثبیت شود."),
    "customer-outside": ("برای ادامه تعامل با مشتری پس از خروج از فروشگاه، با کانال و رضایت روشن.", "رضایت، حریم خصوصی، کیفیت پیام و سنجش پاسخ باید کنترل شود."),
}


def _unique(values):
    out = []
    for value in values:
        if value is None:
            continue
        if value not in out:
            out.append(value)
    return out


def _simple_html(raw):
    """Small safe renderer for generated catalogue notes."""
    parts = []
    for block in re.split(r"\n\s*\n", raw.strip()):
        if block.startswith("# "):
            parts.append(f"<h1>{escape(block[2:].strip())}</h1>")
        elif block.startswith("## "):
            parts.append(f"<h2>{escape(block[3:].strip())}</h2>")
        elif block.startswith("- "):
            items = "".join(f"<li>{escape(line[2:].strip())}</li>" for line in block.splitlines() if line.startswith("- "))
            parts.append(f"<ul>{items}</ul>")
        else:
            parts.append(f"<p>{escape(block).replace(chr(10), '<br>')}</p>")
    return "".join(parts)


def _make_doc(group_id, title, family, child_ids, child_projects):
    child_lines = "\n".join(f"- {p['id']}: {p['title']}" for p in child_projects)
    return (
        f"# {title}\n\n"
        f"این پروندهٔ اصلی در طبقه‌بندی شش‌گانهٔ سند مدیر قرار دارد. خانواده: {FAMILIES[family]['title']}.\n\n"
        f"شناسهٔ گروه: {group_id} · واحدهای اولیهٔ ادغام‌شده: {len(child_ids)}\n\n"
        "این کارت برای تصمیم‌گیری سطح مدیر خلاصه شده است؛ جزئیات، قیمت‌ها، منابع و متن پرونده‌های قبلی در آرشیو کتابخانه باقی مانده‌اند.\n\n"
        "## واحدهای ادغام‌شده\n\n" + child_lines + "\n\n"
        "## قاعدهٔ خواندن\n\n"
        "قیمت‌ها و نمونه‌ها مشاهدهٔ منبع‌اند و به‌تنهایی نصب، خرید، پایلوت یا نتیجهٔ قطعی هایپرفامیلی را ثابت نمی‌کنند."
    )


def _ensure_doc(path, raw, docs, library, knowledge_root):
    existing = next((d for d in docs if d["path"] == path), None)
    if existing is None:
        d = {"path": path, "title": raw.splitlines()[0].removeprefix("# "), "type": "project", "archive": False,
             "bytes": len(raw.encode()), "sha256": hashlib.sha256(raw.encode()).hexdigest()}
        docs.append(d)
    else:
        existing.update({"title": raw.splitlines()[0].removeprefix("# "), "type": "project", "archive": False,
                         "bytes": len(raw.encode()), "sha256": hashlib.sha256(raw.encode()).hexdigest()})
    library[path] = {"raw": raw, "html": _simple_html(raw), "search": raw.lower()}
    if knowledge_root is not None:
        target = Path(knowledge_root) / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(raw)


def consolidate_catalog(data, docs, library, knowledge_root=None):
    """Return data with 26 visible aggregate cards and the original register archived."""
    archive = deepcopy(data["projects"])
    by_id = {p["id"]: p for p in archive}
    mapping = {}
    active = []
    topic_pages = {t["id"]: int(t["page"]) for t in data.get("topics", []) if str(t.get("page", "")).isdigit()}

    for group_id, title, family, child_ids in GROUPS:
        missing = [x for x in child_ids if x not in by_id]
        if missing:
            raise KeyError(f"Consolidation children missing: {missing}")
        children = [by_id[x] for x in child_ids]
        for child_id in child_ids:
            mapping[child_id] = group_id
        first = children[0]
        ideas = _unique(item for p in children for item in p.get("ideas", []))
        case_ids = _unique(item for p in children for item in p.get("case_ids", []))
        quote_keys = _unique(item for p in children for item in p.get("quote_keys", []))
        quotes = _unique(item for p in children for item in p.get("quotes", []))
        iran = _unique(item for p in children for item in p.get("iran", []))
        foreign = _unique(item for p in children for item in p.get("foreign", []))
        foreign_refs = _unique(item for p in children for item in p.get("foreign_refs", []))
        papers = _unique(item for p in children for item in p.get("papers", []))
        repos = _unique(item for p in children for item in p.get("repos", []))
        old_docs = _unique(item for p in children for item in p.get("docs", []))
        originals = [group_id] if group_id != "VEND" else ["VEND"]
        page_list = [topic_pages[group_id]] if group_id in topic_pages else _unique(item for p in children for item in p.get("pages", []))
        notes = GROUP_NOTES[family]
        path = f"13-benchmarks-prices/active/{group_id}.md"
        raw = _make_doc(group_id, title, family, child_ids, children)
        _ensure_doc(path, raw, docs, library, knowledge_root)
        effort_order = {"L1": 1, "L2": 2, "L3": 3, "L4": 4}
        effort = max((p.get("effort", "L2") for p in children), key=lambda x: effort_order.get(x, 0))
        p = {
            "id": group_id, "key": "vending" if group_id == "VEND" else group_id.lower(), "title": title,
            "family": family, "original": originals, "variant_ids": child_ids, "children": [{"id": x["id"], "title": x["title"], "key": x["key"]} for x in children],
            "case_ids": case_ids, "iran_refs": _unique(item for p in children for item in p.get("iran_refs", [])),
            "quote_keys": quote_keys, "scope": f"دامنهٔ بررسی اولیه برای «{title}» باید در یک یا چند شعبه با مالک و معیار توقف روشن تعریف شود.",
            "risk": notes[1], "effort": effort, "concept_ids": _unique(item for p in children for item in p.get("concept_ids", [])),
            "iran_match": _unique(item for p in children for item in p.get("iran_match", [])), "foreign_refs": foreign_refs,
            "price_status": "جزئیات قیمت در شاهدهای مرتبط و آرشیو هر واحد آمده است", "low_hours": None, "high_hours": None,
            "illustrative_low_m_toman": None, "illustrative_high_m_toman": None, "path": path,
            "perspectives": {"customer": notes[0], "employee": "مسئولیت، آموزش، نگهداری و مسیر رسیدگی باید برای همین دامنه مشخص شود.", "management": "این کارت برای تصمیم دربارهٔ مسئله، دامنه، شواهد و مرحلهٔ بعد خلاصه شده است؛ هزینه و نتیجهٔ قطعی از آن استنتاج نمی‌شود."},
            "ideas": ideas, "quotes": quotes, "iran": iran, "foreign": foreign, "papers": papers, "repos": repos, "pages": page_list,
            "image": first.get("image"), "imagePage": first.get("imagePage"), "lead": FAMILIES[family]["lead"],
            "search": " ".join([title, group_id, FAMILIES[family]["title"]] + [f"{x.get('id')} {x.get('title')} {x.get('key')}" for x in children]),
            "docs": _unique([path] + old_docs), "definition": f"یک پروندهٔ ترکیبی برای {title} که چند واحد نزدیک را برای ارائهٔ مدیریتی در یک کارت جمع می‌کند.",
        }
        if group_id == "VEND":
            p["image"] = "vending-neutral.webp"
            p["imagePage"] = None
            p["definition"] = "یک کارت واحد برای همهٔ وندینگ‌ماشین‌های خوراکی و نوشیدنی؛ جزئیات هر دستگاه در آرشیو فرعی باقی است."
        if group_id == "M09":
            p["definition"] = "یک کارت واحد برای ایستگاه ریفیل، ظرف چندبارمصرف و همهٔ اقلام قابل‌پرکردن مرتبط."
        active.append(p)

    for collection in (data.get("cases", []), data.get("quotes", [])):
        for item in collection:
            old = list(item.get("projects", []))
            item["archive_projects"] = old
            item["projects"] = _unique(mapping.get(x) for x in old)

    data["projectArchive"] = archive
    data["projectMapping"] = mapping
    data["projects"] = active
    data["families"] = deepcopy(FAMILIES)
    data["activeProjectCount"] = len(active)
    data["archiveProjectCount"] = len(archive)
    return data

