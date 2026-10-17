/* Famili Farda: local React presentation app. */
window.FAMILI_MEDIA_CORRECTIONS={"figure-05-03.webp":"corrected/figure-05-03.webp","figure-05-04.webp":"corrected/figure-05-04.webp","figure-05-05.webp":"corrected/figure-05-05.webp","figure-06-01.webp":"corrected/figure-06-01.webp","figure-07-01.webp":"corrected/figure-07-01.webp","figure-08-01.webp":"corrected/figure-08-01.webp","figure-13-01.webp":"corrected/figure-13-01.webp","figure-16-01.webp":"corrected/figure-16-01.webp","figure-16-02.webp":"corrected/figure-16-02.webp","figure-17-01.webp":"corrected/figure-17-01.webp","figure-21-01.webp":"corrected/figure-21-01.webp","figure-23-01.webp":"corrected/figure-23-01.webp","figure-29-01.webp":"corrected/figure-29-01.webp","figure-31-01.webp":"corrected/figure-31-01.webp","figure-32-00.webp":"corrected/figure-32-00.webp","figure-32-02.webp":"corrected/figure-32-02.webp","page-05.webp":"corrected/page-05.webp","page-06.webp":"corrected/page-06.webp","page-07.webp":"corrected/page-07.webp","page-08.webp":"corrected/page-08.webp","page-13.webp":"corrected/page-13.webp","page-16.webp":"corrected/page-16.webp","page-17.webp":"corrected/page-17.webp","page-21.webp":"corrected/page-21.webp","page-23.webp":"corrected/page-23.webp","page-29.webp":"corrected/page-29.webp","page-31.webp":"corrected/page-31.webp","page-32.webp":"corrected/page-32.webp"};
(function(){"use strict";
/* 00-core.jsx */
const D = window.FAMILI_DATA, projects = D.projects, cases = D.cases, quotes = D.quotes;
const index = a => a.reduce((out, x) => { out[x.id] = x; return out; }, Object.create(null));
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const PP = index(projects), CC = index(cases), QQ = index(quotes), SS = index(D.sources), DD = D.docs.reduce((out, x) => { out[x.path] = x; return out; }, Object.create(null));
const LENSES = { management: { label: 'مدیریت', icon: 'chart', color: '#a08450', text: 'هزینه، منابع و تصمیم‌های بهتر' }, employee: { label: 'کارکنان', icon: 'users', color: '#568299', text: 'بهره‌وری، آموزش و اجرای دقیق' }, customer: { label: 'مشتری نهایی', icon: 'heart', color: '#39876d', text: 'خرید آسان‌تر و تجربه بهتر' } };
const STAGES = ['معرفی طرح', 'ارزش برای سه گروه', 'ایران و جهان', 'قیمت و دامنه', 'اجرا و ریسک', 'جمع‌بندی تصمیم'];
const DEFAULT_AGENDA = ['M07', 'M09', 'M06', 'M16', 'M19', 'M20', 'M22', 'M23', 'M24', 'M25', 'VEND'];
const DECISIONS = { new: 'بررسی نشده', explore: 'نیازمند بررسی', pilot: 'نامزد پایلوت', later: 'بررسی در مرحله بعد', hold: 'توقف فعلی' };
const fa = n => Number(n).toLocaleString('fa-IR');
const norm = s => String(s || '').replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[۰-۹]/g, x => '۰۱۲۳۴۵۶۷۸۹'.indexOf(x)).replace(/[٠-٩]/g, x => '٠١٢٣٤٥٦٧٨٩'.indexOf(x)).replace(/\u200c/g, ' ').replace(/\s+/g, ' ').toLowerCase().trim();
const cx = (...s) => s.filter(Boolean).join(' '), cut = (s, n = 145) => String(s || '').length > n ? String(s).slice(0, n) + '…' : s;
const media = name => { var _a, _b; const asset = ((_a = window.FAMILI_MEDIA_CORRECTIONS) === null || _a === void 0 ? void 0 : _a[name]) || name; return ((_b = window.FAMILI_MEDIA) === null || _b === void 0 ? void 0 : _b[asset]) || 'media/' + asset; };
const safeURL = s => { try {
    const u = new URL(s);
    return ['https:', 'http:', 'mailto:'].includes(u.protocol) ? u.href : '#';
}
catch {
    return '#';
} };
const money = (n, c, compact = false) => { if (n == null)
    return 'نیازمند استعلام'; let s = fa(n); if (compact && c === 'تومان') {
    if (n >= 1e9)
        s = fa(n / 1e9) + ' میلیارد';
    else if (n >= 1e6)
        s = fa(n / 1e6) + ' میلیون';
    else if (n >= 1e3)
        s = fa(n / 1e3) + ' هزار';
} return s + ' ' + ({ USD: 'دلار', EUR: 'یورو', GBP: 'پوند' }[c] || c); };
const price = q => q.low == null ? 'قیمت احراز نشده' : money(q.low, q.currency, true) + (q.high && q.high !== q.low ? ' تا ' + money(q.high, q.currency, true) : '');
const baseIdea = p => p.ideas[0] || {};
const maturityTone = c => /توقف|شکست|تعطیل|تغییر/.test(c.maturity_group) ? 'amber' : /پژوهش|ایده|برنامه|پایلوت|آزمایش/.test(c.maturity_group) ? 'blue' : /استقرار|بهره|خدمت/.test(c.maturity_group) ? 'green' : '';
const metric = p => baseIdea(p).kpi || p.case_ids.map(id => { var _a; return (_a = CC[id]) === null || _a === void 0 ? void 0 : _a.metric; }).filter(Boolean)[0] || 'خط پایه، کیفیت خدمت، زمان رسیدگی و هزینه کامل در دامنه منتخب باید تعریف شوند.';
const reason = p => baseIdea(p).problem || p.perspectives.management;
const docFor = id => { var _a; return (_a = D.docs.find(d => d.path.split('/').pop().toLowerCase().startsWith(id.toLowerCase()))) === null || _a === void 0 ? void 0 : _a.path; };
function download(name, content, type = 'text/plain;charset=utf-8') { const u = URL.createObjectURL(new Blob([content], { type })), a = document.createElement('a'); a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 4000); }
function original(name) { var _a; if ((_a = window.FAMILI_FILES) === null || _a === void 0 ? void 0 : _a[name]) {
    const f = window.FAMILI_FILES[name], s = atob(f.base64), b = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++)
        b[i] = s.charCodeAt(i);
    download(name, b, f.type);
}
else {
    const a = document.createElement('a');
    a.href = 'downloads/' + name;
    a.download = name;
    a.click();
} }
const glyphs = {
    arrow: 'M19 12H5m6-6-6 6 6 6', right: 'M5 12h14m-6-6 6 6-6 6', up: 'm6 14 6-6 6 6', down: 'm6 10 6 6 6-6', close: 'm6 6 12 12M6 18 18 6', search: 'M21 21l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0', grid: 'M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z', chart: 'M4 3v17h17M8 15l4-5 4 2 5-7', heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z', users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8m6 10v-2a4 4 0 0 0-3-3.9M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0', cart: 'M2 3h3l3 13h10l3-9H6M10 21h.01M18 21h.01', leaf: 'M20 3C8 2 3 6 3 13a7 7 0 0 0 14 0c0-4 3-7 3-10ZM3 21l11-11', coffee: 'M18 8h2a3 3 0 0 1 0 6h-2M3 8h15v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM6 2v3m4-3v3m4-3v3', popcorn: 'M7 9a3 3 0 1 1 0-6 3 3 0 0 1 5-1 3 3 0 0 1 5 1 3 3 0 1 1 0 6M5 9h14l-2 13H7ZM9 12l1 8m5-8-1 8', icecream: 'M5 10a4 4 0 0 1 2-7 5 5 0 0 1 9 0 4 4 0 0 1 3 7ZM6 11l6 11 6-11M9 16l6-3', pizza: 'M3 3a22 22 0 0 1 18 18L3 3Zm0 0v18h18M3 17h17M7 12h.01m0-5h.01m7 9h.01', bottle: 'M9 2h6v4l3 4v12H6V10l3-4ZM9 2v4h6M6 13h12', box: 'm3 7 9-5 9 5v10l-9 5-9-5ZM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5', scan: 'M4 8V4h4m8 0h4v4M4 16v4h4m8 0h4v-4M7 8v8m3-8v8m4-8v8m3-8v8', bolt: 'm13 2-9 12h7l-1 8 10-13h-7Z', layers: 'm12 2 10 5-10 5L2 7ZM2 12l10 5 10-5M2 17l10 5 10-5', globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18', book: 'M3 3h7a3 3 0 0 1 3 3v15a4 4 0 0 0-4-2H3Zm18 0h-5a3 3 0 0 0-3 3v15a4 4 0 0 1 4-2h4Z', play: 'm8 4 13 8-13 8Z', plus: 'M12 5v14M5 12h14', check: 'm5 12 4 4L20 5', external: 'M15 3h6v6m0-6-11 11M10 3H3v18h18v-7', bookmark: 'M6 3h12v19l-6-4-6 4Z', download: 'M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5', upload: 'M12 16V3m-5 5 5-5 5 5M3 16v5h18v-5', fullscreen: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5', list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2', shield: 'm12 2 9 4v7c0 5-9 9-9 9s-9-4-9-9V6ZM8 12l3 3 5-6', info: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6m0-10h.01', file: 'M14 2H4v20h16V8ZM14 2v6h6M8 13h8m-8 4h8', compare: 'M9 3H4v18h5M15 3h5v18h-5M8 12h8m-3-3 3 3-3 3', wallet: 'M21 8H3V4h15v4M3 8v13h18V8Zm12 5h6v4h-6Z', menu: 'M3 6h18M3 12h18M3 18h18', megaphone: 'm3 9 17-6v18L3 15ZM5 16l2 6h4l-2-5M3 9v6', store: 'M3 9V3h18v6M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M4 12v9h16v-9M9 21v-7h6v7', orbit: 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0M4 4l16 16M20 4 4 20M2 12h20M12 2v20', sparkles: 'm12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3ZM20 2v4m-2-2h4', notes: 'M4 3h16v18H4ZM8 7h8m-8 5h8m-8 5h5', target: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM12 12h.01', link: 'm9 15 6-6M7 14l-2 2a4 4 0 0 0 6 6l3-3M10 5l3-3a4 4 0 0 1 6 6l-2 2', lock: 'M5 10h14v12H5ZM8 10V6a4 4 0 0 1 8 0v4'
};
function I({ name, size = 20 }) { return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.65", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
    React.createElement("path", { d: glyphs[name] || glyphs.layers })); }
function Btn({ children, icon, kind = '', small = false, ...props }) { return React.createElement("button", { className: cx('btn', kind, small && 'small'), ...props },
    icon && React.createElement(I, { name: icon, size: small ? 16 : 19 }),
    React.createElement("span", null, children)); }
function IB({ name, label, active = false, ...props }) { return React.createElement("button", { className: cx('ib', active && 'active'), title: label, "aria-label": label, ...props },
    React.createElement(I, { name: name })); }
function Tag({ children, tone = '' }) { return React.createElement("span", { className: cx('tag', tone) }, children); }
function Note({ children, title, tone = '' }) { return React.createElement("div", { className: cx('note', tone) },
    React.createElement(I, { name: "info", size: 19 }),
    React.createElement("div", null,
        title && React.createElement("strong", null, title),
        React.createElement("p", null, children))); }
function Heading({ title, text, action }) { return React.createElement("div", { className: "section-heading" },
    React.createElement("div", null,
        React.createElement("h2", null, title),
        text && React.createElement("p", null, text)),
    action); }
function Empty({ title = 'نتیجه‌ای پیدا نشد', text = 'جست‌وجو یا فیلترها را تغییر دهید.', action }) { return React.createElement("div", { className: "empty" },
    React.createElement(I, { name: "search", size: 39 }),
    React.createElement("h2", null, title),
    React.createElement("p", null, text),
    action); }
function Lens({ a }) { return React.createElement("div", { className: "lenses", role: "group", "aria-label": "\u062F\u06CC\u062F\u06AF\u0627\u0647 \u0627\u0631\u0627\u0626\u0647" }, Object.entries(LENSES).map(([k, v]) => React.createElement("button", { key: k, "aria-pressed": a.state.lens === k, className: a.state.lens === k ? 'selected' : '', onClick: () => a.lens(k) },
    React.createElement(I, { name: v.icon, size: 18 }),
    v.label))); }
// Topic illustrations enrich unpictured dossiers without changing source evidence.
const TOPIC_ART = { advertising: ['figure-04-02.webp', 4], automation: ['figure-21-01.webp', 21], 'self-service': ['figure-13-01.webp', 13], energy: ['figure-27-00.webp', 27], 'ev-services': ['figure-29-01.webp', 29], 'customer-outside': ['figure-31-01.webp', 31] };
const VENDING_ART = 'vending-neutral.webp';
function BrandLogo({ className = '', decorative = false }) { return React.createElement("img", { className: cx('brand-logo', className), src: media('brand-logo.png'), alt: decorative ? '' : 'فروشگاه‌های زنجیره‌ای فامیلی', width: "300", height: "103" }); }
function BrandStamp() { return React.createElement("span", { className: "brand-stamp", "aria-hidden": "true" },
    React.createElement(BrandLogo, { decorative: true })); }
function Visual({ p, big = false, a }) {
    let f = D.families[p.family], icon = ['popcorn', 'icecream', 'pizza'].includes(p.key) ? p.key : f.icon, generated = p.id === 'VEND' || p.key === 'vending', topic = !p.image && !generated && TOPIC_ART[p.family], photo = p.image || (generated && VENDING_ART) || (topic && topic[0]), page = p.imagePage || (topic && topic[1]);
    return React.createElement("div", { className: cx('visual', big && 'big', !photo && 'concept', topic && 'topic-visual') },
        photo ? React.createElement("img", { src: media(photo), loading: "lazy", alt: generated ? 'تصویر مفهومی خنثی از وندینگ‌ماشین خوراکی و نوشیدنی؛ مدل تجهیز انتخاب نشده' : (topic ? 'تصویر موضوعی مرتبط با ' + f.title : 'تصویر معرفی در سند مدیر برای ' + p.title) + '؛ صفحه ' + fa(page) }) : React.createElement("div", { className: "concept-art" },
            React.createElement("div", { className: "rings" }),
            React.createElement("span", null,
                React.createElement(I, { name: icon, size: big ? 88 : 55 })),
            React.createElement("strong", null, generated ? p.title : f.title),
            React.createElement("small", null, "\u0646\u0645\u0627\u06CC \u0645\u0641\u0647\u0648\u0645\u06CC\u061B \u0645\u062F\u0644 \u062A\u062C\u0647\u06CC\u0632 \u0627\u0646\u062A\u062E\u0627\u0628 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A")),
        photo && React.createElement(BrandStamp, null),
        (topic || generated) && React.createElement("span", { className: "visual-topic-icon" },
            React.createElement(I, { name: icon, size: 23 })),
        photo && React.createElement("div", { className: "visual-credit" },
            React.createElement(I, { name: "file", size: 12 }),
            React.createElement("span", null, generated ? 'تصویر مفهومی با هوش مصنوعی · مدل تجهیز انتخاب نشده' : (topic ? 'تصویر موضوعی · ' : '') + 'سند مدیر، صفحه ' + fa(page) + ' · نه شاهد اجرا'),
            a && !generated && React.createElement("button", { "aria-label": "\u0628\u0632\u0631\u06AF\u200C\u0646\u0645\u0627\u06CC\u06CC \u062A\u0635\u0648\u06CC\u0631", onClick: () => a.modal({ type: 'image', image: photo, page }) },
                React.createElement(I, { name: "fullscreen", size: 15 }))));
}
function Card({ p, a }) { var _a, _b; let selected = a.state.agenda.includes(p.id), mergedCount = ((_a = p.variant_ids) === null || _a === void 0 ? void 0 : _a.length) || ((_b = p.children) === null || _b === void 0 ? void 0 : _b.length) || 0; return React.createElement("article", { className: cx("card", "family-" + p.family) },
    React.createElement("button", { className: "card-main", "aria-label": 'پرونده ' + p.title, onClick: () => a.project(p.id) },
        React.createElement(Visual, { p: p }),
        React.createElement("div", { className: "card-body" },
            React.createElement("div", { className: "card-meta" },
                React.createElement("span", null, D.families[p.family].title),
                React.createElement("code", null, p.id)),
            React.createElement("h3", null, p.title),
            React.createElement("p", null, cut(p.perspectives[a.state.lens], 105)),
            React.createElement("div", { className: "card-evidence" },
                React.createElement("span", null,
                    React.createElement(I, { name: "globe", size: 13 }),
                    fa(p.case_ids.length),
                    " \u0646\u0645\u0648\u0646\u0647 \u067E\u0698\u0648\u0647\u0634"),
                React.createElement("span", null,
                    React.createElement(I, { name: "wallet", size: 13 }),
                    p.quotes.length ? 'شاهد قیمت دارد' : 'نیازمند استعلام'),
                mergedCount > 1 && React.createElement("span", null,
                    React.createElement(I, { name: "layers", size: 13 }),
                    fa(mergedCount),
                    " \u0648\u0627\u062D\u062F \u0627\u0648\u0644\u06CC\u0647")))),
    React.createElement("footer", null,
        React.createElement("button", { className: selected ? 'chosen' : '', onClick: () => a.toggle('agenda', p.id) },
            React.createElement(I, { name: selected ? 'check' : 'plus', size: 15 }),
            selected ? 'در فهرست جلسه' : 'افزودن به جلسه'),
        React.createElement("div", null,
            React.createElement(IB, { name: "compare", label: 'مقایسه ' + p.id, active: a.state.compare.includes(p.id), onClick: () => a.compare(p.id) }),
            React.createElement(IB, { name: "bookmark", label: 'نشان‌کردن ' + p.id, active: a.state.favorites.includes(p.id), onClick: () => a.toggle('favorites', p.id) })))); }
function Source({ id, a }) { let s = SS[id]; return s ? React.createElement("button", { className: "source", onClick: () => a.modal({ type: 'source', id }) },
    React.createElement(I, { name: "link", size: 14 }),
    React.createElement("span", null, s.publisher || s.title),
    React.createElement("code", null, id)) : null; }
function CaseCard({ c, a }) { return React.createElement("button", { className: "case-card", onClick: () => a.modal({ type: 'case', id: c.id }) },
    React.createElement("div", { className: "case-brand" },
        React.createElement("span", { className: "org" }, c.organization.slice(0, 2).toUpperCase()),
        React.createElement("strong", { dir: "auto" }, c.organization),
        React.createElement(I, { name: "external", size: 17 })),
    React.createElement("h3", null, c.title),
    React.createElement("div", { className: "case-labels" },
        React.createElement(Tag, { tone: maturityTone(c) }, c.maturity_group),
        React.createElement("span", null, c.countries.join('، '))),
    React.createElement("p", null, cut(c.fact, 205)),
    React.createElement("footer", null,
        React.createElement("span", null, "\u0634\u0648\u0627\u0647\u062F\u060C \u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0648 \u0627\u0642\u062A\u0628\u0627\u0633 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC"),
        React.createElement(I, { name: "arrow", size: 17 }))); }
function Quote({ q, a }) { return React.createElement("article", { className: "quote" },
    React.createElement("div", null,
        React.createElement(Tag, { tone: q.market === 'ایران' ? 'green' : 'blue' }, q.market),
        React.createElement("code", null, q.id)),
    React.createElement("h3", null, q.product),
    React.createElement("strong", { className: "amount" }, price(q)),
    React.createElement("span", { className: "muted" },
        "\u0628\u0647 \u0627\u0632\u0627\u06CC ",
        q.unit,
        " \u00B7 ",
        q.publisher),
    React.createElement("p", null, q.billing),
    React.createElement("div", { className: "quote-scope" },
        React.createElement(Tag, { tone: /سرنخ|غیرهم/.test(q.status) ? 'amber' : 'green' }, q.status),
        React.createElement("p", null, q.scope)),
    React.createElement("aside", null, q.exclusions),
    React.createElement("footer", null,
        React.createElement("span", null,
            "\u0645\u0634\u0627\u0647\u062F\u0647: ",
            React.createElement("bdi", null, q.date)),
        React.createElement("button", { onClick: () => a.modal({ type: 'quote', id: q.id }) },
            "\u062C\u0632\u0626\u06CC\u0627\u062A \u0648 \u0645\u0646\u0628\u0639 ",
            React.createElement(I, { name: "arrow", size: 15 })))); }
function ThreeValues({ p, a }) { return React.createElement("div", { className: "values" }, Object.entries(LENSES).map(([k, v]) => React.createElement("section", { key: k, className: a.state.lens === k ? 'selected' : '', style: { '--lens': v.color } },
    React.createElement(I, { name: v.icon, size: 27 }),
    React.createElement("h3", null, v.label),
    React.createElement("p", null, p.perspectives[k])))); }
function Flow({ p }) { let items = (p.id === 'VEND' || p.key === 'vending') ? ['انتخاب و پرداخت', 'تهیه کنترل‌شده', 'تأیید تحویل', 'شارژ و پشتیبانی'] : p.id === 'M09' ? ['محصول و ظرف معتبر', 'سنجش مقدار', 'پرکردن و برچسب', 'تسویه و ردیابی'] : ['داده معتبر', 'مسئله مشخص', 'اقدام مسئول', 'سنجش نتیجه']; return React.createElement("div", { className: "flow" }, items.map((t, i) => React.createElement("div", { key: t },
    React.createElement("b", null, fa(i + 1)),
    React.createElement("span", null, t),
    i < 3 && React.createElement(I, { name: "arrow", size: 16 })))); }
function DocLink({ path, a, title }) { return DD[path] ? React.createElement("button", { className: "doc-link", onClick: () => a.doc(path) },
    React.createElement(I, { name: "file" }),
    React.createElement("div", null,
        React.createElement("strong", null, title || DD[path].title),
        React.createElement("small", null, DD[path].archive ? 'مرجع تاریخی / مکمل' : 'سند پژوهش')),
    React.createElement(I, { name: "arrow", size: 16 })) : null; }
function QA({ p, a }) { let ir = p.iran.map(id => { var _a; return (_a = SS[id]) === null || _a === void 0 ? void 0 : _a.publisher; }).filter(Boolean); return React.createElement("section", { className: "board-qa" },
    React.createElement(Heading, { title: "\u067E\u0631\u0633\u0634\u200C\u0647\u0627\u06CC \u0627\u062D\u062A\u0645\u0627\u0644\u06CC \u0647\u06CC\u0626\u062A\u200C\u0645\u062F\u06CC\u0631\u0647", text: "\u067E\u0627\u0633\u062E \u0631\u0627\u0647\u0646\u0645\u0627 \u0628\u0631\u0627\u0633\u0627\u0633 \u0647\u0645\u06CC\u0646 \u067E\u0631\u0648\u0646\u062F\u0647\u061B \u0646\u0647 \u062A\u0639\u0647\u062F \u062E\u0631\u06CC\u062F \u06CC\u0627 \u0646\u062A\u06CC\u062C\u0647 \u067E\u0627\u06CC\u0644\u0648\u062A." }),
    [['دقیقاً چه چیزی را پیشنهاد می‌کنیم؟', p.definition], ['برای شروع، چه دامنه‌ای قابل بررسی است؟', p.scope], ['نمونه ایرانی داریم؟', ir.length ? 'در پرونده، ' + ir.join('، ') + ' به‌عنوان منبع عرضه یا نمونه مرتبط ثبت شده‌اند. این به معنی نصب در فامیلی یا موجودی قطعی نیست.' : 'نمونه ایرانی هم‌دامنه در این ثبت احراز نشده؛ این نتیجه به معنی نبود راهکار در ایران نیست.'], ['چقدر هزینه دارد؟', p.quotes.length ? 'این پرونده ' + fa(p.quotes.length) + ' مشاهده قیمت جزء یا گزینه مرتبط دارد؛ هزینه کل از نصب، اتصال، پشتیبانی و بهره‌برداری جداست.' : 'قیمت عمومی هم‌دامنه احراز نشده است؛ استعلام کتبی با مشخصات و خدمات لازم است.'], ['چه چیزی باید سنجیده شود؟', metric(p)], ['مهم‌ترین ریسک این طرح چیست؟', p.risk]].map(([q, t]) => React.createElement("details", { key: q },
        React.createElement("summary", null, q),
        React.createElement("p", null, t))),
    React.createElement(Btn, { small: true, kind: "ghost", icon: "file", onClick: () => a.doc(p.path) }, "\u0627\u0635\u0644 \u067E\u0631\u0648\u0646\u062F\u0647 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646")); }
