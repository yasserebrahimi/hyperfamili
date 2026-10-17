---
id: HF-00-GOVERNANCE-INPUT-MAP
title: نقشه دقیق ورودی به خروجی؛ قابل خواندن توسط ابزار
type: register
language: fa
compiled_on: '2026-10-07'
research_as_of: '2026-10-07'
status: compilation
source_refs: []
provenance: تنظیم و نمایه‌سازی محتوای موجود؛ پژوهش خارجی تازه انجام نشده
rag_include: false
---

# نقشه دقیق ورودی به خروجی؛ قابل خواندن توسط ابزار

هر ردیف JSON زیر، یک ورودی موجود و روش بازسازی آن از Markdown را مشخص می‌کند. مقدار SHA-256 متعلق به بایت‌های ورودی است، نه نام فایل. آرشیو شرکتی قدیمی جزو این فهرست نیست چون دریافت نشده است.

```json
[
  {
    "input": "HyperFamili_Innovation_Research_FA.md",
    "output": "90-archive/original-markdown/HyperFamili_Innovation_Research_FA.md",
    "method": "identical_bytes",
    "sha256": "f9234bb4f4bbc139af9fac35c2d102e09649c145ec4e95c4923d652309a5330f",
    "bytes": 99406
  },
  {
    "input": "Media_Links_and_Access_FA.md",
    "output": "90-archive/original-markdown/Media_Links_and_Access_FA.md",
    "method": "identical_bytes",
    "sha256": "c8d469252227a41586481bcaa38b42d37b2be1adafe18aaf78c88eaaef2795c7",
    "bytes": 2710
  },
  {
    "input": "README_FA.md",
    "output": "90-archive/original-markdown/README_FA.md",
    "method": "utf8_fence",
    "sha256": "48ae4af4ef3fb3e4b38e86996c50e009cf4754ebd415108bc33086f41abcb90d",
    "bytes": 1281
  },
  {
    "input": "research_register.json",
    "output": "90-archive/structured-originals/research_register.md",
    "method": "utf8_fence",
    "sha256": "9e8901de4b8382f84af1a0510b6d7fa4b7c259996be84e61b53f29745f1eed41",
    "bytes": 71265
  },
  {
    "input": "quality_checks.json",
    "output": "90-archive/structured-originals/quality_checks.md",
    "method": "utf8_fence",
    "sha256": "f389e7a43f24e6c528b8221d6488e98887bb1bee070c6fef19d91e54551ae015",
    "bytes": 765
  },
  {
    "input": "HyperFamili_Innovation_Research_FA.html",
    "output": "90-archive/html-original.md",
    "method": "utf8_fence",
    "sha256": "291f3b28bc4b353a3b762080382c2db6b58dc1e9751df175a34145a6e5dc5cba",
    "bytes": 110632
  },
  {
    "input": "HyperFamili_Board_Brief_FA.pdf",
    "output": "90-archive/pdf-original-payload.md",
    "method": "base64_fence",
    "sha256": "28ea2255992a8207a00ab3e6eb7fb6fd475cd943f7c55479520a42d91017c8f3",
    "bytes": 55458
  },
  {
    "input": "conversation/innovation-response.md",
    "output": "90-archive/conversation/innovation-response-original.md",
    "method": "utf8_fence",
    "sha256": "a2c45cfd7c3a0867a5199fa4f93d5a3c02485a9b56ac8f24a56376bb5eff151f",
    "bytes": 35760
  },
  {
    "input": "conversation/company-response.md",
    "output": "90-archive/conversation/company-response-original.md",
    "method": "utf8_fence",
    "sha256": "0d89bf3d891691658bb208db1e8103fbf4b31190bb2b121131348760ae2794e8",
    "bytes": 13963
  },
  {
    "input": "research-brief/HyperFamili_Deep_Research_Mega_Prompt_FA(1).md",
    "output": "90-archive/research-brief-original.md",
    "method": "identical_bytes",
    "sha256": "b107f6a0eef5f6ed454ef88237cf512c56ea2fb9dc8ada8c5f5dcfc2c2ba7dcf",
    "bytes": 50356
  }
]
```
