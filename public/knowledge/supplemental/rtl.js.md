# کد مرجع rtl.js

> فقط متن منبع؛ اجرا نمی‌شود.

```javascript
// rtl.js — کتابخانه مشترک تولید اسناد Word فارسی راست‌به‌چپ (هماهنگ برای همه ماژول‌ها)
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
  TableOfContents, TabStopType, TabStopPosition
} = require("docx");
const fs = require("fs");

const FONT = "Tahoma";

// رنگ‌ها (پالت هماهنگ برای همه اسناد)
const C = {
  navy: "1F3864",
  blue: "2E5496",
  lightHeader: "D6E4F0",
  zebra: "F2F6FB",
  callout: "FFF7E0",
  calloutBorder: "E0A800",
  warn: "FCE4E4",
  warnBorder: "C00000",
  ok: "E6F4EA",
  okBorder: "2E7D32",
  grayLine: "BFBFBF",
  black: "000000",
  white: "FFFFFF",
  subtle: "595959",
};

const CONTENT_W = 9360; // US Letter منهای حاشیه ۱ اینچی

function run(text, opts = {}) {
  return new TextRun({
    text: String(text),
    font: FONT,
    rightToLeft: true,
    size: opts.size || 21,          // 10.5pt بدنه
    bold: !!opts.bold,
    italics: !!opts.italics,
    color: opts.color || C.black,
  });
}

// پاراگراف فارسی RTL
function P(text, opts = {}) {
  const children = Array.isArray(text)
    ? text
    : [run(text, opts)];
  return new Paragraph({
    bidirectional: true,
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { after: opts.after != null ? opts.after : 120, line: 300, before: opts.before || 0 },
    children,
  });
}

// عنوان‌ها
function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 160 },
    children: [new TextRun({ text, font: FONT, rightToLeft: true, bold: true, size: 32, color: C.navy })],
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: FONT, rightToLeft: true, bold: true, size: 27, color: C.blue })],
  });
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 180, after: 100 },
    children: [new TextRun({ text, font: FONT, rightToLeft: true, bold: true, size: 23, color: C.black })],
  });
}

// لیست‌ها (با numbering config؛ بدون بولت یونیکد دستی)
function bullet(text, level = 0, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    numbering: { reference: "rtl-bullets", level },
    spacing: { after: 60, line: 290 },
    children: Array.isArray(text) ? text : [run(text, opts)],
  });
}
function numItem(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    numbering: { reference: opts.ref || "rtl-numbers", level: 0 },
    spacing: { after: 60, line: 290 },
    children: Array.isArray(text) ? text : [run(text, opts)],
  });
}

// کادر برجسته (Callout)
function callout(text, kind = "info") {
  const map = {
    info: { fill: C.callout, border: C.calloutBorder },
    warn: { fill: C.warn, border: C.warnBorder },
    ok: { fill: C.ok, border: C.okBorder },
  };
  const m = map[kind] || map.info;
  const lines = Array.isArray(text) ? text : [text];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    visuallyRightToLeft: true,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            shading: { fill: m.fill, type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: m.border },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: m.border },
              left: { style: BorderStyle.SINGLE, size: 12, color: m.border },
              right: { style: BorderStyle.SINGLE, size: 12, color: m.border },
            },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: lines.map((ln, i) =>
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: i === lines.length - 1 ? 0 : 80, line: 290 },
                children: Array.isArray(ln) ? ln : [run(ln)],
              })
            ),
          }),
        ],
      }),
    ],
  });
}

// جدول RTL با ستون‌بندی و رنگ سرستون و راه‌راه
function table(headers, rows, colWidths, opts = {}) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const border = { style: BorderStyle.SINGLE, size: 1, color: C.grayLine };
  const borders = { top: border, bottom: border, left: border, right: border };
  const headerSize = opts.headerSize || 19;
  const cellSize = opts.cellSize || 18;

  function cell(content, w, isHeader, rowIdx) {
    const paras = (Array.isArray(content) ? content : [content]).map((c) =>
      new Paragraph({
        bidirectional: true,
        alignment: opts.center ? AlignmentType.CENTER : AlignmentType.RIGHT,
        spacing: { after: 0, line: 270 },
        children: [
          new TextRun({
            text: String(c),
            font: FONT,
            rightToLeft: true,
            bold: isHeader,
            size: isHeader ? headerSize : cellSize,
            color: isHeader ? C.white : C.black,
          }),
        ],
      })
    );
    return new TableCell({
      width: { size: w, type: WidthType.DXA },
      shading: {
        fill: isHeader ? C.navy : (rowIdx % 2 === 0 ? C.zebra : C.white),
        type: ShadingType.CLEAR,
      },
      verticalAlign: VerticalAlign.CENTER,
      borders,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: paras,
    });
  }

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, colWidths[i], true, 0)),
  });
  const bodyRows = rows.map((r, ri) =>
    new TableRow({ children: r.map((c, i) => cell(c, colWidths[i], false, ri)) })
  );

  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    visuallyRightToLeft: true,
    rows: [headerRow, ...bodyRows],
  });
}

function spacer(after = 80) {
  return new Paragraph({ spacing: { after }, children: [new TextRun("")] });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// خط جداکننده افقی (با border پایین پاراگراف، نه جدول)
function rule(color = C.blue) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color, space: 1 } },
    spacing: { after: 120 },
    children: [new TextRun("")],
  });
}

// صفحه جلد
function cover({ docCode, title, subtitle, moduleName, audience }) {
  const C2 = C;
  return [
    new Paragraph({ spacing: { before: 1600, after: 0 }, alignment: AlignmentType.CENTER, bidirectional: true,
      children: [new TextRun({ text: docCode, font: FONT, rightToLeft: true, bold: true, size: 24, color: C2.blue })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 80 }, bidirectional: true,
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C2.navy, space: 8 } },
      children: [new TextRun({ text: title, font: FONT, rightToLeft: true, bold: true, size: 46, color: C2.navy })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 40 }, bidirectional: true,
      children: [new TextRun({ text: subtitle, font: FONT, rightToLeft: true, size: 26, color: C2.subtle })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 40 }, bidirectional: true,
      children: [new TextRun({ text: moduleName, font: FONT, rightToLeft: true, bold: true, size: 24, color: C2.blue })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 }, bidirectional: true,
      children: [new TextRun({ text: "افق کوروش • اکوسیستم گلرنگ • اکالا • گلرنگ‌پخش", font: FONT, rightToLeft: true, size: 20, color: C2.black })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 700, after: 0 }, bidirectional: true,
      children: [new TextRun({ text: "مخاطب: " + audience, font: FONT, rightToLeft: true, size: 18, color: C2.subtle })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, bidirectional: true,
      children: [new TextRun({ text: "غیرمحرمانه | تاریخ مرجع: خرداد ۱۴۰۵ (می ۲۰۲۶) | واحد پول: ریال | نرخ مرجع ۱$=۱۴٬۰۰۰٬۰۰۰ ریال", font: FONT, rightToLeft: true, size: 16, color: C2.subtle })] }),
    pageBreak(),
  ];
}

// ساخت سند نهایی
function buildDoc({ docCode, title, children }) {
  const doc = new Document({
    styles: {
      default: { document: { run: { font: FONT, size: 21 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, font: FONT, color: C.navy },
          paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 27, bold: true, font: FONT, color: C.blue },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 23, bold: true, font: FONT, color: C.black },
          paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 } },
      ],
    },
    numbering: {
      config: [
        { reference: "rtl-bullets",
          levels: [
            { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.RIGHT,
              style: { paragraph: { indent: { right: 460, hanging: 260 } } } },
            { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.RIGHT,
              style: { paragraph: { indent: { right: 860, hanging: 260 } } } },
          ] },
        { reference: "rtl-numbers",
          levels: [
            { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.RIGHT,
              style: { paragraph: { indent: { right: 460, hanging: 300 } } } },
          ] },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({ children: [ new Paragraph({
          bidirectional: true, alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.grayLine, space: 4 } },
          children: [ new TextRun({ text: docCode + " — " + title, font: FONT, rightToLeft: true, size: 15, color: C.subtle }) ],
        }) ] }),
      },
      footers: {
        default: new Footer({ children: [ new Paragraph({
          bidirectional: true, alignment: AlignmentType.CENTER,
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: "مگاپروپوزال انبار و زنجیره تأمین هوشمند افق کوروش/گلرنگ  •  صفحه ", font: FONT, rightToLeft: true, size: 15, color: C.subtle }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 15, color: C.subtle }),
          ],
        }) ] }),
      },
      children,
    }],
  });
  return doc;
}

function save(doc, path) {
  return Packer.toBuffer(doc).then((buf) => fs.writeFileSync(path, buf));
}

function toc() {
  return new TableOfContents("فهرست مطالب", { hyperlink: true, headingStyleRange: "1-3" });
}

module.exports = {
  C, CONTENT_W, run, P, H1, H2, H3, bullet, numItem, callout, table,
  spacer, pageBreak, rule, cover, buildDoc, save, toc,
  AlignmentType,
};

```