class Scenario extends React.Component {
    constructor(p) { super(p); this.state = { rate: String(D.rates.base) }; }
    render() { let p = this.props.p, m = D.models[p.effort]; if (!m)
        return null; const rate = Number(this.state.rate), valid = Number.isFinite(rate) && Number.isFinite(m.high_hours * rate) && rate >= 0 && this.state.rate !== ''; return React.createElement("section", { className: "scenario" },
        React.createElement(Heading, { title: "\u0633\u0646\u0627\u0631\u06CC\u0648\u06CC \u0647\u0632\u06CC\u0646\u0647 \u062A\u0648\u0633\u0639\u0647 \u0648 \u0627\u062A\u0635\u0627\u0644", text: "\u0641\u0631\u0636 \u062D\u0633\u0627\u0633\u06CC\u062A \u067E\u0698\u0648\u0647\u0634\u061B \u0646\u0647 \u0646\u0631\u062E \u0628\u0627\u0632\u0627\u0631\u060C \u062D\u0642\u0648\u0642\u060C \u062A\u0639\u0631\u0641\u0647 \u06CC\u0627 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u067E\u06CC\u0645\u0627\u0646\u06A9\u0627\u0631.", action: React.createElement(Tag, { tone: "amber" }, "\u0642\u0627\u0628\u0644 \u062A\u063A\u06CC\u06CC\u0631") }),
        React.createElement("div", { className: "two" },
            React.createElement("label", null,
                "\u0646\u0631\u062E \u0622\u0632\u0645\u0627\u06CC\u0634\u06CC \u0646\u0641\u0631\u0633\u0627\u0639\u062A (\u062A\u0648\u0645\u0627\u0646)",
                React.createElement("input", { "aria-label": "\u0646\u0631\u062E \u0646\u0641\u0631\u0633\u0627\u0639\u062A", type: "number", min: "0", step: "50000", value: this.state.rate, onChange: e => this.setState({ rate: e.target.value }) })),
            React.createElement("div", null,
                React.createElement("small", null,
                    p.effort,
                    " \u2014 ",
                    m.label),
                React.createElement("h3", null,
                    fa(m.low_hours),
                    " \u062A\u0627 ",
                    fa(m.high_hours),
                    " \u0646\u0641\u0631\u0633\u0627\u0639\u062A"))),
        React.createElement("div", { className: "scenario-result" },
            React.createElement("div", null,
                React.createElement("span", null, "\u0633\u0646\u0627\u0631\u06CC\u0648\u06CC \u067E\u0627\u06CC\u06CC\u0646"),
                React.createElement("strong", null, valid ? money(m.low_hours * rate, 'تومان', true) : 'ورودی نامعتبر')),
            React.createElement("div", null,
                React.createElement("span", null, "\u0633\u0646\u0627\u0631\u06CC\u0648\u06CC \u0628\u0627\u0644\u0627"),
                React.createElement("strong", null, valid ? money(m.high_hours * rate, 'تومان', true) : 'ورودی نامعتبر'))),
        React.createElement("p", null, "\u062A\u062C\u0647\u06CC\u0632\u0627\u062A\u060C \u0633\u0627\u062E\u062A \u062F\u0633\u062A\u06AF\u0627\u0647\u060C \u06AF\u0648\u0627\u0647\u06CC\u060C \u0645\u062C\u0648\u0632\u060C \u0622\u0645\u0627\u062F\u0647\u200C\u0633\u0627\u0632\u06CC \u0645\u062D\u0644\u060C \u0645\u06CC\u0632\u0628\u0627\u0646\u06CC\u060C \u0645\u0648\u0627\u062F \u0648 \u0628\u0647\u0631\u0647\u200C\u0628\u0631\u062F\u0627\u0631\u06CC \u062F\u0631 \u0627\u06CC\u0646 \u0639\u062F\u062F \u0646\u06CC\u0633\u062A\u0646\u062F. \u0627\u06CC\u0646 \u0641\u0642\u0637 \u06A9\u0627\u0631 \u0646\u0631\u0645\u200C\u0627\u0641\u0632\u0627\u0631\u06CC/\u0627\u062A\u0635\u0627\u0644 \u062F\u0631 \u062F\u0627\u0645\u0646\u0647 \u06A9\u0648\u0686\u06A9 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC \u0627\u0633\u062A."),
        React.createElement("div", { className: "wbs" }, m.wbs.map(([t, l, h]) => React.createElement("div", { key: t },
            React.createElement("span", null, t),
            React.createElement("i", null,
                React.createElement("b", { style: { width: h / Math.max(...m.wbs.map(x => x[2])) * 100 + '%' } })),
            React.createElement("small", null,
                fa(l),
                "\u2013",
                fa(h),
                " \u0633\u0627\u0639\u062A"))))); }
}
class Dialog extends React.Component {
    componentDidMount() { this.prev = document.activeElement; this.overflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; this.key = e => { if (e.key === 'Escape') {
        e.stopPropagation();
        this.props.close();
    } if (e.key === 'Tab') {
        const x = [...this.el.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]')].filter(x => x.offsetParent !== null);
        if (!x.length)
            return;
        let f = x[0], l = x[x.length - 1];
        if (e.shiftKey && document.activeElement === f) {
            e.preventDefault();
            l.focus();
        }
        else if (!e.shiftKey && document.activeElement === l) {
            e.preventDefault();
            f.focus();
        }
    } }; document.addEventListener('keydown', this.key, true); this.focusTimer = setTimeout(() => { if (!this.el)
        return; let e = this.el.querySelector('.search-input') || this.el.querySelector('button'); e === null || e === void 0 ? void 0 : e.focus(); }, 30); }
    componentWillUnmount() { var _a, _b; clearTimeout(this.focusTimer); document.body.style.overflow = this.overflow; document.removeEventListener('keydown', this.key, true); (_b = (_a = this.prev) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a); }
    render() { return React.createElement("div", { className: "scrim", onMouseDown: e => { if (e.target === e.currentTarget)
            this.props.close(); } },
        React.createElement("section", { ref: e => this.el = e, role: "dialog", "aria-modal": "true", "aria-label": this.props.title, className: cx('dialog', this.props.wide && 'wide', this.props.kind) },
            React.createElement("header", null,
                React.createElement("h2", null, this.props.title),
                this.props.back && React.createElement("button", { className: "dialog-back", onClick: this.props.back },
                    React.createElement(I, { name: "right", size: 16 }),
                    "\u0628\u0627\u0632\u06AF\u0634\u062A"),
                React.createElement(IB, { name: "close", label: "\u0628\u0633\u062A\u0646 \u062C\u0632\u0626\u06CC\u0627\u062A", onClick: this.props.close })),
            this.props.children)); }
}
function Markdown({ doc, a }) { return React.createElement("div", { className: "markdown", onClick: e => { let el = e.target.closest('[data-doc]'); if (el) {
        e.preventDefault();
        a.doc(el.dataset.doc);
    } }, dangerouslySetInnerHTML: { __html: doc.html } }); }
/* 10-views.jsx */
function Home({ a }) {
    const perspectives = { management: { image: 'figure-21-01.webp', page: 21, title: 'تصمیم روشن‌تر.', caption: 'از داده تا تصمیم' }, employee: { image: 'figure-25-00.webp', page: 25, title: 'کار هوشمندتر.', caption: 'فناوری در کنار آدم‌ها' }, customer: { image: 'figure-07-01.webp', page: 7, title: 'خرید دلپذیرتر.', caption: 'تجربه‌ای که در خاطر می‌ماند' } };
    const stories = [['M07', 'figure-11-01.webp', 'خرید، به سبک فردا', 'ترولی هوشمند', 11], ['M09', 'figure-13-01.webp', 'کمتر مصرف کنیم، بیشتر بسازیم', 'ایستگاه ریفیل', 13], ['M15', 'figure-19-01.webp', 'همکار تازهٔ فروشگاه', 'ربات فروشگاهی', 19], ['M22', 'figure-29-01.webp', 'انرژی برای ادامهٔ مسیر', 'پارکینگ و شارژ برقی', 29]];
    return React.createElement("div", { className: "page home cinematic-home brand-home" },
        React.createElement("div", { className: "home-intro" },
            React.createElement("div", null,
                React.createElement("span", { className: "eyebrow" }, "\u0686\u0634\u0645\u200C\u0627\u0646\u062F\u0627\u0632 \u0646\u0648\u0622\u0648\u0631\u06CC \u0647\u0627\u06CC\u067E\u0631\u0641\u0627\u0645\u06CC\u0644\u06CC"),
                React.createElement("h2", null, "\u0627\u0645\u0631\u0648\u0632\u060C \u0628\u0631\u0627\u06CC \u0641\u0631\u062F\u0627\u06CC \u0641\u0627\u0645\u06CC\u0644\u06CC.")),
            React.createElement("span", { className: "edition" },
                React.createElement("span", { className: "dot" }),
                "\u0627\u062A\u0627\u0642 \u0627\u0631\u0627\u0626\u0647 \u0647\u06CC\u0626\u062A\u200C\u0645\u062F\u06CC\u0631\u0647 ",
                React.createElement("span", { className: "edition-year", dir: "ltr" }, "\u06F2\u06F0\u06F2\u06F6"))),
        React.createElement("section", { className: "hero cinematic-hero brand-hero" },
            React.createElement("div", { className: "hero-media" },
                React.createElement("img", { "data-motion-parallax": true, src: media('brand-market.webp'), alt: "\u062A\u062C\u0633\u0645 \u0645\u0641\u0647\u0648\u0645\u06CC \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u0622\u06CC\u0646\u062F\u0647 \u0647\u0627\u06CC\u067E\u0631\u0641\u0627\u0645\u06CC\u0644\u06CC \u0628\u0627 \u0644\u0648\u06AF\u0648\u06CC \u0628\u0631\u0646\u062F \u0648 \u0647\u0648\u06CC\u062A \u0641\u06CC\u0631\u0648\u0632\u0647\u200C\u0627\u06CC\u061B \u0633\u0627\u062E\u062A\u0647\u200C\u0634\u062F\u0647 \u0628\u0627 \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC", fetchPriority: "high" }),
                React.createElement("div", { className: "hero-image-shade" })),
            React.createElement("div", { className: "hero-topline" },
                React.createElement("span", null,
                    React.createElement(I, { name: "sparkles", size: 16 }),
                    "\u06CC\u06A9 \u062E\u0627\u0646\u0648\u0627\u062F\u0647. \u0647\u0632\u0627\u0631 \u0627\u0645\u06A9\u0627\u0646."),
                React.createElement("span", { dir: "ltr" }, "THE NEXT CHAPTER")),
            React.createElement("div", { className: "hero-copy" },
                React.createElement("span", { className: "hero-eyebrow" },
                    React.createElement("i", null),
                    "\u0628\u0631\u0627\u06CC \u0632\u0646\u062F\u06AF\u06CC \u0628\u0647\u062A\u0631\u060C \u0647\u0631 \u0631\u0648\u0632."),
                React.createElement("h1", null,
                    "\u0641\u0631\u062F\u0627\u060C",
                    React.createElement("br", null),
                    React.createElement("span", { className: "brand-hero-word" }, "\u0641\u0627\u0645\u06CC\u0644\u06CC\u200C\u062A\u0631.")),
                React.createElement("p", null,
                    "\u062E\u0631\u06CC\u062F\u06CC \u062F\u0644\u067E\u0630\u06CC\u0631\u062A\u0631. \u06A9\u0627\u0631\u06CC \u0647\u0648\u0634\u0645\u0646\u062F\u062A\u0631.",
                    React.createElement("br", null),
                    "\u0622\u06CC\u0646\u062F\u0647\u200C\u0627\u06CC \u06A9\u0647 \u0628\u0627 \u0647\u0645 \u0645\u06CC\u200C\u0633\u0627\u0632\u06CC\u0645."),
                React.createElement("div", { className: "actions" },
                    React.createElement(Btn, { kind: "light", icon: "play", onClick: () => a.present() }, "\u062A\u0645\u0627\u0634\u0627\u06CC \u0622\u06CC\u0646\u062F\u0647"),
                    React.createElement("button", { className: "text-link pale", onClick: () => a.go('projects') },
                        "\u06A9\u0634\u0641 ",
                        fa(projects.length),
                        " \u0627\u06CC\u062F\u0647 ",
                        React.createElement(I, { name: "arrow", size: 19 })))),
            React.createElement("div", { className: "hero-brand-sign" },
                React.createElement(BrandLogo, null),
                React.createElement("span", null, "\u062A\u0635\u0648\u06CC\u0631\u06CC \u0627\u0632 \u0641\u0631\u062F\u0627\u06CC \u0645\u0627")),
            React.createElement("div", { className: "brand-orbit", "aria-hidden": "true" },
                React.createElement("span", null),
                React.createElement("span", null),
                React.createElement("i", null)),
            React.createElement("div", { className: "hero-bottomline" },
                React.createElement("span", null,
                    React.createElement("span", { className: "dot" }),
                    "\u062A\u0635\u0648\u06CC\u0631 \u0645\u0641\u0647\u0648\u0645\u06CC \u0628\u0627 \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC"),
                React.createElement("button", { onClick: () => document.getElementById('perspectives').scrollIntoView({ behavior: (a.state.reduceMotion || a.state.systemReduceMotion) ? 'auto' : 'smooth', block: 'start' }) },
                    "\u0622\u063A\u0627\u0632 \u06A9\u0627\u0648\u0634 ",
                    React.createElement(I, { name: "down", size: 17 })))),
        React.createElement("div", { className: "brand-strip", "aria-label": "\u0645\u0633\u06CC\u0631 \u0646\u0648\u0622\u0648\u0631\u06CC \u0641\u0627\u0645\u06CC\u0644\u06CC" },
            React.createElement("span", null, "\u062A\u062C\u0631\u0628\u0647\u0654 \u0628\u0647\u062A\u0631"),
            React.createElement("i", null, "\u2733"),
            React.createElement("span", null, "\u0627\u0646\u062A\u062E\u0627\u0628 \u0647\u0648\u0634\u0645\u0646\u062F"),
            React.createElement("i", null, "\u2733"),
            React.createElement("span", null, "\u0622\u06CC\u0646\u062F\u0647\u0654 \u0645\u0634\u062A\u0631\u06A9"),
            React.createElement("i", null, "\u2733"),
            React.createElement("span", { dir: "ltr" }, "FAMILI, FOR TOMORROW.")),
        React.createElement("section", { className: "insight-ribbon" }, [[projects.length, 'طرح برای فردا', 'layers'], [cases.length, 'نمونهٔ پژوهش', 'globe'], [quotes.length, 'مشاهدهٔ قیمت', 'wallet'], [D.baseFiles, 'فایل اصلی پژوهش', 'book']].map(([n, label, icon]) => React.createElement("div", { key: label },
            React.createElement("span", { className: "stat-icon" },
                React.createElement(I, { name: icon, size: 22 })),
            React.createElement("strong", null, fa(n)),
            React.createElement("span", null, label)))),
        React.createElement("section", { id: "perspectives", className: "brand-perspectives" },
            React.createElement(Heading, { title: "\u0641\u0631\u062F\u0627 \u0631\u0627 \u0627\u0632 \u0646\u06AF\u0627\u0647 \u062E\u0648\u062F\u062A\u0627\u0646 \u0628\u0628\u06CC\u0646\u06CC\u062F.", text: "\u0633\u0647 \u0646\u06AF\u0627\u0647\u060C \u06CC\u06A9 \u0645\u0642\u0635\u062F: \u062A\u062C\u0631\u0628\u0647\u200C\u0627\u06CC \u0628\u0647\u062A\u0631 \u062F\u0631 \u0641\u0627\u0645\u06CC\u0644\u06CC.", action: React.createElement("span", { className: "section-note" },
                    "\u06CC\u06A9 \u0646\u06AF\u0627\u0647 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F ",
                    React.createElement(I, { name: "arrow", size: 17 })) }),
            React.createElement("div", { className: "perspective-grid" }, Object.entries(LENSES).map(([key, l], index) => { let p = perspectives[key]; return React.createElement("button", { key: key, className: cx('perspective', 'photo-perspective', a.state.lens === key && 'selected'), "aria-pressed": a.state.lens === key, onClick: () => a.lens(key) },
                React.createElement("img", { src: media(p.image), alt: 'تصویر معرفی سند مدیر، صفحه ' + fa(p.page), loading: "lazy" }),
                React.createElement("span", { className: "perspective-top" },
                    React.createElement("span", { className: "perspective-number" },
                        "\u06F0",
                        fa(index + 1)),
                    React.createElement("small", null, a.state.lens === key ? 'نگاه منتخب' : 'انتخاب این نگاه')),
                React.createElement("div", { className: "perspective-copy" },
                    React.createElement("span", { className: "perspective-label" },
                        "\u0628\u0631\u0627\u06CC ",
                        l.label),
                    React.createElement("h3", null, p.title),
                    React.createElement("p", null, p.caption),
                    React.createElement("span", { className: "perspective-foot" },
                        React.createElement("small", null,
                            "\u062A\u0635\u0648\u06CC\u0631 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631 \u00B7 \u0635\u0641\u062D\u0647 ",
                            fa(p.page)),
                        React.createElement("i", null,
                            React.createElement(I, { name: a.state.lens === key ? 'check' : 'arrow', size: 19 }))))); }))),
        React.createElement("section", { className: "brand-experience" },
            React.createElement("div", { className: "brand-experience-copy" },
                React.createElement("span", { className: "eyebrow" }, "\u0644\u062D\u0638\u0647\u200C\u0647\u0627\u06CC \u06A9\u0648\u0686\u06A9\u060C \u062A\u062C\u0631\u0628\u0647\u200C\u0647\u0627\u06CC \u0645\u0627\u0646\u062F\u06AF\u0627\u0631"),
                React.createElement("h2", null,
                    "\u062E\u0631\u06CC\u062F.",
                    React.createElement("br", null),
                    "\u06CC\u06A9 \u0645\u06A9\u062B.",
                    React.createElement("br", null),
                    React.createElement("span", null, "\u062D\u0627\u0644\u0650 \u062E\u0648\u0628.")),
                React.createElement("p", null, "\u0627\u0632 \u0633\u0628\u062F \u0647\u0648\u0634\u0645\u0646\u062F \u062A\u0627 \u06CC\u06A9 \u0641\u0646\u062C\u0627\u0646 \u0642\u0647\u0648\u0647\u061B \u0627\u0645\u06A9\u0627\u0646\u200C\u0647\u0627\u06CC \u062A\u0627\u0632\u0647 \u0631\u0627 \u0628\u0627 \u0627\u0645\u0636\u0627\u06CC \u0641\u0627\u0645\u06CC\u0644\u06CC \u062A\u0635\u0648\u0631 \u06A9\u0646\u06CC\u0645."),
                React.createElement("div", { className: "experience-links" },
                    React.createElement("button", { onClick: () => a.project('M07') },
                        React.createElement("span", null, "\u06F0\u06F1"),
                        React.createElement("strong", null, "\u062A\u0631\u0648\u0644\u06CC \u0647\u0648\u0634\u0645\u0646\u062F"),
                        React.createElement(I, { name: "arrow", size: 22 })),
                    React.createElement("button", { onClick: () => a.go('projects') },
                        React.createElement("span", null, "\u06F0\u06F2"),
                        React.createElement("strong", null, "\u06A9\u0634\u0641 \u062A\u062C\u0631\u0628\u0647\u200C\u0647\u0627\u06CC \u062A\u0627\u0632\u0647"),
                        React.createElement(I, { name: "arrow", size: 22 })))),
            React.createElement("figure", { className: "brand-feature-photo" },
                React.createElement("img", { src: media('brand-cafe.webp'), alt: "\u062A\u062C\u0633\u0645 \u0645\u0641\u0647\u0648\u0645\u06CC \u06A9\u0627\u0641\u0647 \u0641\u0631\u0648\u0634\u06AF\u0627\u0647\u06CC \u0641\u0627\u0645\u06CC\u0644\u06CC \u0628\u0627 \u0644\u0648\u06AF\u0648\u06CC \u0628\u0631\u0646\u062F\u061B \u0633\u0627\u062E\u062A\u0647\u200C\u0634\u062F\u0647 \u0628\u0627 \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC", loading: "lazy" }),
                React.createElement(BrandStamp, null),
                React.createElement("div", { className: "brand-photo-caption" },
                    React.createElement("span", { dir: "ltr" }, "A LITTLE MOMENT OF FAMILI."),
                    React.createElement("strong", null, "\u0637\u0639\u0645\u0650 \u06CC\u06A9 \u062A\u062C\u0631\u0628\u0647\u0654 \u062A\u0627\u0632\u0647.")),
                React.createElement("figcaption", null, "\u062A\u062C\u0633\u0645 \u0645\u0641\u0647\u0648\u0645\u06CC \u0628\u0627 \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC \u00B7 \u0645\u062F\u0644 \u062A\u062C\u0647\u06CC\u0632 \u0627\u0646\u062A\u062E\u0627\u0628 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A"))),
        React.createElement("section", { className: "story-section" },
            React.createElement("div", { className: "story-intro" },
                React.createElement("span", { className: "eyebrow" }, "\u0642\u0627\u0628\u200C\u0647\u0627\u06CC\u06CC \u0627\u0632 \u0627\u0645\u06A9\u0627\u0646\u200C\u0647\u0627\u06CC \u062A\u0627\u0632\u0647"),
                React.createElement("h2", null,
                    "\u0641\u0631\u062F\u0627 \u0631\u0627",
                    React.createElement("br", null),
                    React.createElement("span", null, "\u062A\u0645\u0627\u0634\u0627 \u06A9\u0646\u06CC\u062F.")),
                React.createElement("p", null,
                    "\u0627\u0632 \u06CC\u06A9 \u062A\u0635\u0648\u06CC\u0631 \u0634\u0631\u0648\u0639 \u06A9\u0646\u06CC\u062F.",
                    React.createElement("br", null),
                    "\u0628\u0647 \u0627\u06CC\u062F\u0647\u060C \u0634\u0648\u0627\u0647\u062F \u0648 \u0645\u0633\u06CC\u0631 \u0627\u062C\u0631\u0627 \u0628\u0631\u0633\u06CC\u062F."),
                React.createElement("button", { className: "text-link", onClick: () => a.modal({ type: 'manager', page: 1 }) },
                    "\u0648\u0631\u0642\u200C\u0632\u062F\u0646 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631 ",
                    React.createElement(I, { name: "arrow", size: 18 }))),
            React.createElement("div", { className: "story-grid" }, stories.map(([id, img, title, tag, page]) => React.createElement("button", { key: id, className: "story-card", onClick: () => a.project(id) },
                React.createElement("img", { src: media(img), alt: title + '؛ تصویر معرفی سند مدیر', loading: "lazy" }),
                React.createElement("span", { className: "story-tag" }, tag),
                React.createElement("span", { className: "story-caption" },
                    React.createElement("strong", null, title),
                    React.createElement("small", null,
                        "\u0633\u0646\u062F \u0645\u062F\u06CC\u0631 \u00B7 \u0635\u0641\u062D\u0647 ",
                        fa(page))),
                React.createElement("span", { className: "story-arrow" },
                    React.createElement(I, { name: "arrow", size: 18 })))))),
        React.createElement("section", { className: "featured-section" },
            React.createElement(Heading, { title: "\u0627\u06CC\u062F\u0647\u200C\u0647\u0627\u06CC \u0628\u0632\u0631\u06AF\u060C \u0627\u0632 \u0642\u062F\u0645\u200C\u0647\u0627\u06CC \u0645\u0644\u0645\u0648\u0633.", text: "\u067E\u0631\u0648\u0646\u062F\u0647\u200C\u0647\u0627\u06CC \u0645\u0646\u062A\u062E\u0628 \u0628\u0631\u0627\u06CC \u0622\u063A\u0627\u0632 \u06AF\u0641\u062A\u200C\u0648\u06AF\u0648\u06CC \u0647\u06CC\u0626\u062A\u200C\u0645\u062F\u06CC\u0631\u0647.", action: React.createElement(Btn, { kind: "ghost", small: true, icon: "arrow", onClick: () => a.go('projects') },
                    "\u0647\u0645\u0647 ",
                    fa(projects.length),
                    " \u0637\u0631\u062D") }),
            React.createElement("div", { className: "cards" }, ['M07', 'M16', 'M09', 'VEND', 'M15', 'M19'].map(id => React.createElement(Card, { key: id, p: PP[id], a: a })))),
        React.createElement("section", { className: "proof-band cinematic-proof" },
            React.createElement("div", { className: "proof-photo" },
                React.createElement("img", { src: media('figure-06-01.webp'), alt: "\u062A\u0635\u0648\u06CC\u0631 \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u062F\u0631 \u0635\u0641\u062D\u0647 \u06F6 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631", loading: "lazy" }),
                React.createElement("span", null, "\u062A\u0635\u0648\u06CC\u0631 \u0645\u0639\u0631\u0641\u06CC \u062F\u0631 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631 \u00B7 \u0635\u0641\u062D\u0647 \u06F6")),
            React.createElement("div", { className: "proof-copy" },
                React.createElement("span", { className: "eyebrow" }, "\u0641\u0631\u0627\u062A\u0631 \u0627\u0632 \u06CC\u06A9 \u0627\u06CC\u062F\u0647\u0654 \u0632\u06CC\u0628\u0627"),
                React.createElement("h2", null,
                    "\u067E\u0634\u062A \u0647\u0631 \u062A\u0635\u0648\u06CC\u0631\u060C",
                    React.createElement("br", null),
                    React.createElement("span", null, "\u06CC\u06A9 \u067E\u0631\u0648\u0646\u062F\u0647\u0654 \u0631\u0648\u0634\u0646.")),
                React.createElement("p", null, "\u0627\u0632 \u0646\u0645\u0648\u0646\u0647\u200C\u0647\u0627\u06CC \u062C\u0647\u0627\u0646\u06CC \u062A\u0627 \u062C\u0632\u0626\u06CC\u0627\u062A \u0647\u0632\u06CC\u0646\u0647\u061B \u0647\u0631 \u0645\u0633\u06CC\u0631 \u0631\u0627 \u0628\u0627 \u0633\u0646\u062F \u0648 \u062F\u0627\u0645\u0646\u0647\u0654 \u0645\u0634\u062E\u0635 \u062F\u0646\u0628\u0627\u0644 \u06A9\u0646\u06CC\u062F."),
                React.createElement("div", { className: "proof-mini-stats" },
                    React.createElement("div", null,
                        React.createElement("strong", null, fa(D.pages.length)),
                        React.createElement("span", null, "\u0635\u0641\u062D\u0647 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631")),
                    React.createElement("div", null,
                        React.createElement("strong", null, fa(Object.keys(D.families).length)),
                        React.createElement("span", null, "\u062E\u0627\u0646\u0648\u0627\u062F\u0647\u0654 \u0637\u0631\u062D"))),
                React.createElement(Btn, { kind: "light", icon: "book", onClick: () => a.go('library') }, "\u0648\u0631\u0648\u062F \u0628\u0647 \u06A9\u062A\u0627\u0628\u062E\u0627\u0646\u0647 \u0634\u0648\u0627\u0647\u062F"),
                React.createElement("small", { className: "proof-disclosure" }, "\u062A\u0635\u0627\u0648\u06CC\u0631 \u0645\u0639\u0631\u0641\u06CC\u060C \u0634\u0627\u0647\u062F \u0627\u062C\u0631\u0627 \u0646\u06CC\u0633\u062A\u0646\u062F\u061B \u0642\u06CC\u0645\u062A \u0645\u0634\u0627\u0647\u062F\u0647\u200C\u0634\u062F\u0647\u060C \u0628\u0648\u062F\u062C\u0647\u0654 \u0646\u0647\u0627\u06CC\u06CC \u0646\u06CC\u0633\u062A."))),
        React.createElement("section", { className: "home-session" },
            React.createElement("div", { className: "session-banner" },
                React.createElement("div", { className: "session-graphic", "aria-hidden": "true" },
                    React.createElement(I, { name: "play", size: 34 }),
                    React.createElement("i", null),
                    React.createElement("i", null)),
                React.createElement("div", null,
                    React.createElement("span", { className: "eyebrow" }, "\u0646\u0648\u0628\u062A \u06AF\u0641\u062A\u200C\u0648\u06AF\u0648\u0633\u062A"),
                    React.createElement("h2", null, "\u0641\u0631\u062F\u0627\u06CC \u0641\u0627\u0645\u06CC\u0644\u06CC \u0631\u0627 \u0628\u0627 \u0647\u0645 \u0628\u0633\u0627\u0632\u06CC\u0645."),
                    React.createElement("p", null,
                        React.createElement("b", null,
                            fa(a.state.agenda.length),
                            " \u0637\u0631\u062D"),
                        " \u062F\u0631 \u0641\u0647\u0631\u0633\u062A \u062C\u0644\u0633\u0647\u0654 \u0634\u0645\u0627\u061B \u0622\u0645\u0627\u062F\u0647\u0654 \u0627\u0646\u062A\u062E\u0627\u0628\u060C \u0628\u0631\u0631\u0633\u06CC \u0648 \u0627\u0631\u0627\u0626\u0647.")),
                React.createElement("div", { className: "session-actions" },
                    React.createElement(Btn, { icon: "play", onClick: () => a.present() }, "\u0634\u0631\u0648\u0639 \u0627\u0631\u0627\u0626\u0647"),
                    React.createElement("button", { className: "text-link", onClick: () => a.go('agenda') },
                        "\u0686\u06CC\u062F\u0646 \u0641\u0647\u0631\u0633\u062A \u062C\u0644\u0633\u0647 ",
                        React.createElement(I, { name: "arrow", size: 17 }))))));
}
function Catalogue({ a }) { const s = a.state; const ps = projects.filter(p => (!s.query || norm(p.search).includes(norm(s.query))) && (!s.family || p.family === s.family) && (!s.onlyPrice || p.quotes.length) && (!s.onlyManager || p.original.some(x => x.startsWith('M'))) && (!s.onlyFav || s.favorites.includes(p.id)) && (!s.onlyLead || p.lead === s.lens)); return React.createElement("div", { className: "page" },
    React.createElement("div", { className: "page-heading" },
        React.createElement("div", null,
            React.createElement("h1", null, "\u06A9\u0627\u062A\u0627\u0644\u0648\u06AF \u0627\u0635\u0644\u06CC\u060C \u06CC\u06A9\u200C\u062C\u0627."),
            React.createElement("p", null,
                fa(projects.length),
                " \u067E\u0631\u0648\u0646\u062F\u0647\u0654 \u0627\u0635\u0644\u06CC \u0628\u0631 \u067E\u0627\u06CC\u0647\u0654 \u0634\u0634 \u062E\u0627\u0646\u0648\u0627\u062F\u0647\u0654 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631\u061B \u062C\u0632\u0626\u06CC\u0627\u062A \u0648\u0627\u062D\u062F\u0647\u0627\u06CC \u0642\u0628\u0644\u06CC \u062F\u0631 \u0622\u0631\u0634\u06CC\u0648 \u0628\u0627\u0642\u06CC \u0627\u0633\u062A.")),
        React.createElement(Btn, { icon: "play", disabled: !ps.length, onClick: () => a.present(ps.map(p => p.id)) }, "\u0627\u0631\u0627\u0626\u0647 \u0627\u06CC\u0646 \u0641\u0647\u0631\u0633\u062A")),
    React.createElement("div", { className: "toolbar" },
        React.createElement("div", { className: "search" },
            React.createElement(I, { name: "search" }),
            React.createElement("input", { "aria-label": "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0637\u0631\u062D", value: s.query, placeholder: "\u0646\u0627\u0645 \u0637\u0631\u062D\u060C \u06A9\u062F\u060C \u0646\u06CC\u0627\u0632 \u06CC\u0627 \u0641\u0646\u0627\u0648\u0631\u06CC\u2026", onChange: e => a.set({ query: e.target.value }) }),
            s.query && React.createElement(IB, { name: "close", label: "\u067E\u0627\u06A9\u200C\u06A9\u0631\u062F\u0646 \u062C\u0633\u062A\u200C\u0648\u062C\u0648", onClick: () => a.set({ query: '' }) })),
        React.createElement(Lens, { a: a })),
    React.createElement("div", { className: "filter-row" }, [['onlyPrice', 'شاهد قیمت دارد'], ['onlyManager', 'در سند مدیر آمده'], ['onlyFav', 'نشان‌شده‌های من'], ['onlyLead', 'فقط نگاه منتخب']].map(([k, t]) => React.createElement("label", { key: k },
        React.createElement("input", { type: "checkbox", checked: s[k], onChange: e => a.set({ [k]: e.target.checked }) }),
        t))),
    React.createElement("div", { className: "catalogue" },
        React.createElement("aside", { className: "categories" },
            React.createElement("button", { className: !s.family ? 'selected' : '', onClick: () => a.set({ family: '' }) },
                React.createElement(I, { name: "layers" }),
                React.createElement("span", null, "\u0647\u0645\u0647 \u062E\u0627\u0646\u0648\u0627\u062F\u0647\u200C\u0647\u0627"),
                React.createElement("b", null, fa(projects.length))),
            Object.entries(D.families).map(([k, f]) => React.createElement("button", { key: k, className: s.family === k ? 'selected' : '', onClick: () => a.set({ family: k }) },
                React.createElement(I, { name: f.icon, size: 18 }),
                React.createElement("span", null, f.title),
                React.createElement("b", null, fa(projects.filter(p => p.family === k).length))))),
        React.createElement("div", null,
            React.createElement("div", { className: "result-count" },
                React.createElement("span", null,
                    React.createElement("strong", null, fa(ps.length)),
                    " \u067E\u0631\u0648\u0646\u062F\u0647 \u0642\u0627\u0628\u0644 \u0645\u0634\u0627\u0647\u062F\u0647"),
                React.createElement("span", null,
                    "\u0646\u0645\u0627\u06CC ",
                    LENSES[s.lens].label)),
            ps.length ? React.createElement("div", { className: "cards" }, ps.map(p => React.createElement(Card, { key: p.id, p: p, a: a }))) : React.createElement(Empty, { action: React.createElement(Btn, { onClick: () => a.set({ query: '', family: '', onlyPrice: false, onlyManager: false, onlyFav: false, onlyLead: false }) }, "\u067E\u0627\u06A9\u200C\u06A9\u0631\u062F\u0646 \u0641\u06CC\u0644\u062A\u0631\u0647\u0627") })))); }
function Iran({ p, a }) { const local = p.case_ids.map(id => CC[id]).filter(c => (c === null || c === void 0 ? void 0 : c.region) === 'iran'); return React.createElement("section", null,
    React.createElement(Heading, { title: "\u0627\u0628\u062A\u062F\u0627 \u0627\u06CC\u0631\u0627\u0646", text: p.iran_match }),
    !p.iran.length && !local.length ? React.createElement(Note, null, "\u0646\u0645\u0648\u0646\u0647 \u0627\u06CC\u0631\u0627\u0646\u06CC \u0647\u0645\u200C\u062F\u0627\u0645\u0646\u0647 \u062F\u0631 \u0627\u06CC\u0646 \u062B\u0628\u062A \u0627\u062D\u0631\u0627\u0632 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A. \u0627\u06CC\u0646 \u0646\u062A\u06CC\u062C\u0647 \u0628\u0647 \u0645\u0639\u0646\u06CC \u0646\u0628\u0648\u062F \u0645\u062D\u0635\u0648\u0644 \u062F\u0631 \u0627\u06CC\u0631\u0627\u0646 \u0646\u06CC\u0633\u062A.") : React.createElement("div", { className: "iran-list" },
        p.iran.map(id => { let s = SS[id]; return React.createElement("article", { key: id },
            React.createElement("div", null,
                React.createElement("span", { className: "local-icon" }, "\u0627\u06CC\u0631\u0627\u0646"),
                React.createElement("section", null,
                    React.createElement("h3", null, s.publisher),
                    React.createElement("p", null, s.title)),
                React.createElement(Btn, { kind: "ghost", small: true, icon: "external", onClick: () => a.modal({ type: 'source', id }) }, "\u0634\u0627\u0647\u062F \u0648 \u0645\u0646\u0628\u0639")),
            React.createElement("p", null, s.note),
            React.createElement("small", null,
                s.access,
                " \u00B7 ",
                React.createElement("bdi", null, s.checked_on || s.accessed_on))); }),
        local.map(c => React.createElement(CaseCard, { key: c.id, c: c, a: a })))); }
function Global({ p, a }) { const foreign = p.case_ids.map(id => CC[id]).filter(c => c && c.region !== 'iran'); return React.createElement("section", null,
    React.createElement(Heading, { title: "\u0633\u067E\u0633 \u062E\u0627\u0631\u062C \u0627\u0632 \u0627\u06CC\u0631\u0627\u0646", text: "\u0645\u062D\u0635\u0648\u0644\u060C \u0622\u0632\u0645\u0627\u06CC\u0634 \u0645\u062D\u062F\u0648\u062F \u0648 \u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u0633\u0631\u0627\u0633\u0631\u06CC\u060C \u0634\u0627\u0647\u062F\u0647\u0627\u06CC \u06CC\u06A9\u0633\u0627\u0646\u06CC \u0646\u06CC\u0633\u062A\u0646\u062F." }),
    foreign.length ? React.createElement("div", { className: "case-grid" }, foreign.map(c => React.createElement(CaseCard, { key: c.id, c: c, a: a }))) : !p.foreign.length ? React.createElement(Note, null, "\u0646\u0645\u0648\u0646\u0647 \u062E\u0627\u0631\u062C\u06CC \u0647\u0645\u200C\u062F\u0627\u0645\u0646\u0647 \u0628\u0647 \u0627\u06CC\u0646 \u06A9\u0627\u0631\u062A \u0645\u062A\u0635\u0644 \u0646\u0634\u062F\u0647\u061B \u0645\u062C\u0647\u0648\u0644 \u0631\u0627 \u0646\u062A\u06CC\u062C\u0647 \u0645\u0646\u0641\u06CC \u06CC\u0627 \u0627\u062B\u0628\u0627\u062A \u0646\u0628\u0648\u062F \u0645\u062D\u0635\u0648\u0644 \u0646\u0645\u06CC\u200C\u0646\u0627\u0645\u06CC\u0645.") : null,
    p.foreign.length > 0 && React.createElement("div", { className: "source-chips" }, p.foreign.map(id => React.createElement(Source, { key: id, id: id, a: a }))),
    p.foreign.length > 0 && React.createElement("p", { className: "caption" }, "\u0645\u0646\u0627\u0628\u0639 \u0628\u0627\u0644\u0627 \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0645\u0639\u0631\u0641\u06CC \u0645\u062D\u0635\u0648\u0644 \u0628\u0627\u0634\u0646\u062F\u060C \u0646\u0647 \u0645\u062D\u0644 \u0646\u0635\u0628 \u0646\u0627\u0645\u200C\u062F\u0627\u0631. \u0633\u0637\u062D \u0645\u0634\u0627\u0647\u062F\u0647 \u062F\u0631 \u067E\u0631\u0648\u0646\u062F\u0647 \u0645\u0646\u0628\u0639 \u0622\u0645\u062F\u0647 \u0627\u0633\u062A.")); }
function Proposal({ p, a }) { let idea = baseIdea(p); return React.createElement("div", { className: "detail-content" },
    React.createElement("section", { className: "definition" },
        React.createElement("small", null, "\u062A\u0648\u0636\u06CC\u062D \u062A\u062D\u0644\u06CC\u0644\u06CC \u0628\u0631\u0627\u06CC \u0627\u0631\u0627\u0626\u0647\u061B \u0646\u0647 \u0645\u0634\u062E\u0635\u0627\u062A \u0645\u0635\u0648\u0628 \u062E\u0631\u06CC\u062F"),
        React.createElement("h2", null, "\u0627\u06CC\u0646 \u0637\u0631\u062D \u062F\u0642\u06CC\u0642\u0627\u064B \u0686\u06CC\u0633\u062A\u061F"),
        React.createElement("p", null, p.definition)),
    React.createElement("div", { className: "two" },
        React.createElement("section", null,
            React.createElement("span", { className: "eyebrow" }, "\u0645\u0633\u0626\u0644\u0647 \u0648 \u0686\u0631\u0627\u06CC\u06CC"),
            React.createElement("h2", null, "\u0686\u0647 \u0686\u06CC\u0632\u06CC \u0642\u0631\u0627\u0631 \u0627\u0633\u062A \u0628\u0647\u062A\u0631 \u0634\u0648\u062F\u061F"),
            React.createElement("p", { className: "lead" }, reason(p)),
            React.createElement(Tag, { tone: "amber" }, "\u0646\u06CC\u0627\u0632\u0645\u0646\u062F \u062E\u0637 \u067E\u0627\u06CC\u0647 \u0648 \u0622\u0632\u0645\u0648\u0646")),
        React.createElement("section", null,
            React.createElement("span", { className: "eyebrow" }, "\u0646\u0633\u062E\u0647 \u0642\u0627\u0628\u0644 \u0644\u0645\u0633"),
            React.createElement("h2", null, "\u062C\u0631\u06CC\u0627\u0646 \u062A\u062C\u0631\u0628\u0647\u060C \u0646\u0647 \u0641\u0642\u0637 \u0641\u0646\u0627\u0648\u0631\u06CC"),
            React.createElement("p", null, idea.flow || p.scope),
            idea.mvp && React.createElement("div", { className: "soft" },
                React.createElement("strong", null, "\u0646\u0633\u062E\u0647 \u0622\u063A\u0627\u0632"),
                React.createElement("p", null, idea.mvp)))),
    React.createElement(Heading, { title: "\u0627\u0631\u0632\u0634 \u0627\u0632 \u0647\u0631 \u0633\u0647 \u0646\u06AF\u0627\u0647", text: "\u0627\u0646\u062A\u0638\u0627\u0631\u0627\u062A \u0637\u0631\u0627\u062D\u06CC\u200C\u0627\u0646\u062F\u061B \u0646\u0647 \u0646\u062A\u06CC\u062C\u0647 \u0645\u062D\u0642\u0642\u200C\u0634\u062F\u0647 \u06CC\u0627 \u0648\u0639\u062F\u0647 \u0628\u0627\u0632\u062F\u0647." }),
    React.createElement(ThreeValues, { p: p, a: a }),
    React.createElement(Flow, { p: p }),
    React.createElement("div", { className: "two" },
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null,
                React.createElement(I, { name: "target" }),
                "\u0686\u0647 \u0686\u06CC\u0632\u06CC \u0631\u0627 \u0645\u06CC\u200C\u0633\u0646\u062C\u06CC\u0645\u061F"),
            React.createElement("p", null, metric(p))),
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null,
                React.createElement(I, { name: "shield" }),
                "\u0645\u0631\u0632 \u062A\u0635\u0645\u06CC\u0645"),
            React.createElement("p", null, p.risk)))); }
function Costs({ p, a }) { return React.createElement("div", { className: "detail-content" },
    React.createElement(Note, { title: "\u0642\u06CC\u0645\u062A \u062C\u0632\u0621 \u06CC\u0627 \u0627\u0634\u062A\u0631\u0627\u06A9\u060C \u0628\u0648\u062F\u062C\u0647 \u0627\u062C\u0631\u0627\u06CC \u06A9\u0627\u0645\u0644 \u0646\u06CC\u0633\u062A" }, "\u062A\u0627\u0631\u06CC\u062E \u0645\u0634\u0627\u0647\u062F\u0647 \u06F1\u06F6 \u0627\u06A9\u062A\u0628\u0631 \u06F2\u06F0\u06F2\u06F6 \u0627\u0633\u062A. \u0645\u0627\u0644\u06CC\u0627\u062A\u060C \u062D\u0645\u0644\u060C \u0646\u0635\u0628 \u0648 \u062E\u062F\u0645\u0627\u062A \u0641\u0642\u0637 \u0648\u0642\u062A\u06CC \u0634\u0627\u0645\u0644\u200C\u0627\u0646\u062F \u06A9\u0647 \u0645\u0646\u0628\u0639 \u0635\u0631\u06CC\u062D\u0627\u064B \u06AF\u0641\u062A\u0647 \u0628\u0627\u0634\u062F. \u0627\u0631\u0632\u0647\u0627 \u062A\u0628\u062F\u06CC\u0644 \u06CC\u0627 \u0628\u0627 \u0647\u0645 \u062C\u0645\u0639 \u0646\u0634\u062F\u0647\u200C\u0627\u0646\u062F."),
    p.quotes.length ? React.createElement("div", { className: "quote-grid" }, p.quotes.map(id => React.createElement(Quote, { q: QQ[id], key: id, a: a }))) : React.createElement(Empty, { title: "\u0642\u06CC\u0645\u062A \u0639\u0645\u0648\u0645\u06CC \u0647\u0645\u200C\u062F\u0627\u0645\u0646\u0647 \u062A\u062B\u0628\u06CC\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A", text: "\u0645\u062F\u0644\u060C \u0645\u0642\u062F\u0627\u0631\u060C \u0634\u0631\u0627\u06CC\u0637 \u062A\u062D\u0648\u06CC\u0644 \u0648 \u062E\u062F\u0645\u0627\u062A \u0628\u0627\u06CC\u062F \u062F\u0631 \u0627\u0633\u062A\u0639\u0644\u0627\u0645 \u0645\u0634\u062E\u0635 \u0634\u0648\u0646\u062F. \u0645\u062C\u0647\u0648\u0644\u060C \u0635\u0641\u0631 \u0646\u06CC\u0633\u062A.", action: React.createElement(Btn, { kind: "ghost", icon: "file", onClick: () => a.doc('13-benchmarks-prices/rfq.md') }, "\u0642\u0627\u0644\u0628 \u0627\u0633\u062A\u0639\u0644\u0627\u0645") }),
    React.createElement(Scenario, { key: p.id, p: p })); }
function Execution({ p, a }) { const i = baseIdea(p), v = p.device || {}; return React.createElement("div", { className: "detail-content" },
    React.createElement("div", { className: "pilot" },
        React.createElement(I, { name: "target", size: 31 }),
        React.createElement("div", null,
            React.createElement("small", null, "\u062F\u0627\u0645\u0646\u0647 \u0627\u0648\u0644\u06CC\u0647 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC\u061B \u067E\u0627\u06CC\u0644\u0648\u062A \u0627\u062C\u0631\u0627 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A"),
            React.createElement("h2", null, p.scope))),
    React.createElement("div", { className: "two" },
        React.createElement("section", null,
            React.createElement("h2", null, "\u062F\u0627\u062F\u0647 \u0648 \u0627\u062A\u0635\u0627\u0644"),
            React.createElement("p", null, i.data || v.data || 'داده معتبر همان جریان، شناسه پایدار، نسخه و سطح دسترسی، همراه ثبت نتیجه و اتصال کنترل‌شده به سامانه موجود؛ دامنه دقیق در کشف مشخص می‌شود.'),
            React.createElement("h3", null, "\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0648 \u0632\u06CC\u0631\u0633\u0627\u062E\u062A"),
            React.createElement("p", null, i.hardware || v.hardware || 'تعداد و مدل، ظرفیت برق و شبکه، ایمنی و امکان نگهداری باید برای همین دامنه در استعلام تثبیت شوند.')),
        React.createElement("section", null,
            React.createElement("h2", null, "\u0645\u0627\u0644\u06A9 \u0648 \u0645\u0633\u0626\u0648\u0644\u06CC\u062A"),
            React.createElement("p", null, i.owner || 'مالک حوزه کسب‌وکار، عملیات شعبه و فناوری؛ بررسی هزینه با مالی و الزامات تخصصی با مسئول مربوط.'),
            React.createElement("h3", null, "\u0633\u0627\u062E\u062A\u060C \u062E\u0631\u06CC\u062F \u06CC\u0627 \u0645\u0634\u0627\u0631\u06A9\u062A"),
            React.createElement("p", null, i.build || 'قابلیت موجود ابتدا بررسی شود؛ خرید تجهیز از توسعه تجربه و اتصال جداست. تصمیم پس از آزمایش هم‌دامنه.'))),
    React.createElement(Note, { title: "\u0631\u06CC\u0633\u06A9 \u0627\u062E\u062A\u0635\u0627\u0635\u06CC" }, v.risk || p.risk),
    React.createElement(Heading, { title: "\u062F\u0631\u0648\u0627\u0632\u0647\u200C\u0647\u0627\u06CC \u062A\u0635\u0645\u06CC\u0645 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC", text: "\u067E\u06CC\u0634\u0631\u0648\u06CC \u0628\u0631 \u0627\u0633\u0627\u0633 \u0646\u062A\u06CC\u062C\u0647\u061B \u0646\u0647 \u0648\u0639\u062F\u0647\u200C\u0647\u0627\u06CC \u0641\u0631\u0648\u0634\u0646\u062F\u0647 \u06CC\u0627 \u0638\u0627\u0647\u0631 \u0627\u0628\u0632\u0627\u0631." }),
    React.createElement("div", { className: "timeline" }, [['۰۱', 'شناخت و خط پایه', 'دامنه، داده، مالک و معیار توقف'], ['۰۲', 'نمونه و اجرای سایه', 'آزمون جریان کامل و حالات خطا'], ['۰۳', 'آزمایش محدود', 'کیفیت، پذیرش و هزینه خدمت'], ['۰۴', 'ادامه، اصلاح یا توقف', 'تصمیم مرحله بعد براساس شواهد']].map(([n, t, x]) => React.createElement("section", { key: n },
        React.createElement("b", null, n),
        React.createElement("h3", null, t),
        React.createElement("p", null, x)))),
    p.papers.length > 0 && React.createElement("section", null,
        React.createElement(Heading, { title: "\u067E\u0698\u0648\u0647\u0634 \u0645\u0631\u062A\u0628\u0637" }),
        React.createElement("div", { className: "resource-list" }, p.papers.map(id => { let r = D.papers.find(x => x.id === id); return React.createElement("button", { key: id, onClick: () => a.modal({ type: 'paper', id }) },
            React.createElement(I, { name: "book" }),
            React.createElement("div", null,
                React.createElement("h3", { dir: "auto" }, r.title),
                React.createElement("p", null,
                    r.design,
                    " \u00B7 ",
                    r.year)),
            React.createElement(I, { name: "external" })); }))),
    p.repos.length > 0 && React.createElement("section", null,
        React.createElement(Heading, { title: "\u0645\u062E\u0632\u0646\u200C\u0647\u0627 \u0648 \u0645\u0633\u06CC\u0631 \u0641\u0646\u06CC", text: "\u062B\u0628\u062A \u067E\u0698\u0648\u0647\u0634\u200C\u0627\u0646\u062F\u061B \u0627\u062C\u0631\u0627 \u0648 \u0622\u0632\u0645\u0648\u0646 \u06A9\u062F \u06CC\u0627 \u062A\u0623\u06CC\u06CC\u062F \u0645\u062C\u0648\u0632 \u0627\u0646\u062C\u0627\u0645 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A." }),
        React.createElement("div", { className: "resource-list" }, p.repos.map(id => { let r = D.repos.find(x => x.id === id); return React.createElement("button", { key: id, onClick: () => a.modal({ type: 'repo', id }) },
            React.createElement(I, { name: "layers" }),
            React.createElement("div", null,
                React.createElement("h3", { dir: "ltr" }, r.name),
                React.createElement("p", null, r.function)),
            React.createElement(I, { name: "external" })); }))),
    React.createElement(QA, { p: p, a: a })); }
function Documents({ p, a }) { var _a; let sources = [...new Set(p.iran.concat(p.foreign, p.case_ids.flatMap(id => { var _a; return ((_a = CC[id]) === null || _a === void 0 ? void 0 : _a.sources) || []; }), p.quotes.map(id => { var _a; return (_a = QQ[id]) === null || _a === void 0 ? void 0 : _a.sourceId; }).filter(Boolean)))]; return React.createElement("div", { className: "detail-content" },
    React.createElement("div", { className: "two" },
        React.createElement("section", null,
            React.createElement(Heading, { title: "\u0627\u0635\u0644 \u067E\u0631\u0648\u0646\u062F\u0647 \u0648 \u0645\u062F\u0627\u0631\u06A9 \u0645\u0631\u062A\u0628\u0637" }),
            React.createElement(DocLink, { path: p.path, title: 'تمام متن اصلی ' + p.id, a: a }),
            React.createElement("div", { className: "source-chips" }, p.original.map(id => React.createElement("button", { className: "tag green", key: id, onClick: () => { let m = D.topics.find(x => x.id === id); m ? a.modal({ type: 'manager', page: Number(m.page) }) : a.doc(docFor(id) || p.path); } }, id))),
            React.createElement("div", { className: "doc-links" }, p.docs.map(path => React.createElement(DocLink, { key: path, path: path, a: a })))),
        React.createElement("section", null,
            React.createElement(Heading, { title: "\u062A\u0635\u0627\u0648\u06CC\u0631 \u0648 \u062C\u0627\u06CC\u06AF\u0627\u0647 \u062F\u0631 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631" }),
            p.pages.length ? p.pages.map(pg => React.createElement("button", { className: "page-thumbnail", key: pg, onClick: () => a.modal({ type: 'manager', page: pg }) },
                React.createElement("img", { loading: "lazy", src: media('page-' + String(pg).padStart(2, '0') + '.webp'), alt: 'صفحه ' + pg + ' سند مدیر' }),
                React.createElement("span", null,
                    "\u0635\u0641\u062D\u0647 ",
                    fa(pg),
                    " \u2014 \u0645\u0634\u0627\u0647\u062F\u0647 \u06A9\u0627\u0645\u0644"))) : React.createElement(Note, null, "\u0627\u06CC\u0646 \u0637\u0631\u062D \u0627\u0641\u0632\u0648\u062F\u0647 \u067E\u0698\u0648\u0647\u0634 \u0627\u0633\u062A \u0648 \u0635\u0641\u062D\u0647 \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u062F\u0631 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631 \u0646\u062F\u0627\u0631\u062F."),
            React.createElement("p", { className: "caption" }, "\u062A\u0635\u0627\u0648\u06CC\u0631 \u0633\u0646\u062F\u060C \u0646\u0645\u0648\u0646\u0647 \u0645\u0639\u0631\u0641\u06CC\u200C\u0627\u0646\u062F\u061B \u0645\u062F\u0644 \u0627\u0646\u062A\u062E\u0627\u0628\u06CC \u062E\u0631\u06CC\u062F\u060C \u062D\u0642\u0648\u0642 \u0628\u0627\u0632\u0646\u0634\u0631 \u0645\u0633\u062A\u0642\u0644 \u06CC\u0627 \u0646\u0635\u0628 \u062F\u0631 \u0641\u0627\u0645\u06CC\u0644\u06CC \u0631\u0627 \u0627\u062B\u0628\u0627\u062A \u0646\u0645\u06CC\u200C\u06A9\u0646\u0646\u062F."),
            React.createElement(DocLink, { path: "10-discovery/media-and-discussions.md", title: "\u062F\u0641\u062A\u0631 \u062F\u0645\u0648\u0647\u0627 \u0648 \u06AF\u0641\u062A\u200C\u0648\u06AF\u0648\u0647\u0627\u06CC \u0639\u0645\u0648\u0645\u06CC", a: a }))),
    React.createElement(Heading, { title: "\u0645\u0646\u0627\u0628\u0639 \u0642\u0627\u0628\u0644 \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u067E\u0631\u0648\u0646\u062F\u0647" }),
    React.createElement("div", { className: "source-chips" }, sources.map(id => React.createElement(Source, { id: id, key: id, a: a }))),
    ((_a = p.concept_ids) === null || _a === void 0 ? void 0 : _a.length) > 0 && React.createElement("section", null,
        React.createElement(Heading, { title: "\u0645\u0641\u0647\u0648\u0645\u200C\u0647\u0627\u06CC \u062A\u0631\u06A9\u06CC\u0628\u06CC \u0645\u0631\u062A\u0628\u0637" }),
        React.createElement("div", { className: "source-chips" }, p.concept_ids.map(id => { var _a; return React.createElement("button", { key: id, className: "tag blue", onClick: () => a.modal({ type: 'concept', id }) },
            id,
            " \u2014 ", (_a = D.concepts.find(c => c.id === id)) === null || _a === void 0 ? void 0 :
            _a.title); })))); }
function Detail({ a }) { let p = PP[a.state.id] || projects[0], tab = a.state.tab; const tabs = [['overview', 'طرح و ارزش'], ['benchmarks', 'ایران و جهان'], ['cost', 'قیمت و هزینه'], ['execution', 'اجرا و ریسک'], ['documents', 'اسناد و رسانه']]; return React.createElement("div", { className: "page detail" },
    React.createElement("div", { className: "detail-nav" },
        React.createElement("button", { className: "text-link", onClick: () => a.go('projects') },
            React.createElement(I, { name: "right", size: 18 }),
            "\u0647\u0645\u0647 \u0637\u0631\u062D\u200C\u0647\u0627"),
        React.createElement("div", null,
            React.createElement(IB, { name: "right", label: "\u0637\u0631\u062D \u0642\u0628\u0644\u06CC", onClick: () => a.nextProject(-1) }),
            React.createElement("span", null,
                p.id,
                " / ",
                fa(projects.length)),
            React.createElement(IB, { name: "arrow", label: "\u0637\u0631\u062D \u0628\u0639\u062F\u06CC", onClick: () => a.nextProject(1) }))),
    React.createElement("section", { className: "detail-hero" },
        React.createElement("div", null,
            React.createElement("span", { className: "detail-code" },
                D.families[p.family].title,
                React.createElement("code", null, p.id)),
            React.createElement("h1", null, p.title),
            React.createElement("p", null, cut(p.perspectives[a.state.lens], 220)),
            React.createElement("div", { className: "actions" },
                React.createElement(Btn, { kind: "light", icon: "play", onClick: () => a.present([p.id]) }, "\u0627\u0631\u0627\u0626\u0647 \u0627\u06CC\u0646 \u0637\u0631\u062D"),
                React.createElement(Btn, { kind: "outline", icon: a.state.agenda.includes(p.id) ? 'check' : 'plus', onClick: () => a.toggle('agenda', p.id) }, a.state.agenda.includes(p.id) ? 'در فهرست جلسه' : 'افزودن به جلسه'),
                React.createElement(IB, { name: "compare", label: "\u0645\u0642\u0627\u06CC\u0633\u0647 \u0627\u06CC\u0646 \u0637\u0631\u062D", active: a.state.compare.includes(p.id), onClick: () => a.compare(p.id) }))),
        React.createElement(Visual, { p: p, big: true, a: a })),
    React.createElement("div", { className: "detail-tabs" },
        React.createElement("div", { role: "tablist", "aria-label": "\u0628\u062E\u0634 \u067E\u0631\u0648\u0646\u062F\u0647" }, tabs.map(([k, t]) => React.createElement("button", { key: k, role: "tab", "aria-selected": tab === k, className: tab === k ? 'selected' : '', onClick: () => a.set({ tab: k }) },
            t,
            k === 'cost' && p.quotes.length > 0 && React.createElement("span", { className: "dot" })))),
        React.createElement(Lens, { a: a })),
    React.createElement("div", { className: "detail-panel", key: p.id + tab }, tab === 'overview' ? React.createElement(Proposal, { p: p, a: a }) : tab === 'benchmarks' ? React.createElement("div", { className: "detail-content" },
        React.createElement(Iran, { p: p, a: a }),
        React.createElement(Global, { p: p, a: a })) : tab === 'cost' ? React.createElement(Costs, { p: p, a: a }) : tab === 'execution' ? React.createElement(Execution, { p: p, a: a }) : React.createElement(Documents, { p: p, a: a })),
    React.createElement("div", { className: "detail-footer" },
        React.createElement("span", null, "\u067E\u0631\u0648\u0646\u062F\u0647 \u0645\u0633\u062A\u0642\u0644 \u00B7 \u0645\u0631\u062C\u0639 \u067E\u0698\u0648\u0647\u0634 \u06F1\u06F6 \u0627\u06A9\u062A\u0628\u0631 \u06F2\u06F0\u06F2\u06F6"),
        React.createElement(Btn, { icon: "arrow", onClick: () => a.nextProject(1) }, "\u0637\u0631\u062D \u0628\u0639\u062F\u06CC"))); }
function Prices({ a }) { let s = a.state, qs = quotes.filter(q => (!s.priceQuery || norm(q.product + ' ' + q.publisher + ' ' + q.id).includes(norm(s.priceQuery))) && (!s.currency || q.currency === s.currency) && (!s.market || q.market === s.market)); return React.createElement("div", { className: "page" },
    React.createElement("div", { className: "page-heading" },
        React.createElement("div", null,
            React.createElement("h1", null, "\u0642\u06CC\u0645\u062A\u060C \u0628\u0627 \u062F\u0627\u0645\u0646\u0647\u0654 \u0631\u0648\u0634\u0646."),
            React.createElement("p", null,
                fa(quotes.length),
                " \u0645\u0634\u0627\u0647\u062F\u0647 \u0642\u06CC\u0645\u062A\u061B \u0627\u0631\u0632\u0647\u0627 \u0648 \u0648\u0627\u062D\u062F\u0647\u0627\u06CC \u0646\u0627\u0647\u0645\u200C\u0633\u0646\u062E \u062C\u0645\u0639 \u0646\u0645\u06CC\u200C\u0634\u0648\u0646\u062F.")),
        React.createElement(Btn, { icon: "download", onClick: () => original('pricebook.xlsx') }, "Excel \u0627\u0635\u0644\u06CC \u0642\u06CC\u0645\u062A\u200C\u0647\u0627")),
    React.createElement(Note, { title: "\u067E\u06CC\u0634\u200C\u0641\u0627\u06A9\u062A\u0648\u0631 \u0646\u06CC\u0633\u062A" }, "\u0642\u06CC\u0645\u062A\u200C\u0647\u0627\u06CC \u0627\u06CC\u0646 \u062B\u0628\u062A \u0645\u062A\u0639\u0644\u0642 \u0628\u0647 \u067E\u0698\u0648\u0647\u0634 \u06F1\u06F6 \u0627\u06A9\u062A\u0628\u0631 \u06F2\u06F0\u06F2\u06F6 \u0647\u0633\u062A\u0646\u062F\u061B \u0628\u0631\u0627\u06CC \u062E\u0631\u06CC\u062F\u060C \u0645\u062F\u0644\u060C \u0645\u0648\u062C\u0648\u062F\u06CC \u0648 \u0634\u0631\u0627\u06CC\u0637 \u062A\u062D\u0648\u06CC\u0644 \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0623\u06CC\u06CC\u062F \u0634\u0648\u0646\u062F."),
    React.createElement("div", { className: "toolbar" },
        React.createElement("div", { className: "search" },
            React.createElement(I, { name: "search" }),
            React.createElement("input", { "aria-label": "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0642\u06CC\u0645\u062A", value: s.priceQuery, onChange: e => a.set({ priceQuery: e.target.value }), placeholder: "\u0645\u062D\u0635\u0648\u0644\u060C \u0641\u0631\u0648\u0634\u0646\u062F\u0647 \u06CC\u0627 \u0634\u0646\u0627\u0633\u0647 \u0642\u06CC\u0645\u062A\u2026" })),
        React.createElement("select", { "aria-label": "\u0627\u0631\u0632", value: s.currency, onChange: e => a.set({ currency: e.target.value }) },
            React.createElement("option", { value: "" }, "\u0647\u0645\u0647 \u0627\u0631\u0632\u0647\u0627 \u2014 \u062C\u062F\u0627 \u0627\u0632 \u0647\u0645"),
            [...new Set(quotes.map(q => q.currency))].map(c => React.createElement("option", { key: c }, c))),
        React.createElement("select", { "aria-label": "\u0628\u0627\u0632\u0627\u0631", value: s.market, onChange: e => a.set({ market: e.target.value }) },
            React.createElement("option", { value: "" }, "\u0627\u06CC\u0631\u0627\u0646 \u0648 \u062E\u0627\u0631\u062C"),
            [...new Set(quotes.map(q => q.market))].map(c => React.createElement("option", { key: c }, c)))),
    React.createElement("div", { className: "result-count" },
        fa(qs.length),
        " \u0645\u0634\u0627\u0647\u062F\u0647 \u0642\u06CC\u0645\u062A"),
    React.createElement("div", { className: "table-wrap" },
        React.createElement("table", null,
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "\u0645\u062D\u0635\u0648\u0644 \u0648 \u0645\u0646\u0628\u0639"),
                    React.createElement("th", null, "\u0628\u0627\u0632\u0627\u0631"),
                    React.createElement("th", null, "\u0645\u0628\u0644\u063A \u0645\u0634\u0627\u0647\u062F\u0647\u200C\u0634\u062F\u0647"),
                    React.createElement("th", null, "\u0648\u0627\u062D\u062F \u0648 \u062A\u0639\u0647\u062F"),
                    React.createElement("th", null, "\u062F\u0627\u0645\u0646\u0647 / \u0648\u0636\u0639\u06CC\u062A"),
                    React.createElement("th", null))),
            React.createElement("tbody", null, qs.map(q => React.createElement("tr", { key: q.id },
                React.createElement("td", null,
                    React.createElement("strong", null, q.product),
                    React.createElement("small", null,
                        q.publisher,
                        " \u00B7 ",
                        q.id)),
                React.createElement("td", null,
                    React.createElement(Tag, { tone: q.market === 'ایران' ? 'green' : 'blue' }, q.market)),
                React.createElement("td", { className: "price-cell" }, price(q)),
                React.createElement("td", null,
                    React.createElement("strong", null, q.unit),
                    React.createElement("small", null, q.billing)),
                React.createElement("td", null,
                    q.status,
                    React.createElement("small", null, q.scope)),
                React.createElement("td", null,
                    React.createElement(IB, { name: "external", label: 'جزئیات ' + q.id, onClick: () => a.modal({ type: 'quote', id: q.id }) }))))))),
    !qs.length && React.createElement(Empty, null),
    React.createElement("div", { className: "two spaced" },
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null, "\u0642\u06CC\u0645\u062A \u062A\u062C\u0647\u06CC\u0632 \u2260 \u0647\u0632\u06CC\u0646\u0647 \u06A9\u0644 \u0627\u062C\u0631\u0627"),
            React.createElement("p", null, "\u0646\u0635\u0628\u060C \u0627\u062A\u0635\u0627\u0644\u060C \u062F\u0627\u062F\u0647\u060C \u0622\u0645\u0648\u0632\u0634\u060C \u0645\u062C\u0648\u0632\u060C \u0645\u0635\u0631\u0641\u06CC \u0648 \u0646\u06AF\u0647\u062F\u0627\u0634\u062A \u0631\u0627 \u062C\u062F\u0627 \u0628\u0628\u06CC\u0646\u06CC\u062F. \u0642\u06CC\u0645\u062A \u06CC\u06A9 \u0642\u0637\u0639\u0647 \u0631\u0627 \u0628\u0647 \u0631\u0627\u0647\u06A9\u0627\u0631 \u06A9\u0627\u0645\u0644 \u0646\u0633\u0628\u062A \u0646\u062F\u0647\u06CC\u062F.")),
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null, "\u0637\u0631\u062D\u200C\u0647\u0627\u06CC \u0628\u062F\u0648\u0646 \u0642\u06CC\u0645\u062A \u0639\u0645\u0648\u0645\u06CC"),
            React.createElement("p", null,
                fa(projects.filter(p => !p.quotes.length).length),
                " \u067E\u0631\u0648\u0646\u062F\u0647 \u0646\u06CC\u0627\u0632\u0645\u0646\u062F \u0627\u0633\u062A\u0639\u0644\u0627\u0645 \u0647\u0645\u200C\u062F\u0627\u0645\u0646\u0647\u200C\u0627\u0646\u062F\u061B \u0645\u062C\u0647\u0648\u0644\u060C \u0635\u0641\u0631 \u0646\u06CC\u0633\u062A."),
            React.createElement(Btn, { kind: "ghost", small: true, icon: "file", onClick: () => a.doc('13-benchmarks-prices/rfq.md') }, "\u0642\u0627\u0644\u0628 \u0627\u0633\u062A\u0639\u0644\u0627\u0645")))); }
/* 20-research.jsx */
const REGIONS = { iran: ['ایران', 54, 32], 'east-asia': ['شرق آسیا', 125, 38], 'southeast-asia': ['جنوب‌شرق آسیا', 104, 7], 'south-asia': ['جنوب آسیا', 77, 22], 'middle-east': ['خاورمیانه', 47, 19], europe: ['اروپا', 9, 52], 'north-america': ['آمریکا', -100, 36], canada: ['کانادا', -107, 58], 'latin-north': ['مکزیک', -102, 21], 'south-america': ['آمریکای جنوبی', -62, -18], africa: ['آفریقا', 23, -25], oceania: ['اقیانوسیه', 139, -26], 'global-products': ['محصولات جهانی'], research: ['پژوهش و مقاله'] };
function Atlas({ a }) { const s = a.state, cs = cases.filter(c => (!s.region || c.region === s.region) && (!s.caseQuery || norm(c.search).includes(norm(s.caseQuery))) && (!s.maturity || c.maturity_group === s.maturity)); return React.createElement("div", { className: "page" },
    React.createElement("div", { className: "page-heading" },
        React.createElement("div", null,
            React.createElement("h1", null, "\u062C\u0647\u0627\u0646 \u0686\u0647 \u0686\u06CC\u0632\u06CC \u0631\u0627 \u0622\u0632\u0645\u0648\u062F\u0647 \u0627\u0633\u062A\u061F"),
            React.createElement("p", null,
                fa(cases.length),
                " \u067E\u0631\u0648\u0646\u062F\u0647 \u0627\u0632 \u0627\u06CC\u0631\u0627\u0646 \u0648 \u062C\u0647\u0627\u0646\u061B \u0627\u0632 \u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u062A\u0627 \u0639\u0631\u0636\u0647 \u0645\u062D\u0635\u0648\u0644 \u0648 \u067E\u0698\u0648\u0647\u0634.")),
        React.createElement(Tag, { tone: "green" }, "\u0645\u0631\u062D\u0644\u0647 \u0648\u0627\u0642\u0639\u06CC \u0648 \u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0647\u0631 \u0634\u0627\u0647\u062F\u060C \u062C\u062F\u0627\u0633\u062A")),
    React.createElement("section", { className: "atlas-hero" },
        React.createElement("div", { className: "world" },
            React.createElement("svg", { viewBox: "0 0 960 435", "aria-label": "\u067E\u0631\u0627\u06A9\u0646\u062F\u06AF\u06CC \u0645\u0646\u0637\u0642\u0647\u200C\u0627\u06CC \u067E\u0631\u0648\u0646\u062F\u0647\u200C\u0647\u0627\u060C \u0646\u0647 \u0645\u062D\u0644 \u062F\u0642\u06CC\u0642 \u0641\u0631\u0648\u0634\u06AF\u0627\u0647", role: "img" },
                React.createElement("g", { className: "land" }, D.worldPaths.map((d, i) => React.createElement("path", { d: d, key: i }))),
                Object.entries(REGIONS).filter(([k, v]) => v.length > 1).map(([k, v]) => { let n = cases.filter(c => c.region === k).length, x = (v[1] + 180) / 360 * 960, y = (83 - v[2]) / 143 * 410; return React.createElement("g", { role: "button", tabIndex: "0", ref: el => { if (el)
                        el.setAttribute('tabindex', '0'); }, key: k, "aria-label": v[0] + '، ' + n + ' پرونده', className: cx('map-point', s.region === k && 'selected'), onClick: () => a.set({ region: s.region === k ? '' : k }), onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        a.set({ region: k });
                    } } },
                    React.createElement("circle", { className: "halo", cx: x, cy: y, r: 21 + Math.sqrt(n) * 2 }),
                    React.createElement("circle", { cx: x, cy: y, r: 13 + Math.sqrt(n) * 1.5 }),
                    React.createElement("text", { x: x, y: y + 5, textAnchor: "middle" }, fa(n)),
                    React.createElement("title", null,
                        v[0],
                        " \u2014 ",
                        n,
                        " \u067E\u0631\u0648\u0646\u062F\u0647")); })),
            React.createElement("small", null,
                React.createElement("span", { className: "dot" }),
                " \u0627\u0639\u062F\u0627\u062F\u060C \u062A\u0639\u062F\u0627\u062F \u067E\u0631\u0648\u0646\u062F\u0647\u200C\u0647\u0627\u06CC \u0647\u0645\u06CC\u0646 \u067E\u0698\u0648\u0647\u0634\u200C\u0627\u0646\u062F\u061B \u0646\u0647 \u062A\u0639\u062F\u0627\u062F \u0634\u0639\u0628 \u06CC\u0627 \u0633\u0647\u0645 \u0628\u0627\u0632\u0627\u0631."),
            React.createElement("span", { className: "map-credit" }, "Natural Earth \u00B7 \u0645\u06A9\u0627\u0646 \u0646\u0642\u0627\u0637\u060C \u062A\u0642\u0631\u06CC\u0628\u06CC\u0650 \u0645\u0646\u0637\u0642\u0647 \u0627\u0633\u062A.")),
        React.createElement("aside", null,
            React.createElement("h2", null, "\u0646\u0645\u0648\u0646\u0647\u200C\u0647\u0627 \u06CC\u06A9\u0633\u0627\u0646 \u0646\u06CC\u0633\u062A\u0646\u062F."),
            React.createElement("p", null, "\u0622\u0632\u0645\u0627\u06CC\u0634 \u0645\u062D\u062F\u0648\u062F\u060C \u0645\u062D\u0635\u0648\u0644 \u0642\u0627\u0628\u0644 \u062E\u0631\u06CC\u062F \u0648 \u067E\u0698\u0648\u0647\u0634 \u062F\u0627\u0646\u0634\u06AF\u0627\u0647\u06CC \u0631\u0627 \u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u0633\u0631\u0627\u0633\u0631\u06CC \u06CC\u0627 \u0646\u062A\u06CC\u062C\u0647 \u062A\u0636\u0645\u06CC\u0646\u06CC \u0646\u0646\u0627\u0645\u06CC\u0645."),
            React.createElement("div", { className: "maturity" }, [...new Set(cases.map(c => c.maturity_group))].map(v => React.createElement("button", { key: v, className: s.maturity === v ? 'selected' : '', onClick: () => a.set({ maturity: s.maturity === v ? '' : v }) },
                React.createElement("span", null, v),
                React.createElement("b", null, fa(cases.filter(c => c.maturity_group === v).length))))))),
    React.createElement("div", { className: "region-tabs" },
        React.createElement("button", { className: !s.region ? 'selected' : '', onClick: () => a.set({ region: '' }) }, "\u0647\u0645\u0647 \u0645\u0646\u0627\u0637\u0642"),
        Object.entries(REGIONS).map(([k, v]) => React.createElement("button", { key: k, className: s.region === k ? 'selected' : '', onClick: () => a.set({ region: k }) },
            v[0],
            React.createElement("small", null, fa(cases.filter(c => c.region === k).length))))),
    React.createElement("div", { className: "toolbar" },
        React.createElement("div", { className: "search" },
            React.createElement(I, { name: "search" }),
            React.createElement("input", { "aria-label": "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0628\u0646\u0686\u0645\u0627\u0631\u06A9", value: s.caseQuery, onChange: e => a.set({ caseQuery: e.target.value }), placeholder: "\u0634\u0631\u06A9\u062A\u060C \u06A9\u0634\u0648\u0631 \u06CC\u0627 \u0645\u0633\u0626\u0644\u0647\u2026" })),
        React.createElement("select", { "aria-label": "\u0645\u0631\u062D\u0644\u0647 \u0628\u0646\u0686\u0645\u0627\u0631\u06A9", value: s.maturity, onChange: e => a.set({ maturity: e.target.value }) },
            React.createElement("option", { value: "" }, "\u0647\u0645\u0647 \u0645\u0631\u0627\u062D\u0644"),
            [...new Set(cases.map(c => c.maturity_group))].map(v => React.createElement("option", { key: v }, v)))),
    React.createElement("div", { className: "result-count" },
        React.createElement("span", null,
            fa(cs.length),
            " \u067E\u0631\u0648\u0646\u062F\u0647"),
        (s.maturity || s.region) && React.createElement("button", { className: "text-link", onClick: () => a.set({ region: '', maturity: '' }) }, "\u067E\u0627\u06A9\u200C\u06A9\u0631\u062F\u0646 \u0641\u06CC\u0644\u062A\u0631")),
    React.createElement("div", { className: "case-grid atlas-cases" }, cs.map(c => React.createElement(CaseCard, { key: c.id, c: c, a: a }))),
    !cs.length && React.createElement(Empty, null)); }
function Library({ a }) { let s = a.state, q = norm(s.docQuery), ds = D.docs.filter(d => (s.archives || !d.archive) && (!s.docType || d.type === s.docType) && (!q || norm(d.title + ' ' + d.path).includes(q) || (s.fullText && window.FAMILI_LIBRARY && norm(window.FAMILI_LIBRARY[d.path].search).includes(q)))), pages = Math.max(1, Math.ceil(ds.length / 24)), pg = Math.min(s.docPage, pages - 1); return React.createElement("div", { className: "page" },
    React.createElement("div", { className: "page-heading" },
        React.createElement("div", null,
            React.createElement("h1", null, "\u0647\u06CC\u0686 \u0634\u0627\u0647\u062F\u06CC \u062F\u0648\u0631 \u0627\u0632 \u062F\u0633\u062A\u0631\u0633 \u0646\u06CC\u0633\u062A."),
            React.createElement("p", null,
                fa(D.docs.length),
                " \u0633\u0646\u062F \u0642\u0627\u0628\u0644 \u0645\u0637\u0627\u0644\u0639\u0647\u061B ",
                fa(D.baseFiles),
                " \u0641\u0627\u06CC\u0644 \u0627\u0635\u0644\u06CC \u0628\u0647\u200C\u0639\u0644\u0627\u0648\u0647 \u0645\u0631\u0627\u062C\u0639 \u0645\u06A9\u0645\u0644 \u067E\u0631\u0648\u0698\u0647.")),
        React.createElement(Btn, { icon: "download", onClick: () => original('research-original.zip') }, "\u0622\u0631\u0634\u06CC\u0648 \u0627\u0635\u0644\u06CC \u067E\u0698\u0648\u0647\u0634")),
    React.createElement("div", { className: "library-feature" },
        React.createElement("button", { onClick: () => a.modal({ type: 'manager', page: 1 }) },
            React.createElement(I, { name: "file", size: 29 }),
            React.createElement("div", null,
                React.createElement("h3", null, "\u0633\u0646\u062F \u06F3\u06F4 \u0635\u0641\u062D\u0647\u200C\u0627\u06CC \u0645\u062F\u06CC\u0631"),
                React.createElement("p", null, "\u0645\u062A\u0646\u060C \u062A\u0635\u0627\u0648\u06CC\u0631 \u0648 \u0646\u06AF\u0627\u0634\u062A \u0645\u0648\u0636\u0648\u0639\u200C\u0647\u0627")),
            React.createElement(I, { name: "arrow" })),
        React.createElement("button", { onClick: () => a.doc('13-benchmarks-prices/all-projects.md') },
            React.createElement(I, { name: "layers", size: 29 }),
            React.createElement("div", null,
                React.createElement("h3", null, "\u0622\u0631\u0634\u06CC\u0648 \u06F1\u06F0\u06F2 \u0648\u0627\u062D\u062F \u0627\u0648\u0644\u06CC\u0647"),
                React.createElement("p", null, "\u0627\u0635\u0644 \u0646\u06AF\u0627\u0634\u062A \u0628\u062F\u0648\u0646 \u062A\u063A\u06CC\u06CC\u0631 \u062F\u0627\u062F\u0647")),
            React.createElement(I, { name: "arrow" })),
        React.createElement("button", { onClick: () => a.go('concepts') },
            React.createElement(I, { name: "sparkles", size: 29 }),
            React.createElement("div", null,
                React.createElement("h3", null, "\u06F1\u06F0 \u0645\u0641\u0647\u0648\u0645 \u062A\u0631\u06A9\u06CC\u0628\u06CC"),
                React.createElement("p", null, "\u0641\u0631\u0636\u06CC\u0647\u200C\u0647\u0627\u06CC \u062A\u062D\u0644\u06CC\u0644\u06AF\u0631\u060C \u0646\u0647 \u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u062E\u0627\u0631\u062C\u06CC")),
            React.createElement(I, { name: "arrow" }))),
    React.createElement("div", { className: "toolbar" },
        React.createElement("div", { className: "search" },
            React.createElement(I, { name: "search" }),
            React.createElement("input", { "aria-label": "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u06A9\u062A\u0627\u0628\u062E\u0627\u0646\u0647", value: s.docQuery, placeholder: "\u0639\u0646\u0648\u0627\u0646 \u06CC\u0627 \u0645\u062A\u0646 \u06A9\u0627\u0645\u0644 \u0633\u0646\u062F\u2026", onChange: e => a.set({ docQuery: e.target.value, docPage: 0 }) })),
        React.createElement("select", { "aria-label": "\u0646\u0648\u0639 \u0633\u0646\u062F", value: s.docType, onChange: e => a.set({ docType: e.target.value, docPage: 0 }) },
            React.createElement("option", { value: "" }, "\u0647\u0645\u0647 \u0627\u0646\u0648\u0627\u0639 \u0633\u0646\u062F"),
            [['project', 'طرح'], ['case', 'بنچمارک'], ['source', 'منبع'], ['paper', 'مقاله'], ['repository', 'مخزن'], ['initiative', 'ایده اولیه'], ['supporting', 'مراجع مکمل']].map(([v, t]) => React.createElement("option", { key: v, value: v }, t)))),
    React.createElement("div", { className: "filter-row" },
        React.createElement("label", null,
            React.createElement("input", { type: "checkbox", checked: s.archives, onChange: e => a.set({ archives: e.target.checked, docPage: 0 }) }),
            "\u0622\u0631\u0634\u06CC\u0648\u0647\u0627 \u0648 \u0645\u0631\u0627\u062C\u0639 \u0642\u062F\u06CC\u0645\u06CC"),
        React.createElement("label", null,
            React.createElement("input", { type: "checkbox", checked: s.fullText, onChange: e => { a.set({ fullText: e.target.checked, docPage: 0 }); if (e.target.checked)
                    a.loadLibrary(); } }),
            "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0645\u062A\u0646 \u06A9\u0627\u0645\u0644 ",
            s.fullText && !s.libraryReady ? '— در حال آماده‌سازی' : ''),
        React.createElement("span", { className: "muted" },
            fa(ds.length),
            " \u0646\u062A\u06CC\u062C\u0647")),
    React.createElement("div", { className: "library-grid" }, ds.slice(pg * 24, pg * 24 + 24).map(d => React.createElement("button", { className: "library-item", key: d.path, onClick: () => a.doc(d.path) },
        React.createElement("span", null,
            React.createElement(I, { name: d.type === 'source' ? 'link' : 'file', size: 23 })),
        React.createElement("div", null,
            React.createElement("h3", null, d.title),
            React.createElement("p", { dir: "ltr" }, d.path),
            React.createElement("footer", null,
                React.createElement(Tag, { tone: d.archive ? '' : 'green' }, d.archive ? 'آرشیو / مرجع قدیمی' : 'سند پژوهش'),
                React.createElement("small", null,
                    fa(Math.ceil(d.bytes / 1024)),
                    " \u06A9\u06CC\u0644\u0648\u0628\u0627\u06CC\u062A"))),
        React.createElement(I, { name: "arrow", size: 16 })))),
    !ds.length && React.createElement(Empty, null),
    React.createElement("div", { className: "pagination" },
        React.createElement(Btn, { small: true, kind: "ghost", icon: "right", disabled: pg === 0, onClick: () => a.set({ docPage: pg - 1 }) }, "\u0642\u0628\u0644\u06CC"),
        React.createElement("span", null,
            "\u0635\u0641\u062D\u0647 ",
            fa(pg + 1),
            " \u0627\u0632 ",
            fa(pages)),
        React.createElement(Btn, { small: true, kind: "ghost", icon: "arrow", disabled: pg === pages - 1, onClick: () => a.set({ docPage: pg + 1 }) }, "\u0628\u0639\u062F\u06CC")),
    React.createElement(Note, null, "\u0645\u0631\u0627\u062C\u0639 \u0627\u0641\u0642 \u06A9\u0648\u0631\u0648\u0634 \u0648 \u06AF\u0644\u0631\u0646\u06AF\u060C \u0622\u0631\u0634\u06CC\u0648\u06CC \u0648 \u0645\u06A9\u0645\u0644\u200C\u0627\u0646\u062F\u061B \u0627\u0639\u062F\u0627\u062F \u0648 \u0627\u062F\u0639\u0627\u0647\u0627\u06CC \u0622\u0646\u0647\u0627 \u0648\u0636\u0639\u06CC\u062A \u062A\u0623\u06CC\u06CC\u062F\u0634\u062F\u0647 \u0647\u0627\u06CC\u067E\u0631\u0641\u0627\u0645\u06CC\u0644\u06CC \u0645\u062D\u0633\u0648\u0628 \u0646\u0645\u06CC\u200C\u0634\u0648\u0646\u062F. \u0627\u0635\u0644 \u0645\u062A\u0646 \u0648 \u0645\u0631\u0632\u0647\u0627\u06CC \u067E\u0698\u0648\u0647\u0634 \u0646\u06AF\u0647 \u062F\u0627\u0634\u062A\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A.")); }
function Concepts({ a }) { return React.createElement("div", { className: "page" },
    React.createElement("div", { className: "page-heading" },
        React.createElement("div", null,
            React.createElement("h1", null, "\u0627\u06CC\u062F\u0647\u200C\u0647\u0627 \u0641\u0642\u0637 \u062F\u0633\u062A\u06AF\u0627\u0647 \u0646\u06CC\u0633\u062A\u0646\u062F."),
            React.createElement("p", null, "\u062F\u0647 \u0645\u0641\u0647\u0648\u0645 \u062A\u0631\u06A9\u06CC\u0628\u06CC \u067E\u0698\u0648\u0647\u0634 \u0628\u0631\u0627\u06CC \u067E\u06CC\u0648\u0646\u062F \u062A\u062C\u0631\u0628\u0647\u060C \u0639\u0645\u0644\u06CC\u0627\u062A \u0648 \u062A\u0635\u0645\u06CC\u0645\u200C\u06AF\u06CC\u0631\u06CC.")),
        React.createElement(Tag, { tone: "amber" }, "\u0637\u0631\u0627\u062D\u06CC \u062A\u062D\u0644\u06CC\u0644\u06AF\u0631\u061B \u0627\u062C\u0631\u0627 \u0646\u0634\u062F\u0647")),
    React.createElement("div", { className: "concept-grid" }, D.concepts.map(c => React.createElement("button", { className: "concept-card", key: c.id, onClick: () => a.modal({ type: 'concept', id: c.id }) },
        React.createElement("code", null, c.id),
        React.createElement("div", null,
            React.createElement("h2", null, c.title),
            React.createElement("p", null, c.idea),
            React.createElement("span", null,
                "\u0622\u0632\u0645\u0627\u06CC\u0634 \u0648 \u0645\u0639\u06CC\u0627\u0631 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC ",
                React.createElement(I, { name: "arrow", size: 15 }))))))); }
class Reader extends React.Component {
    constructor(p) { super(p); this.state = { raw: false }; }
    render() { var _a; let { path, a } = this.props, d = DD[path], content = (_a = window.FAMILI_LIBRARY) === null || _a === void 0 ? void 0 : _a[path]; if (!d)
        return React.createElement(Empty, { title: "\u0645\u0633\u06CC\u0631 \u062F\u0642\u06CC\u0642 \u0633\u0646\u062F \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F", text: path, action: React.createElement(Btn, { onClick: () => { a.close(); a.go('library'); a.set({ docQuery: path.split('/').pop().replace('.md', ''), archives: true }); } }, "\u062C\u0633\u062A\u200C\u0648\u062C\u0648 \u062F\u0631 \u06A9\u062A\u0627\u0628\u062E\u0627\u0646\u0647") }); return React.createElement("div", { className: "reader" },
        React.createElement("div", { className: "reader-tools" },
            React.createElement(Tag, { tone: d.archive ? 'amber' : 'green' }, d.archive ? 'مرجع تاریخی / مکمل' : 'سند پژوهش'),
            React.createElement("small", null,
                fa(Math.ceil(d.bytes / 1024)),
                " \u06A9\u06CC\u0644\u0648\u0628\u0627\u06CC\u062A"),
            React.createElement("div", { className: "spacer" }),
            React.createElement(Btn, { small: true, kind: "ghost", onClick: () => this.setState({ raw: !this.state.raw }) }, this.state.raw ? 'نمای خواندن' : 'متن اصلی Markdown'),
            React.createElement(IB, { name: "download", label: "\u062F\u0631\u06CC\u0627\u0641\u062A \u0645\u062A\u0646 \u0627\u0635\u0644\u06CC", disabled: !content, onClick: () => download(path.split('/').pop(), content.raw, 'text/markdown;charset=utf-8') })),
        d.archive && React.createElement("div", { className: "archive-warning" }, "\u0627\u062F\u0639\u0627\u0647\u0627\u06CC \u0627\u06CC\u0646 \u0633\u0646\u062F \u062A\u0627\u0631\u06CC\u062E\u06CC \u06CC\u0627 \u0645\u06A9\u0645\u0644\u060C \u062F\u0631 \u0627\u06CC\u0646 \u0645\u0631\u062D\u0644\u0647 \u062F\u0648\u0628\u0627\u0631\u0647 \u0631\u0627\u0633\u062A\u06CC\u200C\u0622\u0632\u0645\u0627\u06CC\u06CC \u0646\u0634\u062F\u0647\u200C\u0627\u0646\u062F."),
        React.createElement("div", { className: "reader-scroll" }, content ? (this.state.raw ? React.createElement("pre", { className: "raw", dir: "auto" }, content.raw) : React.createElement(Markdown, { doc: content, a: a })) : React.createElement("div", { className: "loading" },
            a.state.libraryError || 'در حال بازکردن متن کامل از بسته محلی…',
            a.state.libraryError && React.createElement(Btn, { onClick: () => a.loadLibrary() }, "\u062A\u0644\u0627\u0634 \u062F\u0648\u0628\u0627\u0631\u0647"))),
        React.createElement("footer", { dir: "ltr" },
            path,
            " \u00B7 SHA256: ",
            d.sha256.slice(0, 18),
            "\u2026")); }
}
class Manager extends React.Component {
    constructor(p) { super(p); this.state = { page: p.page || 1, text: false }; }
    render() { let p = D.pages[this.state.page - 1]; return React.createElement("div", { className: "manager" },
        React.createElement("div", { className: "reader-tools" },
            React.createElement(IB, { name: "right", label: "\u0635\u0641\u062D\u0647 \u0642\u0628\u0644", disabled: this.state.page === 1, onClick: () => this.setState({ page: this.state.page - 1 }) }),
            React.createElement("select", { "aria-label": "\u0635\u0641\u062D\u0647 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631", value: this.state.page, onChange: e => this.setState({ page: Number(e.target.value) }) }, D.pages.map(p => React.createElement("option", { value: p.number, key: p.number },
                "\u0635\u0641\u062D\u0647 ",
                fa(p.number)))),
            React.createElement("span", null,
                "\u0627\u0632 ",
                fa(D.pages.length)),
            React.createElement(IB, { name: "arrow", label: "\u0635\u0641\u062D\u0647 \u0628\u0639\u062F", disabled: this.state.page === D.pages.length, onClick: () => this.setState({ page: this.state.page + 1 }) }),
            React.createElement("div", { className: "spacer" }),
            React.createElement(Btn, { small: true, kind: "ghost", onClick: () => this.setState({ text: !this.state.text }) }, this.state.text ? 'تصویر صفحه' : 'متن استخراج‌شده'),
            React.createElement(IB, { name: "download", label: "PDF \u0627\u0635\u0644\u06CC \u0645\u062F\u06CC\u0631", onClick: () => original('manager-original.pdf') })),
        React.createElement("div", { className: "manager-body" }, this.state.text ? React.createElement("pre", { className: "raw" }, p.text) : React.createElement("img", { src: media(p.image), alt: 'صفحه کامل ' + p.number + ' از سند مدیر' }))); }
}
function SourceDetail({ s, a }) { return React.createElement("div", { className: "modal-body" },
    React.createElement("div", { className: "source-profile" },
        React.createElement("span", { className: "org" }, (s.publisher || 'منبع').slice(0, 2)),
        React.createElement("div", null,
            React.createElement("h3", null, s.publisher),
            React.createElement("code", null, s.id))),
    React.createElement("dl", null, [['سطح مشاهده ثبت‌شده', s.access], ['تاریخ مشاهده', s.checked_on || s.accessed_on], ['تاریخ خبر یا رویداد', s.published_or_event_date || 'در این رکورد مشخص نشده'], ['نوع شاهد', s.kind]].map(([t, v]) => React.createElement("div", { key: t },
        React.createElement("dt", null, t),
        React.createElement("dd", null, v || 'در اصل منبع')))),
    React.createElement(Note, { title: "\u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0627\u062A\u06A9\u0627" }, s.note || 'این منبع، اثبات مستقل همه ادعاها، موجودی روز یا نتیجه اجرای فامیلی نیست.'),
    React.createElement("a", { className: "btn", href: safeURL(s.url), rel: "noopener noreferrer", target: "_blank" },
        React.createElement(I, { name: "external" }),
        "\u0645\u0646\u0628\u0639 \u0627\u0635\u0644\u06CC \u2014 \u0646\u06CC\u0627\u0632\u0645\u0646\u062F \u0627\u06CC\u0646\u062A\u0631\u0646\u062A"),
    React.createElement("p", { className: "url", dir: "ltr" }, s.url),
    React.createElement(DocLink, { path: s.path || docFor(s.id), a: a })); }
function CaseDetail({ c, a }) { return React.createElement("div", { className: "modal-body" },
    React.createElement("div", { className: "case-head" },
        React.createElement("div", { className: "org" }, c.organization.slice(0, 2)),
        React.createElement("div", null,
            React.createElement("h3", { dir: "auto" }, c.organization),
            React.createElement("p", null,
                c.countries.join('، '),
                " \u00B7 ",
                c.id)),
        React.createElement(Tag, { tone: maturityTone(c) }, c.maturity_group)),
    React.createElement("section", { className: "evidence" },
        React.createElement("small", null, "\u0622\u0646\u0686\u0647 \u0645\u0646\u0628\u0639 \u06AF\u0632\u0627\u0631\u0634 \u0645\u06CC\u200C\u06A9\u0646\u062F"),
        React.createElement("p", { className: "lead" }, c.fact),
        React.createElement("div", { className: "source-chips" }, c.sources.map(id => React.createElement(Source, { key: id, id: id, a: a })))),
    React.createElement(Note, { title: "\u062D\u062F\u0648\u062F \u0627\u06CC\u0646 \u0634\u0627\u0647\u062F" }, c.limitations),
    React.createElement("section", null,
        React.createElement("span", { className: "eyebrow" }, "\u0627\u0642\u062A\u0640\u0628\u0627\u0633 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC\u061B \u0646\u0647 \u0628\u0631\u0646\u0627\u0645\u0647 \u0634\u0631\u06A9\u062A \u0645\u0631\u062C\u0639"),
        React.createElement("h2", null, "\u0686\u0647 \u0686\u06CC\u0632\u06CC \u0628\u0631\u0627\u06CC \u0641\u0627\u0645\u06CC\u0644\u06CC \u0642\u0627\u0628\u0644 \u0628\u0631\u0631\u0633\u06CC \u0627\u0633\u062A\u061F"),
        React.createElement("p", null, c.hyperfamili_proposal)),
    React.createElement("div", { className: "values" }, Object.entries(LENSES).map(([k, v]) => React.createElement("section", { key: k, style: { '--lens': v.color } },
        React.createElement(I, { name: v.icon }),
        React.createElement("h3", null, v.label),
        React.createElement("p", null, c[k])))),
    React.createElement("div", { className: "two" },
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null, "\u0622\u0632\u0645\u0627\u06CC\u0634 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC"),
            React.createElement("p", null, c.pilot)),
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null, "\u0645\u0639\u06CC\u0627\u0631"),
            React.createElement("p", null, c.metric))),
    React.createElement("div", { className: "source-chips" }, c.projects.map(id => React.createElement("button", { className: "tag green", key: id, onClick: () => a.project(id) }, PP[id].title))),
    React.createElement(DocLink, { path: c.path, a: a })); }
function QuoteDetail({ q, a }) { return React.createElement("div", { className: "modal-body" },
    React.createElement("section", { className: "price-emphasis" },
        React.createElement(Tag, { tone: q.market === 'ایران' ? 'green' : 'blue' }, q.market),
        React.createElement("h2", null, q.product),
        React.createElement("strong", null, price(q)),
        React.createElement("span", null,
            "\u0628\u0647 \u0627\u0632\u0627\u06CC ",
            q.unit)),
    React.createElement("dl", null, [['تعهد و دوره', q.billing], ['دامنه قیمت', q.scope], ['وضعیت مشاهده', q.status], ['موجودی', q.stock], ['تاریخ مشاهده', q.date], ['مقدار خام منبع', q.raw]].map(([t, v]) => React.createElement("div", { key: t },
        React.createElement("dt", null, t),
        React.createElement("dd", { dir: "auto" }, v || 'نامشخص')))),
    React.createElement(Note, { title: "\u0686\u0647 \u0686\u06CC\u0632\u0647\u0627\u06CC\u06CC \u062F\u0627\u062E\u0644 \u0642\u06CC\u0645\u062A \u0627\u062D\u0631\u0627\u0632 \u0646\u0634\u062F\u0647\u200C\u0627\u0646\u062F\u061F" }, q.exclusions),
    React.createElement(Source, { id: q.sourceId, a: a }),
    React.createElement("div", { className: "source-chips" }, q.projects.map(id => React.createElement("button", { className: "tag", key: id, onClick: () => a.project(id, 'cost') }, PP[id].title)))); }
function SearchBox({ a }) { let q = norm(a.state.globalQuery), ps = q ? projects.filter(p => norm(p.search).includes(q)).slice(0, 7) : projects.filter(p => DEFAULT_AGENDA.slice(0, 6).includes(p.id)), cs = q ? cases.filter(c => norm(c.search).includes(q)).slice(0, 4) : [], ds = q ? D.docs.filter(d => norm(d.title + ' ' + d.path).includes(q)).slice(0, 6) : []; return React.createElement("div", { className: "global-search" },
    React.createElement("div", { className: "search" },
        React.createElement(I, { name: "search", size: 23 }),
        React.createElement("input", { className: "search-input", "aria-label": "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0633\u0631\u0627\u0633\u0631\u06CC", value: a.state.globalQuery, placeholder: "\u0637\u0631\u062D\u060C \u0634\u0631\u06A9\u062A\u060C \u0645\u0642\u0627\u0644\u0647 \u06CC\u0627 \u0633\u0646\u062F\u2026", onChange: e => a.set({ globalQuery: e.target.value }) }),
        React.createElement("kbd", null, "Esc")),
    React.createElement("div", { className: "search-results" },
        React.createElement("h3", null, q ? 'طرح‌ها' : 'چند مسیر برای شروع'),
        ps.map(p => React.createElement("button", { key: p.id, onClick: () => a.project(p.id) },
            React.createElement(I, { name: D.families[p.family].icon }),
            React.createElement("div", null,
                React.createElement("strong", null, p.title),
                React.createElement("small", null, D.families[p.family].title)),
            React.createElement("code", null, p.id))),
        cs.length > 0 && React.createElement("h3", null, "\u0646\u0645\u0648\u0646\u0647\u200C\u0647\u0627\u06CC \u067E\u0698\u0648\u0647\u0634"),
        cs.map(c => React.createElement("button", { key: c.id, onClick: () => a.modal({ type: 'case', id: c.id }) },
            React.createElement(I, { name: "globe" }),
            React.createElement("div", null,
                React.createElement("strong", null, c.title),
                React.createElement("small", null, c.organization)),
            React.createElement("code", null, c.id))),
        ds.length > 0 && React.createElement("h3", null, "\u0627\u0633\u0646\u0627\u062F"),
        ds.map(d => React.createElement("button", { key: d.path, onClick: () => a.doc(d.path) },
            React.createElement(I, { name: "file" }),
            React.createElement("div", null,
                React.createElement("strong", null, d.title),
                React.createElement("small", null, d.archive ? 'مرجع قدیمی / آرشیو' : 'سند پژوهش')))),
        !ps.length && !cs.length && !ds.length && React.createElement(Empty, null)),
    React.createElement("footer", null,
        React.createElement("span", null, "\u0628\u062F\u0648\u0646 \u0627\u0631\u0633\u0627\u0644 \u062C\u0633\u062A\u200C\u0648\u062C\u0648 \u0628\u0647 \u0627\u06CC\u0646\u062A\u0631\u0646\u062A"),
        React.createElement("button", { className: "text-link", onClick: () => { a.close(); a.go('library'); a.set({ docQuery: a.state.globalQuery, fullText: true, archives: true }); a.loadLibrary(); } },
            "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0645\u062A\u0646 \u06A9\u0627\u0645\u0644 ",
            React.createElement(I, { name: "arrow", size: 16 })))); }
function ConceptDetail({ c, a }) { return React.createElement("div", { className: "modal-body" },
    React.createElement(Tag, { tone: "amber" }, "\u0641\u0631\u0636\u06CC\u0647 \u0637\u0631\u0627\u062D\u06CC\u061B \u0646\u0647 \u0646\u0645\u0648\u0646\u0647 \u0627\u062C\u0631\u0627\u0634\u062F\u0647"),
    React.createElement("p", { className: "lead" }, c.idea),
    React.createElement("div", { className: "two" },
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null, "\u0622\u0632\u0645\u0627\u06CC\u0634 \u06A9\u0648\u0686\u06A9"),
            React.createElement("p", null, c.pilot)),
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null, "\u0645\u0639\u06CC\u0627\u0631"),
            React.createElement("p", null, c.metric))),
    React.createElement("h3", null, "\u0646\u0645\u0648\u0646\u0647\u200C\u0647\u0627\u06CC \u0627\u0644\u0647\u0627\u0645\u200C\u0628\u062E\u0634"),
    React.createElement("div", { className: "case-grid" }, cases.filter(x => c.cases.includes(x.key)).map(x => React.createElement(CaseCard, { key: x.id, c: x, a: a }))),
    React.createElement("h3", null, "\u067E\u0631\u0648\u0646\u062F\u0647\u200C\u0647\u0627\u06CC \u0645\u0631\u062A\u0628\u0637"),
    React.createElement("div", { className: "source-chips" }, projects.filter(p => { var _a; return (_a = p.concept_ids) === null || _a === void 0 ? void 0 : _a.includes(c.id); }).map(p => React.createElement("button", { key: p.id, className: "tag green", onClick: () => a.project(p.id) }, p.title))),
    React.createElement(DocLink, { path: docFor(c.id), a: a })); }
function Settings({ a }) { let s = a.state; return React.createElement("div", { className: "modal-body" },
    React.createElement("section", null,
        React.createElement("h2", null, "\u062E\u0648\u0627\u0646\u0627\u06CC\u06CC \u0631\u0648\u06CC \u0646\u0645\u0627\u06CC\u0634\u06AF\u0631 \u062C\u0644\u0633\u0647"),
        React.createElement("label", { className: "range" },
            "\u0627\u0646\u062F\u0627\u0632\u0647 \u0646\u0648\u0634\u062A\u0647",
            React.createElement("input", { type: "range", min: ".9", max: "1.25", step: ".05", value: s.scale, onChange: e => a.set({ scale: Number(e.target.value) }, true) }),
            React.createElement("strong", null,
                fa(Math.round(s.scale * 100)),
                "\u066A")),
        React.createElement("label", { className: "check-label" },
            React.createElement("input", { type: "checkbox", checked: s.reduceMotion, onChange: e => a.set({ reduceMotion: e.target.checked }, true) }),
            "\u06A9\u0627\u0647\u0634 \u062D\u0631\u06A9\u062A \u0648 \u0627\u0646\u06CC\u0645\u06CC\u0634\u0646\u200C\u0647\u0627")),
    React.createElement("section", null,
        React.createElement("h2", null, "\u0646\u0633\u062E\u0647 \u0645\u062D\u0644\u06CC \u062C\u0644\u0633\u0647"),
        React.createElement("p", null, "\u0641\u0647\u0631\u0633\u062A \u0648 \u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627 \u0641\u0642\u0637 \u0631\u0648\u06CC \u0645\u0631\u0648\u0631\u06AF\u0631 \u0630\u062E\u06CC\u0631\u0647 \u0645\u06CC\u200C\u0634\u0648\u0646\u062F. \u062E\u0631\u0648\u062C\u06CC \u062C\u0644\u0633\u0647 \u0628\u0631\u0627\u06CC \u0627\u0646\u062A\u0642\u0627\u0644 \u0628\u0647 \u0644\u067E\u200C\u062A\u0627\u067E \u0645\u062F\u06CC\u0631 \u0644\u0627\u0632\u0645 \u0627\u0633\u062A."),
        React.createElement("div", { className: "actions" },
            React.createElement(Btn, { icon: "download", onClick: () => a.exportSession() }, "\u062E\u0631\u0648\u062C\u06CC \u062C\u0644\u0633\u0647"),
            React.createElement(Btn, { kind: "ghost", icon: "upload", onClick: () => a.fileInput.click() }, "\u0648\u0631\u0648\u062F \u0641\u0627\u06CC\u0644"))),
    React.createElement(Note, { title: "\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u062F\u0627\u062E\u0644\u06CC \u0633\u0627\u0632\u0645\u0627\u0646" }, "\u0627\u06CC\u0646 \u0627\u067E \u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A \u0633\u0631\u0648\u0631\u06CC \u0646\u062F\u0627\u0631\u062F. \u0628\u0631\u0627\u06CC \u0645\u06CC\u0632\u0628\u0627\u0646\u06CC \u0633\u0627\u0632\u0645\u0627\u0646\u06CC\u060C \u06A9\u0646\u062A\u0631\u0644 \u062F\u0633\u062A\u0631\u0633\u06CC \u0648 HTTPS \u0644\u0627\u0632\u0645 \u0627\u0633\u062A. \u0645\u062D\u062A\u0648\u0627 \u0648 \u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0628\u0647 \u0647\u06CC\u0686 \u0633\u0631\u0648\u06CC\u0633 \u062E\u0627\u0631\u062C\u06CC \u0627\u0631\u0633\u0627\u0644 \u0646\u0645\u06CC\u200C\u0634\u0648\u0646\u062F."),
    React.createElement("section", null,
        React.createElement("h3", null, "\u06A9\u0644\u06CC\u062F\u0647\u0627\u06CC \u062D\u0627\u0644\u062A \u0627\u0631\u0627\u0626\u0647"),
        React.createElement("p", null, "\u06A9\u0644\u06CC\u062F \u0686\u067E \u06CC\u0627 Space: \u0645\u0631\u062D\u0644\u0647 \u0628\u0639\u062F\u061B \u0631\u0627\u0633\u062A: \u0645\u0631\u062D\u0644\u0647 \u0642\u0628\u0644\u061B \u06F1 \u062A\u0627 \u06F6 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC: \u0627\u0646\u062A\u062E\u0627\u0628 \u0645\u0631\u062D\u0644\u0647\u061B F: \u062A\u0645\u0627\u0645\u200C\u0635\u0641\u062D\u0647\u061B Escape: \u0628\u0633\u062A\u0646 \u062C\u0632\u0626\u06CC\u0627\u062A \u06CC\u0627 \u062E\u0631\u0648\u062C. \u062C\u0633\u062A\u200C\u0648\u062C\u0648: Ctrl/\u2318 + K \u06CC\u0627 /.")),
    React.createElement("section", null,
        React.createElement("h3", null, "\u062F\u0627\u0645\u0646\u0647 \u0648 \u0645\u0646\u0627\u0628\u0639"),
        React.createElement("p", null,
            fa(projects.length),
            " \u067E\u0631\u0648\u0646\u062F\u0647\u060C ",
            fa(cases.length),
            " \u0628\u0646\u0686\u0645\u0627\u0631\u06A9\u060C ",
            fa(quotes.length),
            " \u0645\u0634\u0627\u0647\u062F\u0647 \u0642\u06CC\u0645\u062A \u0648 ",
            fa(D.docs.length),
            " \u0633\u0646\u062F. \u062A\u0635\u0627\u0648\u06CC\u0631 \u0646\u0645\u0648\u0646\u0647 \u0633\u0646\u062F \u0645\u062F\u06CC\u0631\u0646\u062F\u061B \u0645\u062F\u0644 \u062E\u0631\u06CC\u062F \u06CC\u0627 \u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u0648\u0627\u0642\u0639\u06CC \u0631\u0627 \u0627\u062B\u0628\u0627\u062A \u0646\u0645\u06CC\u200C\u06A9\u0646\u0646\u062F."),
        React.createElement("p", null, "\u062F\u0627\u062F\u0647 \u067E\u0698\u0648\u0647\u0634: \u06F1\u06F6 \u0627\u06A9\u062A\u0628\u0631 \u06F2\u06F0\u06F2\u06F6. \u0627\u06CC\u0646 \u0645\u0631\u062D\u0644\u0647 \u0628\u0633\u062A\u0647 \u0627\u0631\u0627\u0626\u0647 \u0627\u0633\u062A\u060C \u0646\u0647 \u0631\u0627\u0633\u062A\u06CC\u200C\u0622\u0632\u0645\u0627\u06CC\u06CC \u062A\u0627\u0632\u0647 \u062A\u0645\u0627\u0645 \u0648\u0628 \u06CC\u0627 \u067E\u06CC\u0634\u200C\u0641\u0627\u06A9\u062A\u0648\u0631 \u062E\u0631\u06CC\u062F."),
        React.createElement("div", { className: "actions" },
            React.createElement(Btn, { kind: "ghost", small: true, onClick: () => original('research-original.zip') }, "\u0627\u0635\u0644 \u067E\u0698\u0648\u0647\u0634"),
            React.createElement(Btn, { kind: "ghost", small: true, onClick: () => original('manager-original.pdf') }, "\u0633\u0646\u062F \u0645\u062F\u06CC\u0631")))); }
function Modals({ a }) {
    var _a;
    let m = a.state.modal;
    if (!m)
        return null;
    let title = '', body = null, wide = false, kind = '';
    if (m.type === 'source') {
        let s = SS[m.id];
        if (!s)
            return null;
        title = s.title;
        body = React.createElement(SourceDetail, { s: s, a: a });
    }
    else if (m.type === 'case') {
        let c = CC[m.id];
        title = c.title;
        body = React.createElement(CaseDetail, { c: c, a: a });
        wide = true;
    }
    else if (m.type === 'quote') {
        title = 'جزئیات قیمت و حدود اتکا';
        body = React.createElement(QuoteDetail, { q: QQ[m.id], a: a });
    }
    else if (m.type === 'document') {
        title = ((_a = DD[m.path]) === null || _a === void 0 ? void 0 : _a.title) || 'سند';
        wide = true;
        kind = 'document-dialog';
        body = React.createElement(Reader, { key: m.path, path: m.path, a: a });
    }
    else if (m.type === 'manager') {
        title = 'سند اصلی مدیر — ۳۴ صفحه';
        wide = true;
        kind = 'manager-dialog';
        body = React.createElement(Manager, { key: m.page, page: m.page });
    }
    else if (m.type === 'search') {
        title = 'جست‌وجوی سریع';
        kind = 'search-dialog';
        wide = true;
        body = React.createElement(SearchBox, { a: a });
    }
    else if (m.type === 'settings') {
        title = 'تنظیمات و راهنمای جلسه';
        body = React.createElement(Settings, { a: a });
    }
    else if (m.type === 'concept') {
        let c = D.concepts.find(x => x.id === m.id);
        if (!c)
            return null;
        title = c.title;
        wide = true;
        body = React.createElement(ConceptDetail, { c: c, a: a });
    }
    else if (m.type === 'image') {
        title = 'تصویر مرجع سند مدیر';
        wide = true;
        body = React.createElement("div", { className: "modal-body" },
            React.createElement("img", { className: "lightbox", src: media(m.image), alt: 'تصویر صفحه ' + m.page }),
            React.createElement(Note, null,
                "\u0635\u0641\u062D\u0647 ",
                fa(m.page),
                " \u0633\u0646\u062F \u0645\u062F\u06CC\u0631\u061B \u0645\u062F\u0631\u06A9 \u0627\u062C\u0631\u0627\u06CC \u0648\u0627\u0642\u0639\u06CC \u06CC\u0627 \u0639\u06A9\u0633 \u0645\u062F\u0644 \u0646\u0647\u0627\u06CC\u06CC \u062E\u0631\u06CC\u062F \u0646\u06CC\u0633\u062A."),
            React.createElement(Btn, { kind: "ghost", onClick: () => a.modal({ type: 'manager', page: m.page }) }, "\u0645\u0634\u0627\u0647\u062F\u0647 \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC"));
    }
    else if (m.type === 'decision') {
        title = 'جمع‌بندی ' + PP[m.id].title;
        body = React.createElement("div", { className: "modal-body" },
            React.createElement(Decision, { p: PP[m.id], a: a }));
    }
    else if (m.type === 'paper') {
        let p = D.papers.find(x => x.id === m.id);
        title = 'پژوهش و شواهد علمی';
        body = React.createElement("div", { className: "modal-body" },
            React.createElement("h2", { dir: "auto" }, p.title),
            React.createElement("p", null,
                p.year,
                " \u00B7 ",
                p.design),
            React.createElement("h3", null, "\u06CC\u0627\u0641\u062A\u0647 \u062B\u0628\u062A\u200C\u0634\u062F\u0647"),
            React.createElement("p", null, p.finding),
            React.createElement(Note, { title: "\u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0648 \u0642\u0627\u0628\u0644\u06CC\u062A \u062A\u0639\u0645\u06CC\u0645" }, p.limit),
            React.createElement("p", null, p.access),
            React.createElement("p", { dir: "ltr" },
                "DOI: ",
                p.doi || 'در این ثبت موجود نیست'),
            React.createElement("a", { className: "btn", href: safeURL(p.url), target: "_blank", rel: "noopener noreferrer" },
                React.createElement(I, { name: "external" }),
                "\u0645\u0646\u0628\u0639 \u0627\u0635\u0644\u06CC \u2014 \u0622\u0646\u0644\u0627\u06CC\u0646"),
            React.createElement(DocLink, { path: docFor(p.id), a: a }));
    }
    else if (m.type === 'repo') {
        let p = D.repos.find(x => x.id === m.id);
        title = 'مخزن و شرایط استفاده';
        body = React.createElement("div", { className: "modal-body" },
            React.createElement("h2", { dir: "ltr" }, p.name),
            React.createElement("p", null, p.function),
            React.createElement(Note, { title: "\u0645\u062C\u0648\u0632 \u0648 \u0646\u0633\u062E\u0647" }, p.license_note),
            React.createElement("p", null, p.access),
            React.createElement("a", { className: "btn", href: safeURL(p.url), target: "_blank", rel: "noopener noreferrer" },
                React.createElement(I, { name: "external" }),
                "\u0645\u062E\u0632\u0646 \u0631\u0633\u0645\u06CC \u2014 \u0622\u0646\u0644\u0627\u06CC\u0646"),
            React.createElement(DocLink, { path: docFor(p.id), a: a }));
    }
    return React.createElement(Dialog, { key: m.type, title: title, wide: wide, kind: kind, close: () => a.close(), back: a.state.modalHistory.length ? () => a.backModal() : null }, body);
}
/* 30-session.jsx */
function Decision({ p, a }) { return React.createElement("section", { className: "decision" },
    React.createElement("label", null,
        "\u062C\u0645\u0639\u200C\u0628\u0646\u062F\u06CC \u0627\u0648\u0644\u06CC\u0647",
        React.createElement("select", { "aria-label": 'جمع‌بندی ' + p.id, value: a.state.decisions[p.id] || 'new', onChange: e => a.decision(p.id, e.target.value) }, Object.entries(DECISIONS).map(([k, t]) => React.createElement("option", { key: k, value: k }, t)))),
    React.createElement("label", null,
        "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u062C\u0644\u0633\u0647",
        React.createElement("textarea", { "aria-label": 'یادداشت ' + p.id, placeholder: "\u067E\u0631\u0633\u0634\u200C\u0647\u0627\u060C \u0645\u0633\u0626\u0648\u0644 \u067E\u06CC\u06AF\u06CC\u0631\u06CC \u0648 \u0645\u062F\u0631\u06A9 \u0645\u0648\u0631\u062F\u0646\u06CC\u0627\u0632\u2026", value: a.state.notes[p.id] || '', maxLength: 10000, onChange: e => a.note(p.id, e.target.value) })),
    React.createElement("small", null,
        React.createElement(I, { name: "lock", size: 13 }),
        " \u067E\u06CC\u0634\u200C\u0646\u0648\u06CC\u0633 \u0645\u062D\u0644\u06CC\u061B \u0635\u0648\u0631\u062A\u062C\u0644\u0633\u0647 \u0645\u0635\u0648\u0628 \u0646\u06CC\u0633\u062A. \u0628\u0631\u0627\u06CC \u0627\u0646\u062A\u0642\u0627\u0644\u060C \u062E\u0631\u0648\u062C\u06CC \u0628\u06AF\u06CC\u0631\u06CC\u062F.")); }
function Agenda({ a }) { let s = a.state, ids = s.agenda; return React.createElement("div", { className: "page" },
    React.createElement("div", { className: "page-heading" },
        React.createElement("div", null,
            React.createElement("h1", null, "\u0631\u0648\u0627\u06CC\u062A \u062C\u0644\u0633\u0647 \u0631\u0627 \u062E\u0648\u062F\u062A\u0627\u0646 \u0628\u0686\u06CC\u0646\u06CC\u062F."),
            React.createElement("p", null, "\u0627\u0646\u062A\u062E\u0627\u0628\u060C \u062A\u0631\u062A\u06CC\u0628 \u0627\u0631\u0627\u0626\u0647 \u0648 \u067E\u0631\u0633\u0634\u200C\u0647\u0627\u06CC \u062C\u0644\u0633\u0647\u061B \u0647\u0645\u0647 \u062F\u0631 \u06CC\u06A9 \u0641\u0636\u0627\u06CC \u06A9\u0627\u0631\u06CC \u0645\u062D\u0644\u06CC.")),
        React.createElement(Btn, { icon: "play", disabled: !ids.length, onClick: () => a.present(ids) },
            "\u0627\u0631\u0627\u0626\u0647 ",
            fa(ids.length),
            " \u0637\u0631\u062D")),
    React.createElement("div", { className: "agenda-stats" },
        React.createElement("div", null,
            React.createElement("strong", null, fa(ids.length)),
            React.createElement("span", null, "\u0637\u0631\u062D \u062F\u0631 \u0641\u0647\u0631\u0633\u062A \u0634\u0645\u0627")),
        React.createElement("div", null,
            React.createElement("strong", null, fa(ids.filter(id => s.decisions[id] && s.decisions[id] !== 'new').length)),
            React.createElement("span", null, "\u062F\u0627\u0631\u0627\u06CC \u062C\u0645\u0639\u200C\u0628\u0646\u062F\u06CC \u0627\u0648\u0644\u06CC\u0647")),
        React.createElement("div", null,
            React.createElement("strong", null, fa(ids.filter(id => s.decisions[id] === 'pilot').length)),
            React.createElement("span", null, "\u0646\u0627\u0645\u0632\u062F \u0628\u0631\u0631\u0633\u06CC \u067E\u0627\u06CC\u0644\u0648\u062A")),
        React.createElement("section", null,
            React.createElement(I, { name: "info" }),
            React.createElement("p", null,
                "\u0641\u0647\u0631\u0633\u062A \u0622\u063A\u0627\u0632 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC \u0627\u0633\u062A.",
                React.createElement("br", null),
                "\u0647\u06CC\u0686 \u0637\u0631\u062D\u06CC \u062E\u0648\u062F\u06A9\u0627\u0631 \u062A\u0635\u0648\u06CC\u0628 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F."))),
    React.createElement("div", { className: "agenda-toolbar" },
        React.createElement(Btn, { small: true, kind: "ghost", icon: "plus", onClick: () => a.go('projects') }, "\u0627\u0641\u0632\u0648\u062F\u0646 \u0637\u0631\u062D"),
        React.createElement(Btn, { small: true, kind: "ghost", icon: "layers", onClick: () => a.set({ agenda: projects.map(p => p.id) }, true) },
            "\u0647\u0645\u0647 ",
            fa(projects.length),
            " \u0637\u0631\u062D \u0627\u0635\u0644\u06CC"),
        React.createElement(Btn, { small: true, kind: "ghost", onClick: () => a.set({ agenda: DEFAULT_AGENDA.slice() }, true) }, "\u0645\u0633\u06CC\u0631 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC \u0622\u063A\u0627\u0632"),
        React.createElement("div", { className: "spacer" }),
        React.createElement(Btn, { small: true, kind: "ghost", icon: "download", onClick: () => a.exportSession() }, "\u062E\u0631\u0648\u062C\u06CC \u062C\u0644\u0633\u0647"),
        React.createElement(Btn, { small: true, kind: "ghost", icon: "upload", onClick: () => a.fileInput.click() }, "\u0648\u0631\u0648\u062F \u0641\u0627\u06CC\u0644")),
    React.createElement("div", { className: "agenda-list" }, ids.map((id, i) => { let p = PP[id]; return React.createElement("article", { key: id },
        React.createElement("div", { className: "agenda-order" },
            React.createElement("strong", null, fa(i + 1)),
            React.createElement("div", null,
                React.createElement(IB, { name: "up", label: 'بالابردن ' + id, disabled: i === 0, onClick: () => a.reorder(i, -1) }),
                React.createElement(IB, { name: "down", label: 'پایین‌بردن ' + id, disabled: i === ids.length - 1, onClick: () => a.reorder(i, 1) }))),
        React.createElement("button", { className: "agenda-project", onClick: () => a.project(id) },
            React.createElement("span", { className: "family-icon" },
                React.createElement(I, { name: D.families[p.family].icon, size: 26 })),
            React.createElement("div", null,
                React.createElement("small", null,
                    id,
                    " \u00B7 ",
                    D.families[p.family].title),
                React.createElement("h3", null, p.title),
                React.createElement("p", null, cut(p.perspectives[s.lens], 110)))),
        React.createElement("div", { className: "agenda-actions" },
            React.createElement(Tag, { tone: s.decisions[id] === 'pilot' ? 'green' : '' }, DECISIONS[s.decisions[id]] || DECISIONS.new),
            React.createElement("div", null,
                React.createElement(IB, { name: "notes", label: 'یادداشت ' + id, onClick: () => a.modal({ type: 'decision', id }) }),
                React.createElement(IB, { name: "play", label: 'ارائه از ' + id, onClick: () => a.present(ids, i) }),
                React.createElement(IB, { name: "close", label: 'حذف از جلسه ' + id, onClick: () => a.toggle('agenda', id) })))); })),
    !ids.length && React.createElement(Empty, { title: "\u0641\u0647\u0631\u0633\u062A \u0627\u0631\u0627\u0626\u0647 \u062E\u0627\u0644\u06CC \u0627\u0633\u062A", text: "\u0627\u0632 \u0635\u0641\u062D\u0647 \u062A\u0645\u0627\u0645 \u0637\u0631\u062D\u200C\u0647\u0627\u060C \u0645\u0648\u0627\u0631\u062F \u062F\u0644\u062E\u0648\u0627\u0647 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.", action: React.createElement(Btn, { onClick: () => a.go('projects') }, "\u0627\u0646\u062A\u062E\u0627\u0628 \u0637\u0631\u062D") }),
    React.createElement("div", { className: "two spaced" },
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null, "\u0631\u0648\u0627\u06CC\u062A \u0634\u0634\u200C\u0645\u0631\u062D\u0644\u0647\u200C\u0627\u06CC \u0647\u0631 \u0637\u0631\u062D"),
            React.createElement("p", null, "\u0645\u0639\u0631\u0641\u06CC\u060C \u0627\u0631\u0632\u0634 \u0628\u0631\u0627\u06CC \u0633\u0647 \u06AF\u0631\u0648\u0647\u060C \u0627\u06CC\u0631\u0627\u0646 \u0648 \u062C\u0647\u0627\u0646\u060C \u0642\u06CC\u0645\u062A \u0648 \u062F\u0627\u0645\u0646\u0647\u060C \u0627\u062C\u0631\u0627 \u0648 \u0631\u06CC\u0633\u06A9\u060C \u062C\u0645\u0639\u200C\u0628\u0646\u062F\u06CC. \u0633\u0646\u062F \u0627\u0635\u0644\u06CC \u0627\u0632 \u062A\u0645\u0627\u0645 \u0645\u0631\u0627\u062D\u0644 \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0627\u0633\u062A.")),
        React.createElement("section", { className: "soft" },
            React.createElement("h3", null, "\u0627\u0646\u062A\u0642\u0627\u0644 \u0628\u0647 \u0644\u067E\u200C\u062A\u0627\u067E \u0645\u062F\u06CC\u0631"),
            React.createElement("p", null, "\u062E\u0631\u0648\u062C\u06CC JSON \u062C\u0644\u0633\u0647 \u0631\u0627 \u0628\u06AF\u06CC\u0631\u06CC\u062F \u0648 \u062F\u0631 \u0646\u0633\u062E\u0647 \u062F\u06CC\u06AF\u0631 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F\u061B \u0641\u0647\u0631\u0633\u062A \u0648 \u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627 \u0628\u0647 \u0633\u0631\u0648\u0631 \u0641\u0631\u0633\u062A\u0627\u062F\u0647 \u0646\u0645\u06CC\u200C\u0634\u0648\u0646\u062F.")))); }
function Compare({ a }) { const ps = a.state.compare.map(id => PP[id]); return React.createElement("div", { className: "page" },
    React.createElement("div", { className: "page-heading" },
        React.createElement("div", null,
            React.createElement("h1", null, "\u06A9\u0646\u0627\u0631 \u0647\u0645 \u0628\u0628\u06CC\u0646\u06CC\u062F\u061B \u062F\u0642\u06CC\u0642\u200C\u062A\u0631 \u062A\u0635\u0645\u06CC\u0645 \u0628\u06AF\u06CC\u0631\u06CC\u062F."),
            React.createElement("p", null, "\u0645\u0642\u0627\u06CC\u0633\u0647 \u062D\u062F\u0627\u06A9\u062B\u0631 \u0633\u0647 \u067E\u0631\u0648\u0646\u062F\u0647\u060C \u0628\u062F\u0648\u0646 \u0627\u0645\u062A\u06CC\u0627\u0632\u0633\u0627\u0632\u06CC \u0648 \u062C\u0645\u0639 \u0645\u0628\u0627\u0644\u063A \u0646\u0627\u0647\u0645\u200C\u062F\u0627\u0645\u0646\u0647.")),
        React.createElement(Btn, { kind: "ghost", icon: "plus", onClick: () => a.go('projects') }, "\u0627\u0646\u062A\u062E\u0627\u0628 \u0637\u0631\u062D")),
    React.createElement(Lens, { a: a }),
    ps.length ? React.createElement("div", { className: "compare-grid", style: { gridTemplateColumns: 'repeat(' + ps.length + ',minmax(0,1fr))' } }, ps.map(p => React.createElement("article", { key: p.id },
        React.createElement("header", null,
            React.createElement(Visual, { p: p }),
            React.createElement(IB, { name: "close", label: 'حذف مقایسه ' + p.id, onClick: () => a.compare(p.id) }),
            React.createElement("small", null, p.id),
            React.createElement("h2", null, p.title),
            React.createElement(Btn, { small: true, kind: "ghost", icon: "external", onClick: () => a.project(p.id) }, "\u067E\u0631\u0648\u0646\u062F\u0647 \u0645\u0633\u062A\u0642\u0644")),
        React.createElement("section", null,
            React.createElement("h3", null,
                "\u0627\u0631\u0632\u0634 \u0628\u0631\u0627\u06CC ",
                LENSES[a.state.lens].label),
            React.createElement("p", null, p.perspectives[a.state.lens])),
        React.createElement("section", null,
            React.createElement("h3", null, "\u062F\u0627\u0645\u0646\u0647 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC"),
            React.createElement("p", null, p.scope)),
        React.createElement("section", null,
            React.createElement("h3", null, "\u0634\u0627\u0647\u062F \u0627\u06CC\u0631\u0627\u0646"),
            p.iran.length ? p.iran.map(id => React.createElement(Source, { id: id, key: id, a: a })) : React.createElement("p", null, "\u0646\u06CC\u0627\u0632\u0645\u0646\u062F \u0634\u0648\u0627\u0647\u062F \u0647\u0645\u200C\u062F\u0627\u0645\u0646\u0647")),
        React.createElement("section", null,
            React.createElement("h3", null, "\u0646\u0645\u0648\u0646\u0647\u200C\u0647\u0627\u06CC \u067E\u0698\u0648\u0647\u0634"),
            p.case_ids.map(id => React.createElement("button", { key: id, className: "compare-case", onClick: () => a.modal({ type: 'case', id }) },
                React.createElement("span", { dir: "auto" }, CC[id].organization),
                React.createElement(I, { name: "external", size: 15 })))),
        React.createElement("section", null,
            React.createElement("h3", null, "\u0642\u06CC\u0645\u062A\u200C\u0647\u0627\u06CC \u0645\u0631\u062A\u0628\u0637"),
            p.quotes.length ? p.quotes.map(id => React.createElement("button", { key: id, className: "compare-quote", onClick: () => a.modal({ type: 'quote', id }) },
                React.createElement("span", null, QQ[id].product),
                React.createElement("strong", null, price(QQ[id])),
                React.createElement("small", null, QQ[id].unit))) : React.createElement("p", null, "\u0627\u0633\u062A\u0639\u0644\u0627\u0645 \u0644\u0627\u0632\u0645 \u0627\u0633\u062A\u061B \u0645\u062C\u0647\u0648\u0644\u060C \u0635\u0641\u0631 \u0646\u06CC\u0633\u062A.")),
        React.createElement("section", null,
            React.createElement("h3", null, "\u0631\u06CC\u0633\u06A9 \u0627\u062E\u062A\u0635\u0627\u0635\u06CC"),
            React.createElement("p", null, p.risk)),
        React.createElement("section", null,
            React.createElement("h3", null, "\u062C\u0645\u0639\u200C\u0628\u0646\u062F\u06CC \u0645\u062D\u0644\u06CC"),
            React.createElement("select", { "aria-label": 'تصمیم مقایسه ' + p.id, value: a.state.decisions[p.id] || 'new', onChange: e => a.decision(p.id, e.target.value) }, Object.entries(DECISIONS).map(([k, t]) => React.createElement("option", { key: k, value: k }, t))))))) : React.createElement(Empty, { title: "\u0637\u0631\u062D\u06CC \u0628\u0631\u0627\u06CC \u0645\u0642\u0627\u06CC\u0633\u0647 \u0627\u0646\u062A\u062E\u0627\u0628 \u0646\u0634\u062F\u0647", text: "\u0627\u0632 \u0646\u0645\u0627\u062F \u0645\u0642\u0627\u06CC\u0633\u0647 \u062F\u0631 \u06A9\u0627\u0631\u062A \u0647\u0631 \u0637\u0631\u062D \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F." })); }
function Stage({ p, a }) {
    const s = a.state;
    switch (s.step) {
        case 0: return React.createElement("div", { className: "stage-intro" },
            React.createElement("div", null,
                React.createElement("span", { className: "stage-label" },
                    D.families[p.family].title,
                    React.createElement("code", null, p.id)),
                React.createElement("h1", null, p.title),
                React.createElement("p", { className: "stage-value" }, cut(p.perspectives[s.lens], 230)),
                React.createElement("section", null,
                    React.createElement("small", null, "\u062A\u0639\u0631\u06CC\u0641 \u0637\u0631\u062D"),
                    React.createElement("p", null, p.definition)),
                React.createElement("div", { className: "stage-indicators" },
                    React.createElement("span", null,
                        React.createElement(I, { name: "globe", size: 17 }),
                        fa(p.case_ids.length),
                        " \u0646\u0645\u0648\u0646\u0647 \u067E\u0698\u0648\u0647\u0634"),
                    React.createElement("span", null,
                        React.createElement(I, { name: "wallet", size: 17 }),
                        p.quotes.length ? fa(p.quotes.length) + ' مشاهده قیمت' : 'نیازمند استعلام'),
                    React.createElement("button", { onClick: () => a.doc(p.path) },
                        React.createElement(I, { name: "file", size: 17 }),
                        "\u0627\u0635\u0644 \u067E\u0631\u0648\u0646\u062F\u0647"))),
            React.createElement(Visual, { p: p, big: true, a: a }));
        case 1: return React.createElement("div", { className: "stage-content" },
            React.createElement("div", { className: "stage-title" },
                React.createElement("small", null, p.title),
                React.createElement("h1", null, "\u06CC\u06A9 \u0637\u0631\u062D\u060C \u0633\u0647 \u0630\u06CC\u200C\u0646\u0641\u0639."),
                React.createElement("p", null, "\u0627\u0631\u0632\u0634 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC\u060C \u0646\u0647 \u0646\u062A\u06CC\u062C\u0647 \u062A\u0636\u0645\u06CC\u0646\u06CC")),
            React.createElement(ThreeValues, { p: p, a: a }),
            React.createElement(Flow, { p: p }),
            React.createElement("div", { className: "stage-footnote" },
                React.createElement(I, { name: "target" }),
                React.createElement("p", null, metric(p))));
        case 2: return React.createElement("div", { className: "stage-content" },
            React.createElement("div", { className: "stage-title" },
                React.createElement("small", null, p.title),
                React.createElement("h1", null, "\u0686\u0647 \u06A9\u0633\u06CC\u060C \u0686\u0647 \u0686\u06CC\u0632\u06CC \u0631\u0627 \u0622\u0632\u0645\u0648\u062F\u0647 \u0627\u0633\u062A\u061F")),
            React.createElement("div", { className: "stage-bench" },
                React.createElement(Iran, { p: p, a: a }),
                React.createElement(Global, { p: p, a: a })));
        case 3: return React.createElement("div", { className: "stage-content" },
            React.createElement("div", { className: "stage-title" },
                React.createElement("small", null, p.title),
                React.createElement("h1", null, "\u0642\u06CC\u0645\u062A \u0631\u0627 \u0628\u0627 \u062F\u0627\u0645\u0646\u0647\u200C\u0627\u0634 \u0628\u062E\u0648\u0627\u0646\u06CC\u0645.")),
            React.createElement(Note, { title: "\u0627\u06CC\u0646 \u0627\u0631\u0642\u0627\u0645\u060C \u067E\u06CC\u0634\u200C\u0641\u0627\u06A9\u062A\u0648\u0631 \u0646\u06CC\u0633\u062A\u0646\u062F" }, "\u0645\u0631\u062C\u0639 \u067E\u0698\u0648\u0647\u0634 \u06F1\u06F6 \u0627\u06A9\u062A\u0628\u0631 \u06F2\u06F0\u06F2\u06F6 \u0627\u0633\u062A. \u0642\u06CC\u0645\u062A \u062A\u062C\u0647\u06CC\u0632 \u06CC\u0627 \u0627\u0634\u062A\u0631\u0627\u06A9 \u0628\u0627 \u0647\u0632\u06CC\u0646\u0647 \u06A9\u0627\u0645\u0644 \u0646\u0635\u0628\u060C \u0627\u062A\u0635\u0627\u0644 \u0648 \u0628\u0647\u0631\u0647\u200C\u0628\u0631\u062F\u0627\u0631\u06CC \u0645\u062A\u0641\u0627\u0648\u062A \u0627\u0633\u062A."),
            p.quotes.length ? React.createElement("div", { className: "quote-grid" }, p.quotes.map(id => React.createElement(Quote, { q: QQ[id], key: id, a: a }))) : React.createElement(Empty, { title: "\u0642\u06CC\u0645\u062A \u0639\u0645\u0648\u0645\u06CC \u0647\u0645\u200C\u062F\u0627\u0645\u0646\u0647 \u0627\u062D\u0631\u0627\u0632 \u0646\u0634\u062F\u0647", text: p.scope, action: React.createElement(Btn, { kind: "ghost", onClick: () => a.doc('13-benchmarks-prices/rfq.md') }, "\u0642\u0627\u0644\u0628 \u0627\u0633\u062A\u0639\u0644\u0627\u0645") }),
            React.createElement("details", { className: "scenario-toggle" },
                React.createElement("summary", null,
                    React.createElement(I, { name: "settings" }),
                    "\u0628\u0627\u0632\u06A9\u0631\u062F\u0646 \u0633\u0646\u0627\u0631\u06CC\u0648\u06CC \u0647\u0632\u06CC\u0646\u0647 \u062A\u0648\u0633\u0639\u0647 \u2014 \u0641\u0631\u0636 \u067E\u0698\u0648\u0647\u0634\u060C \u0646\u0647 \u0642\u06CC\u0645\u062A \u0642\u0637\u0639\u06CC"),
                React.createElement(Scenario, { p: p })));
        case 4: return React.createElement("div", { className: "stage-content" },
            React.createElement("div", { className: "stage-title" },
                React.createElement("small", null, p.title),
                React.createElement("h1", null, "\u06A9\u0648\u0686\u06A9 \u0634\u0631\u0648\u0639 \u06A9\u0646\u06CC\u0645\u061B \u0646\u062A\u06CC\u062C\u0647 \u0631\u0627 \u0628\u0633\u0646\u062C\u06CC\u0645.")),
            React.createElement("div", { className: "stage-execution" },
                React.createElement("section", null,
                    React.createElement(I, { name: "target", size: 30 }),
                    React.createElement("h2", null, "\u062F\u0627\u0645\u0646\u0647 \u0622\u0632\u0645\u0627\u06CC\u0634"),
                    React.createElement("p", null, p.scope)),
                React.createElement("section", null,
                    React.createElement(I, { name: "shield", size: 30 }),
                    React.createElement("h2", null, "\u0631\u06CC\u0633\u06A9 \u0648 \u0645\u0631\u0632 \u062A\u0648\u0642\u0641"),
                    React.createElement("p", null, p.risk))),
            React.createElement("div", { className: "timeline" }, [['۱', 'شناخت و خط پایه', 'دامنه و مسئول روشن'], ['۲', 'نمونه و حالات خطا', 'آزمون جریان کامل'], ['۳', 'اجرای محدود', 'کیفیت، کار و هزینه'], ['۴', 'تصمیم مرحله بعد', 'ادامه، اصلاح یا توقف']].map(([n, t, x]) => React.createElement("section", { key: n },
                React.createElement("b", null, n),
                React.createElement("h3", null, t),
                React.createElement("p", null, x)))),
            React.createElement("div", { className: "stage-footnote" },
                React.createElement(I, { name: "users" }),
                React.createElement("p", null, baseIdea(p).owner || 'مالک حوزه کسب‌وکار با عملیات و فناوری؛ تأیید هزینه با مالی و الزامات تخصصی با مسئول مربوط.')),
            React.createElement(Btn, { kind: "ghost", icon: "file", onClick: () => a.doc(p.path) }, "\u062C\u0632\u0626\u06CC\u0627\u062A \u06A9\u0627\u0645\u0644 \u0648 \u0634\u0631\u0648\u0637 \u0627\u062C\u0631\u0627"));
        case 5: return React.createElement("div", { className: "stage-content" },
            React.createElement("div", { className: "stage-title" },
                React.createElement("small", null, p.title),
                React.createElement("h1", null, "\u062A\u0635\u0645\u06CC\u0645 \u0627\u06CC\u0646 \u0645\u0631\u062D\u0644\u0647 \u0686\u06CC\u0633\u062A\u061F"),
                React.createElement("p", null, "\u0642\u0628\u0644 \u0627\u0632 \u062A\u0639\u0647\u062F \u06AF\u0633\u062A\u0631\u062F\u0647\u061B \u0634\u0648\u0627\u0647\u062F\u060C \u0645\u0633\u0626\u0644\u0647 \u0648 \u0645\u0633\u0626\u0648\u0644\u06CC\u062A.")),
            React.createElement("div", { className: "decision-stage" },
                React.createElement(QA, { p: p, a: a }),
                React.createElement("div", null,
                    React.createElement(Note, null, "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u0627\u06CC\u0646 \u0628\u062E\u0634 \u0631\u0648\u06CC \u0647\u0645\u06CC\u0646 \u0646\u0645\u0627\u06CC\u0634\u06AF\u0631 \u0648 \u067E\u0631\u0648\u0698\u06A9\u062A\u0648\u0631 \u0647\u0645 \u062F\u06CC\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F."),
                    React.createElement(Decision, { p: p, a: a }))));
        default: return null;
    }
}
function Presentation({ a }) { const s = a.state, p = PP[s.deck[s.slide]]; if (!p)
    return null; return React.createElement("div", { className: "presentation" },
    React.createElement("header", { className: "present-header" },
        React.createElement("button", { className: "present-brand", onClick: () => a.exit() },
            React.createElement(BrandLogo, null),
            React.createElement("strong", null, "\u0641\u0631\u062F\u0627")),
        React.createElement("div", { className: "present-counter" },
            React.createElement("span", null,
                "\u0637\u0631\u062D ",
                fa(s.slide + 1),
                " \u0627\u0632 ",
                fa(s.deck.length)),
            React.createElement("code", null, p.id)),
        React.createElement(Lens, { a: a }),
        React.createElement("div", { className: "present-tools" },
            React.createElement(IB, { name: "search", label: "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0634\u0648\u0627\u0647\u062F", onClick: () => a.modal({ type: 'search' }) }),
            React.createElement(IB, { name: "list", label: "\u0641\u0647\u0631\u0633\u062A \u0627\u0631\u0627\u0626\u0647", active: s.presentMenu, onClick: () => a.set({ presentMenu: !s.presentMenu }) }),
            React.createElement(IB, { name: "file", label: "\u0627\u0635\u0644 \u067E\u0631\u0648\u0646\u062F\u0647 \u0637\u0631\u062D", onClick: () => a.doc(p.path) }),
            React.createElement(IB, { name: "fullscreen", label: "\u062A\u0645\u0627\u0645\u200C\u0635\u0641\u062D\u0647", onClick: () => a.fullscreen() }),
            React.createElement(IB, { name: "close", label: "\u062E\u0631\u0648\u062C \u0627\u0632 \u0627\u0631\u0627\u0626\u0647", onClick: () => a.exit() }))),
    React.createElement("nav", { className: "stage-tabs", "aria-label": "\u0645\u0631\u0627\u062D\u0644 \u0631\u0648\u0627\u06CC\u062A" }, STAGES.map((t, i) => React.createElement("button", { key: t, className: s.step === i ? 'selected' : s.step > i ? 'passed' : '', onClick: () => a.set({ step: i }) },
        React.createElement("span", null, fa(i + 1)),
        t))),
    React.createElement("main", { className: "present-scroll", id: "present-scroll" },
        React.createElement("div", { className: "stage-frame", key: p.id + '-' + s.step },
            React.createElement(Stage, { p: p, a: a }))),
    s.presentMenu && React.createElement("aside", { className: "present-menu" },
        React.createElement("header", null,
            React.createElement("h3", null, "\u067E\u0631\u0634 \u0628\u0647 \u0637\u0631\u062D"),
            React.createElement(IB, { name: "close", label: "\u0628\u0633\u062A\u0646 \u0641\u0647\u0631\u0633\u062A \u0627\u0631\u0627\u0626\u0647", onClick: () => a.set({ presentMenu: false }) })),
        s.deck.map((id, i) => React.createElement("button", { key: id, className: i === s.slide ? 'selected' : '', onClick: () => a.set({ slide: i, step: 0, presentMenu: false }) },
            React.createElement("span", null, fa(i + 1)),
            React.createElement("strong", null, PP[id].title),
            React.createElement("code", null, id)))),
    React.createElement("footer", { className: "present-footer" },
        React.createElement("div", { className: "project-navigation" },
            React.createElement(IB, { name: "right", label: "\u0637\u0631\u062D \u0642\u0628\u0644 \u062F\u0631 \u0627\u0631\u0627\u0626\u0647", disabled: s.slide === 0, onClick: () => a.nextSlide(-1) }),
            React.createElement("span", null, cut(p.title, 45)),
            React.createElement(IB, { name: "arrow", label: "\u0637\u0631\u062D \u0628\u0639\u062F \u062F\u0631 \u0627\u0631\u0627\u0626\u0647", disabled: s.slide === s.deck.length - 1, onClick: () => a.nextSlide(1) })),
        React.createElement("div", { className: "keyboard-help" },
            React.createElement("kbd", null, "\u2190"),
            React.createElement("kbd", null, "Space"),
            React.createElement("span", null, "\u0645\u0631\u062D\u0644\u0647 \u0628\u0639\u062F"),
            React.createElement("kbd", null, "Esc"),
            React.createElement("span", null, "\u062E\u0631\u0648\u062C")),
        React.createElement("div", { className: "step-navigation" },
            React.createElement(Btn, { small: true, kind: "ghost", icon: "right", disabled: s.slide === 0 && s.step === 0, onClick: () => a.next(-1) }, "\u0642\u0628\u0644\u06CC"),
            React.createElement("span", null,
                fa(s.step + 1),
                " / \u06F6"),
            React.createElement(Btn, { small: true, icon: "arrow", onClick: () => a.next(1) }, s.step === 5 ? (s.slide === s.deck.length - 1 ? 'پایان ارائه' : 'طرح بعدی') : 'ادامه روایت'))),
    React.createElement("div", { className: "progress" },
        React.createElement("i", { style: { width: ((s.slide * 6 + s.step + 1) / (s.deck.length * 6) * 100) + '%' } }))); }
/* 35-motion.jsx */
/* Progressive enhancement: no content is hidden while waiting for JavaScript. */
class FamiliMotion {
    constructor(app) {
        this.app = app;
        this.seen = new WeakSet();
        this.effects = new Set();
        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        this.frame = 0;
        this.pointerFrame = 0;
        this.photoFrame = 0;
        this.hero = null;
        this.heroVisible = false;
        this.photo = null;
        this.onScroll = () => this.queueProgress();
        this.onVisibility = () => this.refreshPreference();
        this.onPreference = () => { this.app.setState({ systemReduceMotion: this.reduced.matches }, () => this.app.preferences()); this.refreshPreference(); };
        this.onPointer = e => this.pointer(e);
        this.onPointerLeave = () => this.resetPointer();
        this.onFocus = e => { this.finishInside(e.target); this.resetPhoto(); };
        this.onPhotoPointer = e => this.photoPointer(e);
        this.onDocumentLeave = () => this.resetPhoto();
        this.onResize = () => { this.resetPointer(); this.resetPhoto(); this.queueProgress(); };
    }
    start() {
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onResize, { passive: true });
        document.addEventListener('visibilitychange', this.onVisibility);
        document.addEventListener('focusin', this.onFocus);
        document.addEventListener('pointermove', this.onPhotoPointer, { passive: true });
        document.documentElement.addEventListener('pointerleave', this.onDocumentLeave);
        if (this.reduced.addEventListener)
            this.reduced.addEventListener('change', this.onPreference);
        else
            this.reduced.addListener(this.onPreference);
        try {
            if ('IntersectionObserver' in window) {
                this.revealObserver = new IntersectionObserver(entries => {
                    let delay = 0;
                    entries.forEach(entry => {
                        if (!entry.isIntersecting)
                            return;
                        this.revealObserver.unobserve(entry.target);
                        if (this.allowed() && !entry.target.contains(document.activeElement)) {
                            this.reveal(entry.target, Math.min(delay++ * 75, 300));
                        }
                    });
                }, { threshold: .06, rootMargin: '0px 0px -18px 0px' });
                this.heroObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => { if (entry.target === this.hero) {
                        this.heroVisible = entry.isIntersecting;
                        this.hero.classList.toggle('motion-in-view', entry.isIntersecting);
                        if (!entry.isIntersecting) {
                            this.resetPointer();
                            this.effects.forEach(effect => { var _a; if (this.hero.contains((_a = effect.effect) === null || _a === void 0 ? void 0 : _a.target))
                                effect.cancel(); });
                        }
                    } });
                }, { threshold: 0 });
            }
        }
        catch (error) {
            this.revealObserver = null;
            this.heroObserver = null;
        }
        this.refreshPreference();
        this.update(true);
    }
    allowed() { return !this.app.state.reduceMotion && !this.reduced.matches && !document.hidden; }
    animate(element, keyframes, duration, delay = 0) {
        if (!this.allowed() || !element || typeof element.animate !== 'function')
            return;
        try {
            const effect = element.animate(keyframes, { duration, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
            this.effects.add(effect);
            effect.onfinish = effect.oncancel = () => this.effects.delete(effect);
        }
        catch (error) { /* Enhancement failure must never obscure content. */ }
    }
    update(routeChanged = false) {
        var _a;
        const content = document.getElementById('content');
        if (routeChanged) {
            this.effects.forEach(effect => effect.cancel());
            this.effects.clear();
            (_a = this.revealObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
            this.resetPhoto();
            this.bindHero((content === null || content === void 0 ? void 0 : content.querySelector('.hero')) || null);
            /* Keep the whole route readable while its individual composition arrives. */
            this.animate(content === null || content === void 0 ? void 0 : content.firstElementChild, [{ transform: 'translateY(10px)' }, { transform: 'none' }], 420);
        }
        if (content && this.revealObserver) {
            const targets = content.querySelectorAll('.perspective,.card,.case-card,.concept-card,.library-item,.quote,.proof-band,.home-session,.experience-card,.experience-panel,.editorial-card,.story-card,.insight-ribbon,.cinematic-proof,.brand-strip,.brand-feature-photo,.brand-experience,[data-reveal]');
            targets.forEach(target => {
                var _a;
                if (this.seen.has(target))
                    return;
                this.seen.add(target);
                if (!this.allowed())
                    return;
                /* Parent and child reveals must not multiply opacity or delay focus. */
                if ((_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.closest('[data-reveal],.experience-panel,.proof-band,.home-session,.brand-experience'))
                    return;
                this.revealObserver.observe(target);
            });
        }
        this.refreshPreference();
        this.queueProgress();
    }
    bindHero(next) {
        var _a, _b;
        if (this.hero === next)
            return;
        if (this.hero) {
            this.hero.removeEventListener('pointermove', this.onPointer);
            this.hero.removeEventListener('pointerleave', this.onPointerLeave);
            (_a = this.heroObserver) === null || _a === void 0 ? void 0 : _a.unobserve(this.hero);
            this.resetPointer();
        }
        this.hero = next;
        this.heroVisible = !!next;
        if (next) {
            next.addEventListener('pointermove', this.onPointer, { passive: true });
            next.addEventListener('pointerleave', this.onPointerLeave);
            (_b = this.heroObserver) === null || _b === void 0 ? void 0 : _b.observe(next);
            this.animate(next.querySelector('.hero-media>img'), [{ scale: '1.105' }, { scale: '1.035' }], 3800);
            next.querySelectorAll('.brand-hero-word').forEach((word, i) => this.animate(word, [{ opacity: .15, translate: '0 28px', clipPath: 'inset(0 0 80% 0)' }, { opacity: 1, translate: '0 0', clipPath: 'inset(0 0 0 0)' }], 1000, 140 + i * 135));
            next.querySelectorAll('.hero-eyebrow,.hero-copy>p,.hero-copy>.actions,.hero-discovery').forEach((item, i) => this.animate(item, [{ opacity: .1, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], 800, 300 + i * 110));
            next.querySelectorAll('.brand-orbit').forEach((orbit, i) => this.animate(orbit, [{ rotate: '-45deg', scale: '.75', opacity: .1 }, { rotate: '0deg', scale: '1', opacity: 1 }], 1700, 120 + i * 90));
            next.querySelectorAll('.brand-trace').forEach(trace => this.animate(trace, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], 1450, 450));
        }
    }
    reveal(target, delay) {
        if (target.matches('.brand-strip')) {
            this.animate(target, [{ opacity: .25, translate: '32px 0' }, { opacity: 1, translate: '0 0' }], 900, delay);
        }
        else if (target.matches('.brand-feature-photo,.brand-experience')) {
            this.animate(target, [{ opacity: .4, translate: '0 35px', clipPath: 'inset(10% 0 0 0)' }, { opacity: 1, translate: '0 0', clipPath: 'inset(0 0 0 0)' }], 1000, delay);
            const photo = target.querySelector('img');
            this.animate(photo, [{ scale: '1.12' }, { scale: '1' }], 1600, delay);
        }
        else {
            this.animate(target, [{ opacity: 0, transform: 'translateY(24px) scale(.985)' }, { opacity: 1, transform: 'none' }], 700, delay);
        }
    }
    photoPointer(event) {
        var _a, _b;
        if (!this.allowed() || !this.finePointer.matches || event.pointerType === 'touch') {
            this.resetPhoto();
            return;
        }
        const next = (_b = (_a = event.target).closest) === null || _b === void 0 ? void 0 : _b.call(_a, '.brand-feature-photo');
        if (this.photo !== next) {
            this.resetPhoto();
            this.photo = next;
        }
        if (!next)
            return;
        const bounds = next.getBoundingClientRect();
        if (!bounds.width || !bounds.height)
            return;
        this.photoPosition = { x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2)), y: Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2)) };
        if (this.photoFrame)
            return;
        this.photoFrame = requestAnimationFrame(() => {
            this.photoFrame = 0;
            if (!this.photo || !this.allowed())
                return;
            this.photo.style.setProperty('--photo-pointer-x', (this.photoPosition.x * 8).toFixed(2) + 'px');
            this.photo.style.setProperty('--photo-pointer-y', (this.photoPosition.y * 6).toFixed(2) + 'px');
        });
    }
    resetPhoto() {
        if (this.photoFrame)
            cancelAnimationFrame(this.photoFrame);
        this.photoFrame = 0;
        if (this.photo) {
            this.photo.style.removeProperty('--photo-pointer-x');
            this.photo.style.removeProperty('--photo-pointer-y');
            this.photo = null;
        }
    }
    pointer(event) {
        if (!this.allowed() || !this.finePointer.matches || !this.heroVisible || event.pointerType === 'touch')
            return;
        const bounds = this.hero.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
        const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
        this.pointerPosition = { x, y };
        if (this.pointerFrame)
            return;
        this.pointerFrame = requestAnimationFrame(() => {
            this.pointerFrame = 0;
            if (!this.hero || !this.allowed())
                return;
            this.hero.style.setProperty('--hero-pointer-x', (this.pointerPosition.x * 7).toFixed(2) + 'px');
            this.hero.style.setProperty('--hero-pointer-y', (this.pointerPosition.y * 5).toFixed(2) + 'px');
        });
    }
    resetPointer() {
        if (this.pointerFrame)
            cancelAnimationFrame(this.pointerFrame);
        this.pointerFrame = 0;
        if (this.hero) {
            this.hero.style.setProperty('--hero-pointer-x', '0px');
            this.hero.style.setProperty('--hero-pointer-y', '0px');
        }
    }
    finishInside(target) {
        this.effects.forEach(effect => { var _a; let element = (_a = effect.effect) === null || _a === void 0 ? void 0 : _a.target; if (element && (element === target || element.contains(target))) {
            try {
                effect.finish();
            }
            catch {
                effect.cancel();
            }
            this.effects.delete(effect);
        } });
    }
    refreshPreference() {
        const paused = !this.allowed();
        document.documentElement.classList.toggle('motion-paused', paused);
        if (paused) {
            this.effects.forEach(effect => effect.cancel());
            this.effects.clear();
            this.resetPointer();
            this.resetPhoto();
        }
    }
    queueProgress() {
        if (this.frame || document.hidden)
            return;
        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            const doc = document.documentElement;
            const length = Math.max(0, doc.scrollHeight - window.innerHeight);
            const progress = length ? Math.min(1, Math.max(0, window.scrollY / length)) : 0;
            doc.style.setProperty('--reading-progress', String(progress));
        });
    }
    destroy() {
        var _a, _b;
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('visibilitychange', this.onVisibility);
        document.removeEventListener('focusin', this.onFocus);
        document.removeEventListener('pointermove', this.onPhotoPointer);
        document.documentElement.removeEventListener('pointerleave', this.onDocumentLeave);
        this.resetPhoto();
        if (this.reduced.removeEventListener)
            this.reduced.removeEventListener('change', this.onPreference);
        else
            this.reduced.removeListener(this.onPreference);
        (_a = this.revealObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this.heroObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
        this.bindHero(null);
        this.effects.forEach(effect => effect.cancel());
        this.effects.clear();
        cancelAnimationFrame(this.frame);
        cancelAnimationFrame(this.pointerFrame);
    }
}
function MotionToggle({ a }) {
    const system = a.state.systemReduceMotion, paused = a.state.reduceMotion || system;
    const label = system ? 'کاهش حرکت طبق تنظیمات دستگاه' : paused ? 'فعال‌کردن انیمیشن‌ها' : 'توقف انیمیشن‌ها';
    return React.createElement("button", { className: cx('motion-toggle', paused && 'is-paused'), "aria-label": label, title: label, "aria-pressed": !paused, "aria-disabled": system || undefined, onClick: () => system ? a.toast('کاهش حرکت در تنظیمات دستگاه فعال است.') : a.set({ reduceMotion: !a.state.reduceMotion }, true) },
        React.createElement("svg", { "aria-hidden": "true", width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }, paused ? React.createElement("path", { d: "m8 5 11 7-11 7V5Z" }) : React.createElement("g", null,
            React.createElement("path", { d: "M8 5v14M16 5v14" }),
            React.createElement("path", { className: "motion-orbit", d: "M3 8a10 10 0 0 1 18 0M21 16a10 10 0 0 1-18 0" }))),
        React.createElement("span", null, paused ? 'حرکت خاموش' : 'حرکت روشن'));
}
/* 36-navigation.jsx */
/* The chapter navigation is deliberately separate from the content and session model. */
const CHAPTER_ART = {
    home: ['brand-market.webp', 'از امروز، به فردای فامیلی', 'تصویر مفهومی برای هایپرفامیلی'],
    projects: ['figure-11-01.webp', 'ایده‌ها را از نزدیک ببینید', 'تصویر از سند مدیر · نمونه معرفی'],
    atlas: ['figure-19-01.webp', 'یک جهان، هزار امکان', 'تصویر از سند مدیر · نمونه معرفی'],
    prices: ['figure-13-01.webp', 'از ایده، تا برآورد', 'تصویر از سند مدیر · نمونه معرفی'],
    library: ['figure-06-01.webp', 'هر تصمیم، یک پشتوانه', 'تصویر از سند مدیر · نمونه معرفی'],
    agenda: ['brand-cafe.webp', 'فردا را با هم بسازیم', 'تصویر مفهومی برای هایپرفامیلی'],
    compare: ['figure-21-01.webp', 'انتخاب، با نگاه دقیق‌تر', 'تصویر از سند مدیر · نمونه معرفی'],
    concepts: ['brand-market.webp', 'آینده، از ترکیب ایده‌ها', 'تصویر مفهومی برای هایپرفامیلی']
};
const chapterSelected = (view, key) => view === key || (key === 'projects' && view === 'detail');
function BrandNavigation({ a }) {
    let s = a.state;
    return React.createElement("header", { className: "brand-navigation" },
        React.createElement("div", { className: "brand-masthead" },
            React.createElement("button", { className: "masthead-brand", "aria-label": "\u0641\u0627\u0645\u06CC\u0644\u06CC \u0641\u0631\u062F\u0627\u061B \u0646\u0645\u0627\u06CC \u06A9\u0644\u06CC", onClick: () => a.go('home') },
                React.createElement(BrandLogo, { className: "masthead-logo" }),
                React.createElement("span", { className: "masthead-brand-title" },
                    React.createElement("strong", null, "\u0641\u0627\u0645\u06CC\u0644\u06CC \u0641\u0631\u062F\u0627"),
                    React.createElement("small", null, "\u0686\u0634\u0645\u200C\u0627\u0646\u062F\u0627\u0632 \u0646\u0648\u0622\u0648\u0631\u06CC"))),
            React.createElement("div", { className: "masthead-editorial", "aria-hidden": "true" },
                React.createElement("span", null, "\u0641\u0631\u062F\u0627\u06CC \u0628\u0647\u062A\u0631\u060C \u0627\u0632 \u0627\u0645\u0631\u0648\u0632."),
                React.createElement("small", null, "FAMILI / TOMORROW")),
            React.createElement("div", { className: "masthead-tools" },
                React.createElement(MotionToggle, { a: a }),
                React.createElement("button", { className: "masthead-search", "aria-label": "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0634\u0648\u0627\u0647\u062F", title: "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0634\u0648\u0627\u0647\u062F \u2014 \u2318 K", onClick: () => a.modal({ type: 'search' }) },
                    React.createElement(I, { name: "search", size: 21 })),
                React.createElement("button", { className: "masthead-present", onClick: () => a.present() },
                    React.createElement(I, { name: "play", size: 17 }),
                    React.createElement("span", null, "\u062D\u0627\u0644\u062A \u0627\u0631\u0627\u0626\u0647")),
                React.createElement("button", { className: "chapter-menu-trigger", "aria-label": "\u0628\u0627\u0632\u06A9\u0631\u062F\u0646 \u0641\u0647\u0631\u0633\u062A", "aria-haspopup": "dialog", "aria-expanded": s.mobileNav, "aria-controls": "chapter-menu", onClick: () => a.set({ mobileNav: true }) },
                    React.createElement("span", null, "\u0646\u0642\u0634\u0647\u0654 \u0641\u0631\u062F\u0627"),
                    React.createElement("span", { className: "menu-lines", "aria-hidden": "true" },
                        React.createElement("i", null),
                        React.createElement("i", null))))),
        React.createElement("div", { className: "chapter-rail-wrap" },
            React.createElement("nav", { className: "chapter-rail", "aria-label": "\u0646\u0627\u0648\u0628\u0631\u06CC \u0627\u0635\u0644\u06CC" }, NAV.map(([key, title], index) => React.createElement("button", { key: key, className: cx('chapter-link', chapterSelected(s.view, key) && 'selected'), "aria-current": chapterSelected(s.view, key) ? 'page' : undefined, "aria-label": title, onClick: () => a.go(key) },
                React.createElement("span", { className: "chapter-number", "aria-hidden": "true" }, fa(index + 1).padStart(2, '۰')),
                React.createElement("span", null, title),
                key === 'agenda' && React.createElement("b", null, fa(s.agenda.length))))),
            React.createElement("span", { className: "rail-caption" },
                "\u0627\u062A\u0627\u0642 \u0627\u0631\u0627\u0626\u0647 \u0647\u06CC\u0626\u062A\u200C\u0645\u062F\u06CC\u0631\u0647 ",
                React.createElement("span", { className: "rail-dot" }))),
        React.createElement("div", { className: "reading-progress", "aria-hidden": "true" },
            React.createElement("span", null)));
}
class ChapterMenu extends React.Component {
    constructor(props) { super(props); this.state = { preview: props.a.state.view === 'detail' ? 'projects' : props.a.state.view }; this.onKey = e => this.key(e); }
    componentDidMount() { var _a; this.returnFocus = document.activeElement; this.previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; this.background = document.querySelector('.shell'); if (this.background) {
        this.oldInert = this.background.inert;
        this.oldHidden = this.background.getAttribute('aria-hidden');
        this.background.inert = true;
        this.background.setAttribute('aria-hidden', 'true');
    } document.addEventListener('keydown', this.onKey, true); (_a = this.closeButton) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true }); }
    componentWillUnmount() { var _a; document.removeEventListener('keydown', this.onKey, true); document.body.style.overflow = this.previousOverflow; if (this.background) {
        this.background.inert = this.oldInert;
        if (this.oldHidden === null)
            this.background.removeAttribute('aria-hidden');
        else
            this.background.setAttribute('aria-hidden', this.oldHidden);
    } if ((_a = this.returnFocus) === null || _a === void 0 ? void 0 : _a.isConnected)
        this.returnFocus.focus({ preventScroll: true }); if (this.navigating)
        requestAnimationFrame(() => { var _a; return (_a = document.getElementById('content')) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true }); }); }
    key(e) { if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.props.a.set({ mobileNav: false });
        return;
    } if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.action(() => this.props.a.modal({ type: 'search' }));
        return;
    } if (e.key === 'Tab') {
        let list = Array.from(this.el.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]')).filter(el => el.getClientRects().length);
        let first = list[0], last = list[list.length - 1];
        if (e.shiftKey && (document.activeElement === first || !this.el.contains(document.activeElement))) {
            e.preventDefault();
            last === null || last === void 0 ? void 0 : last.focus();
        }
        else if (!e.shiftKey && (document.activeElement === last || !this.el.contains(document.activeElement))) {
            e.preventDefault();
            first === null || first === void 0 ? void 0 : first.focus();
        }
    } }
    action(fn) { this.props.a.setState({ mobileNav: false }, fn); }
    navigate(view) { this.navigating = true; this.props.a.go(view); }
    render() {
        let a = this.props.a, s = a.state, items = NAV.concat([['compare', 'مقایسه طرح‌ها', 'compare'], ['concepts', 'مفهوم‌های ترکیبی', 'sparkles']]), preview = CHAPTER_ART[this.state.preview] || CHAPTER_ART.home;
        return React.createElement("section", { id: "chapter-menu", ref: el => this.el = el, className: "chapter-menu", role: "dialog", "aria-modal": "true", "aria-labelledby": "chapter-menu-title" },
            React.createElement("header", { className: "chapter-menu-header" },
                React.createElement(BrandLogo, { className: "menu-brand-logo" }),
                React.createElement("span", { className: "menu-header-note" }, "\u06CC\u06A9 \u0642\u062F\u0645 \u0646\u0632\u062F\u06CC\u06A9\u200C\u062A\u0631 \u0628\u0647 \u0622\u06CC\u0646\u062F\u0647"),
                React.createElement("button", { className: "chapter-menu-close", ref: el => this.closeButton = el, onClick: () => a.set({ mobileNav: false }), "aria-label": "\u0628\u0633\u062A\u0646 \u0641\u0647\u0631\u0633\u062A" },
                    React.createElement("span", null, "\u0628\u0627\u0632\u06AF\u0634\u062A"),
                    React.createElement(I, { name: "close", size: 23 }))),
            React.createElement("div", { className: "chapter-menu-content" },
                React.createElement("div", { className: "chapter-menu-links" },
                    React.createElement("div", { className: "menu-overline" },
                        React.createElement("span", null, "\u0645\u0633\u06CC\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F"),
                        React.createElement("small", { dir: "ltr" }, "EXPLORE / 08")),
                    React.createElement("h2", { id: "chapter-menu-title" },
                        "\u0646\u0642\u0634\u0647\u0654 ",
                        React.createElement("em", null, "\u0641\u0631\u062F\u0627")),
                    React.createElement("nav", { "aria-label": "\u0641\u0647\u0631\u0633\u062A \u062A\u0635\u0648\u06CC\u0631\u06CC" }, items.map(([key, title, icon], index) => React.createElement("button", { key: key, style: { '--chapter-index': index }, className: cx('menu-chapter', chapterSelected(s.view, key) && 'is-current', this.state.preview === key && 'is-preview'), "aria-current": chapterSelected(s.view, key) ? 'page' : undefined, onMouseEnter: () => this.setState({ preview: key }), onFocus: () => this.setState({ preview: key }), onClick: () => this.navigate(key) },
                        React.createElement("span", { className: "menu-chapter-number", "aria-hidden": "true" }, fa(index + 1).padStart(2, '۰')),
                        React.createElement("strong", null, title),
                        React.createElement("small", null, key === 'projects' ? fa(projects.length) + ' طرح' : key === 'atlas' ? fa(cases.length) + ' نمونه' : key === 'agenda' ? fa(s.agenda.length) + ' طرح' : key === 'compare' ? fa(s.compare.length) + '/۳' : key === 'concepts' ? '۱۰ مفهوم' : ''),
                        React.createElement(I, { name: "arrow", size: 22 }))))),
                React.createElement("figure", { className: "chapter-menu-art" },
                    React.createElement("img", { key: preview[0], src: media(preview[0]), alt: "" }),
                    React.createElement("div", { className: "menu-art-shade" }),
                    React.createElement("span", { className: "menu-art-word", "aria-hidden": "true" }, "\u0641\u0640\u0631\u062F\u0627"),
                    React.createElement("figcaption", null,
                        React.createElement("span", null, preview[2]),
                        React.createElement("strong", null, preview[1]),
                        React.createElement("span", { className: "menu-art-line" })))),
            React.createElement("footer", { className: "chapter-menu-footer" },
                React.createElement("div", null,
                    React.createElement("button", { onClick: () => this.action(() => a.modal({ type: 'manager', page: 1 })) },
                        React.createElement(I, { name: "file", size: 18 }),
                        "\u0633\u0646\u062F \u062A\u0635\u0648\u06CC\u0631\u06CC \u0645\u062F\u06CC\u0631",
                        React.createElement("span", null, "\u06F3\u06F4 \u0635\u0641\u062D\u0647")),
                    React.createElement("button", { onClick: () => this.action(() => a.modal({ type: 'settings' })) },
                        React.createElement(I, { name: "settings", size: 18 }),
                        "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0648 \u0631\u0627\u0647\u0646\u0645\u0627"),
                    React.createElement("button", { onClick: () => this.action(() => a.modal({ type: 'search' })) },
                        React.createElement(I, { name: "search", size: 18 }),
                        "\u062C\u0633\u062A\u200C\u0648\u062C\u0648\u06CC \u0634\u0648\u0627\u0647\u062F")),
                React.createElement("span", null, "\u0641\u0627\u0645\u06CC\u0644\u06CC \u0641\u0631\u062F\u0627 \u00B7 \u0627\u0632 \u062A\u062C\u0631\u0628\u0647 \u0648 \u0634\u0648\u0627\u0647\u062F\u060C \u062A\u0627 \u062A\u0635\u0645\u06CC\u0645")));
    }
}
/* 40-app.jsx */
const KEY = 'famili-farda-session-v1';
const NAV = [['home', 'نمای کلی', 'grid'], ['projects', 'همه طرح‌ها', 'layers'], ['atlas', 'بنچمارک جهانی', 'globe'], ['prices', 'قیمت‌نامه', 'wallet'], ['library', 'کتابخانه شواهد', 'book'], ['agenda', 'جلسه من', 'list']];
const VIEWS = ['home', 'projects', 'detail', 'atlas', 'prices', 'library', 'agenda', 'compare', 'concepts'];
const SAVE = ['lens', 'agenda', 'favorites', 'compare', 'notes', 'decisions', 'scale', 'reduceMotion'];
function validate(x) { if (!x || x.version !== 1)
    throw Error('نسخه فایل شناخته نشد.'); let s = x.state || x, o = {}; for (let k of ['agenda', 'favorites', 'compare']) {
    if (!Array.isArray(s[k]) || s[k].some(v => typeof v !== 'string' || !PP[v]))
        throw Error('فهرست طرح‌ها معتبر نیست.');
    o[k] = [...new Set(s[k])];
    if (k === 'compare' && o[k].length > 3)
        throw Error('بیش از سه طرح برای مقایسه ثبت شده است.');
} o.lens = own(LENSES, s.lens) ? s.lens : 'management'; o.notes = {}; o.decisions = {}; for (let [id, t] of Object.entries(s.notes || {})) {
    if (!PP[id] || typeof t !== 'string' || t.length > 10000)
        throw Error('یادداشت نامعتبر است.');
    o.notes[id] = t;
} for (let [id, t] of Object.entries(s.decisions || {})) {
    if (!PP[id] || !own(DECISIONS, t))
        throw Error('جمع‌بندی نامعتبر است.');
    o.decisions[id] = t;
} o.scale = Math.max(.9, Math.min(1.25, Number(s.scale) || 1)); o.reduceMotion = !!s.reduceMotion; return o; }
function route() { let p = new URLSearchParams(location.hash.slice(1)), o = {}; if (VIEWS.includes(p.get('v')))
    o.view = p.get('v'); if (PP[p.get('p')])
    o.id = p.get('p'); if (own(LENSES, p.get('lens')))
    o.lens = p.get('lens'); return o; }
class App extends React.Component {
    constructor(p) { super(p); let saved = {}; try {
        let x = localStorage.getItem(KEY);
        if (x)
            saved = validate(JSON.parse(x));
    }
    catch { } this.state = { view: 'home', lens: 'management', id: 'M07', tab: 'overview', query: '', family: '', onlyPrice: false, onlyManager: false, onlyFav: false, onlyLead: false, priceQuery: '', currency: '', market: '', caseQuery: '', region: '', maturity: '', docQuery: '', docType: '', docPage: 0, archives: false, fullText: false, libraryReady: !!window.FAMILI_LIBRARY, libraryError: '', globalQuery: '', modal: null, modalHistory: [], agenda: DEFAULT_AGENDA.slice(), favorites: [], compare: [], notes: {}, decisions: {}, scale: 1, systemReduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, presenting: false, deck: [], slide: 0, step: 0, presentMenu: false, mobileNav: false, toast: '', ...saved, ...route() }; this.key = e => this.keys(e); this.hash = () => this.setState(route()); this.promise = null; }
    componentDidMount() { window.addEventListener('keydown', this.key); window.addEventListener('hashchange', this.hash); this.preferences(); window.FamiliApp = this; document.title = 'فامیلی فردا | اتاق ارائه هیئت‌مدیره'; this.motion = new FamiliMotion(this); this.motion.start(); }
    componentWillUnmount() { var _a; (_a = this.motion) === null || _a === void 0 ? void 0 : _a.destroy(); window.removeEventListener('keydown', this.key); window.removeEventListener('hashchange', this.hash); clearTimeout(this.toastTimer); }
    componentDidUpdate(prevProps, p) { var _a, _b, _c; if (p.scale !== this.state.scale || p.reduceMotion !== this.state.reduceMotion || p.systemReduceMotion !== this.state.systemReduceMotion)
        this.preferences(); if (p.view !== this.state.view || p.id !== this.state.id)
        window.scrollTo(0, 0); if (p.step !== this.state.step || p.slide !== this.state.slide) {
        (_a = document.getElementById('present-scroll')) === null || _a === void 0 ? void 0 : _a.scrollTo(0, 0);
        (_b = document.querySelector('.stage-tabs .selected')) === null || _b === void 0 ? void 0 : _b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
    } (_c = this.motion) === null || _c === void 0 ? void 0 : _c.update(p.view !== this.state.view || p.id !== this.state.id || p.tab !== this.state.tab || p.presenting !== this.state.presenting); }
    preferences() { var _a; document.documentElement.style.setProperty('--scale', this.state.scale); document.documentElement.classList.toggle('reduce-motion', this.state.reduceMotion || this.state.systemReduceMotion); (_a = this.motion) === null || _a === void 0 ? void 0 : _a.refreshPreference(); }
    set(o, save = false) { this.setState(o, () => { if (save)
        this.save(); }); }
    save() { let state = {}; SAVE.forEach(k => state[k] = this.state[k]); try {
        localStorage.setItem(KEY, JSON.stringify({ version: 1, state }));
    }
    catch {
        this.toast('ذخیره مرورگر ممکن نشد؛ خروجی جلسه را دریافت کنید.');
    } }
    sync() { let s = this.state, p = new URLSearchParams({ v: s.view, lens: s.lens }); if (s.view === 'detail')
        p.set('p', s.id); try {
        history.pushState(null, '', '#' + p);
    }
    catch { } }
    go(view) { if (!VIEWS.includes(view))
        return; this.setState({ view, presenting: false, modal: null, modalHistory: [], mobileNav: false }, () => this.sync()); }
    lens(lens) { if (!own(LENSES, lens))
        return; this.setState({ lens }, () => { this.save(); this.sync(); }); }
    project(id, tab = 'overview') { if (!PP[id])
        return; this.setState({ view: 'detail', id, tab, modal: null, modalHistory: [], presenting: false, mobileNav: false }, () => this.sync()); }
    nextProject(delta) { let i = projects.findIndex(x => x.id === this.state.id); this.project(projects[(i + delta + projects.length) % projects.length].id, this.state.tab); }
    toggle(k, id) { if (!['agenda', 'favorites'].includes(k) || !PP[id])
        return; let has = this.state[k].includes(id); this.setState({ [k]: has ? this.state[k].filter(x => x !== id) : this.state[k].concat(id) }, () => { this.save(); if (k === 'agenda')
        this.toast(has ? 'از فهرست جلسه برداشته شد.' : 'به فهرست جلسه اضافه شد.'); }); }
    compare(id) { let ids = this.state.compare; if (ids.includes(id))
        ids = ids.filter(x => x !== id);
    else {
        if (ids.length === 3) {
            this.toast('برای مقایسه حداکثر سه طرح انتخاب کنید.');
            return;
        }
        ids = ids.concat(id);
    } this.set({ compare: ids }, true); }
    reorder(i, delta) { let x = this.state.agenda.slice(), j = i + delta; if (j < 0 || j >= x.length)
        return; [x[i], x[j]] = [x[j], x[i]]; this.set({ agenda: x }, true); }
    decision(id, t) { if (!PP[id] || !own(DECISIONS, t))
        return; this.set({ decisions: { ...this.state.decisions, [id]: t } }, true); }
    note(id, t) { if (PP[id] && typeof t === 'string' && t.length <= 10000)
        this.set({ notes: { ...this.state.notes, [id]: t } }, true); }
    present(ids, index = 0) { let deck = Array.isArray(ids) ? ids : this.state.agenda.length ? this.state.agenda : projects.map(p => p.id); deck = [...new Set(deck)].filter(id => PP[id]); if (!deck.length)
        return; this.set({ presenting: true, deck, slide: Math.max(0, Math.min(index, deck.length - 1)), step: 0, presentMenu: false, modal: null, modalHistory: [], mobileNav: false }); }
    next(delta) { let n = this.state.slide * 6 + this.state.step + delta; if (n < 0)
        return; if (n >= this.state.deck.length * 6) {
        this.exit();
        this.go('agenda');
        this.toast('ارائه به پایان رسید؛ جمع‌بندی‌ها را مرور و خروجی بگیرید.');
        return;
    } this.set({ slide: Math.floor(n / 6), step: n % 6 }); }
    nextSlide(delta) { let n = this.state.slide + delta; if (n >= 0 && n < this.state.deck.length)
        this.set({ slide: n, step: 0, presentMenu: false }); }
    exit() { var _a; this.set({ presenting: false, presentMenu: false }); if (document.fullscreenElement)
        (_a = document.exitFullscreen) === null || _a === void 0 ? void 0 : _a.call(document).catch(() => { }); }
    fullscreen() { var _a, _b, _c; if (document.fullscreenElement)
        (_a = document.exitFullscreen) === null || _a === void 0 ? void 0 : _a.call(document).catch(() => { });
    else {
        let p = (_c = (_b = document.documentElement).requestFullscreen) === null || _c === void 0 ? void 0 : _c.call(_b);
        p === null || p === void 0 ? void 0 : p.catch(() => this.toast('مرورگر این محیط اجازه تمام‌صفحه نداد.'));
    } }
    modal(m) { this.setState(s => ({ modal: m, modalHistory: s.modal ? s.modalHistory.concat(s.modal).slice(-20) : [] })); if (m.type === 'document')
        this.loadLibrary(); }
    close() { this.set({ modal: null, modalHistory: [] }); }
    backModal() { let h = this.state.modalHistory.slice(); let m = h.pop(); this.set({ modal: m || null, modalHistory: h }); }
    doc(path) { if (!path) {
        this.toast('برای این شناسه، مسیر سند در ثبت پیدا نشد.');
        return;
    } if (!DD[path]) {
        let matches = D.docs.filter(d => d.path.endsWith('/' + path.split('/').pop()));
        if (matches.length === 1)
            path = matches[0].path;
    } this.modal({ type: 'document', path }); }
    loadLibrary() { if (window.FAMILI_LIBRARY) {
        this.set({ libraryReady: true, libraryError: '' });
        return Promise.resolve();
    } let el = document.getElementById('famili-library'); if (el) {
        try {
            window.FAMILI_LIBRARY = JSON.parse(el.textContent);
            this.set({ libraryReady: true, libraryError: '' });
            return Promise.resolve();
        }
        catch (e) {
            this.set({ libraryError: 'داده کتابخانه داخل فایل قابل خواندن نیست.' });
            return Promise.resolve();
        }
    } if (this.promise)
        return this.promise; this.promise = new Promise(resolve => { let s = document.createElement('script'); s.src = 'library.js'; s.onload = () => { this.set({ libraryReady: !!window.FAMILI_LIBRARY, libraryError: window.FAMILI_LIBRARY ? '' : 'داده کتابخانه ناقص است.' }); resolve(); }; s.onerror = () => { this.promise = null; this.set({ libraryError: 'فایل library.js پیدا نشد؛ بسته را کامل استخراج کنید.' }); resolve(); }; document.head.appendChild(s); }); return this.promise; }
    exportSession() { let state = {}; SAVE.forEach(k => state[k] = this.state[k]); download('Famili-Board-Session-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify({ version: 1, kind: 'local-draft-not-approved-minutes', exportedAt: new Date().toISOString(), researchDate: D.date, state }, null, 2), 'application/json'); this.toast('خروجی پیش‌نویس جلسه آماده شد.'); }
    importSession(file) { if (!file)
        return; if (file.size > 2e6) {
        this.toast('فایل جلسه بیش از حد بزرگ است.');
        return;
    } let reader = new FileReader(); reader.onload = () => { try {
        let s = validate(JSON.parse(reader.result));
        this.setState({ ...s, view: 'agenda', modal: null, modalHistory: [], presenting: false }, () => { this.save(); this.sync(); this.toast('فهرست و یادداشت‌های جلسه وارد شد.'); });
    }
    catch (e) {
        this.toast('فایل جلسه معتبر نیست: ' + e.message);
    } }; reader.onerror = () => this.toast('خواندن فایل ممکن نشد.'); reader.readAsText(file); this.fileInput.value = ''; }
    toast(toast) { clearTimeout(this.toastTimer); this.setState({ toast }); this.toastTimer = setTimeout(() => this.setState({ toast: '' }), 4000); }
    keys(e) { if (this.state.modal || this.state.mobileNav)
        return; const input = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.modal({ type: 'search' });
        return;
    } if (input)
        return; if (e.key === ' ' && e.target.closest('button,a,summary'))
        return; if (e.key === '/') {
        e.preventDefault();
        this.modal({ type: 'search' });
    }
    else if (this.state.presenting) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.exit();
        }
        else if (['ArrowLeft', ' ', 'PageDown'].includes(e.key)) {
            e.preventDefault();
            this.next(1);
        }
        else if (['ArrowRight', 'PageUp'].includes(e.key)) {
            e.preventDefault();
            this.next(-1);
        }
        else if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            this.fullscreen();
        }
        else if (/^[1-6]$/.test(e.key)) {
            e.preventDefault();
            this.set({ step: Number(e.key) - 1 });
        }
        else if (e.key === 'Home') {
            e.preventDefault();
            this.set({ slide: 0, step: 0 });
        }
        else if (e.key === 'End') {
            e.preventDefault();
            this.set({ slide: this.state.deck.length - 1, step: 5 });
        }
    }
    else if (e.key === 'Escape')
        this.set({ mobileNav: false }); }
    render() { let s = this.state; return React.createElement("div", { className: cx('app', s.mobileNav && 'nav-open') },
        React.createElement("input", { className: "sr-only", tabIndex: "-1", type: "file", "aria-label": "\u0641\u0627\u06CC\u0644 \u062C\u0644\u0633\u0647", accept: ".json,application/json", ref: el => this.fileInput = el, onChange: e => this.importSession(e.target.files[0]) }),
        s.presenting ? React.createElement(Presentation, { a: this }) : React.createElement("div", { className: "shell" },
            React.createElement("a", { className: "skip", href: "#content" }, "\u0631\u0641\u062A\u0646 \u0628\u0647 \u0645\u062D\u062A\u0648\u0627\u06CC \u0627\u0635\u0644\u06CC"),
            React.createElement("div", { className: "main-shell" },
                React.createElement(BrandNavigation, { a: this }),
                React.createElement("main", { id: "content", tabIndex: "-1" }, s.view === 'home' ? React.createElement(Home, { a: this }) : s.view === 'projects' ? React.createElement(Catalogue, { a: this }) : s.view === 'detail' ? React.createElement(Detail, { a: this }) : s.view === 'atlas' ? React.createElement(Atlas, { a: this }) : s.view === 'prices' ? React.createElement(Prices, { a: this }) : s.view === 'library' ? React.createElement(Library, { a: this }) : s.view === 'agenda' ? React.createElement(Agenda, { a: this }) : s.view === 'concepts' ? React.createElement(Concepts, { a: this }) : React.createElement(Compare, { a: this })),
                React.createElement("footer", { className: "app-footer" },
                    React.createElement("span", null, "\u0641\u0627\u0645\u06CC\u0644\u06CC \u0641\u0631\u062F\u0627 \u00B7 \u0627\u0632 \u062A\u062C\u0631\u0628\u0647 \u0648 \u0634\u0648\u0627\u0647\u062F\u060C \u062A\u0627 \u062A\u0635\u0645\u06CC\u0645"),
                    React.createElement("span", null, "\u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u0647\u0627 \u0648 \u0642\u06CC\u0645\u062A\u200C\u0647\u0627 \u0628\u0627 \u062D\u062F\u0648\u062F \u0627\u062A\u06A9\u0627\u06CC \u0645\u0646\u0628\u0639 \u062D\u0641\u0638 \u0634\u062F\u0647\u200C\u0627\u0646\u062F."))),
            s.compare.length > 0 && s.view === 'projects' && React.createElement("div", { className: "compare-float" },
                React.createElement(I, { name: "compare" }),
                React.createElement("span", null,
                    fa(s.compare.length),
                    " \u0637\u0631\u062D \u0628\u0631\u0627\u06CC \u0645\u0642\u0627\u06CC\u0633\u0647"),
                React.createElement(Btn, { small: true, onClick: () => this.go('compare') }, "\u0645\u0642\u0627\u06CC\u0633\u0647"),
                React.createElement(IB, { name: "close", label: "\u067E\u0627\u06A9\u200C\u06A9\u0631\u062F\u0646 \u0645\u0642\u0627\u06CC\u0633\u0647", onClick: () => this.set({ compare: [] }, true) }))),
        s.mobileNav && !s.presenting && React.createElement(ChapterMenu, { a: this }),
        React.createElement(Modals, { a: this }),
        React.createElement("div", { className: cx('toast', s.toast && 'visible'), role: "status", "aria-live": "polite" },
            React.createElement(I, { name: "check", size: 18 }),
            s.toast)); }
}
class Boundary extends React.Component {
    constructor(p) { super(p); this.state = { error: null }; }
    componentDidCatch(e) { console.error(e); this.setState({ error: e }); }
    render() { return this.state.error ? React.createElement("div", { className: "boot-error" },
        React.createElement("h1", null, "\u0628\u0627\u0632\u06A9\u0631\u062F\u0646 \u0627\u06CC\u0646 \u0628\u062E\u0634 \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F."),
        React.createElement("p", null, "\u0627\u0635\u0644 \u067E\u0698\u0648\u0647\u0634 \u062F\u0631 \u067E\u0648\u0634\u0647 knowledge \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0627\u0633\u062A."),
        React.createElement("button", { onClick: () => { location.hash = ''; location.reload(); } }, "\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0646\u0645\u0627\u06CC \u0627\u0635\u0644\u06CC"),
        React.createElement("pre", null, String(this.state.error))) : this.props.children; }
}
ReactDOM.render(React.createElement(Boundary, null,
    React.createElement(App, null)), document.getElementById('root'));

})();