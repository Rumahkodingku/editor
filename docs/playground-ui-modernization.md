# PLAN.md — Playground UI Modernization & Fumadocs Integration

## Project

**RumahKodingku Editor**

## Scope

Modernisasi UI `apps/playground` menggunakan Tailwind CSS v4, meningkatkan responsive behavior dan visual quality, mempertahankan seluruh functionality editor/scenario yang sudah ada, serta menghubungkan Fumadocs dengan Playground melalui CTA yang jelas dan deep-link scenario bila didukung oleh routing aktual repository.

---

# 1. Tujuan

Plan ini bertujuan untuk:

1. Memodernisasi UI Playground menjadi **Modern Developer Workbench**.
2. Menggunakan Tailwind CSS v4 secara konsisten di layer Playground.
3. Membuat Playground responsive pada desktop, tablet, dan mobile.
4. Mempertahankan seluruh fitur dan behavior editor yang sudah berjalan.
5. Mempertahankan public API dan architecture package editor.
6. Memperbaiki visual hierarchy, spacing, typography, panels, navigation, toolbar presentation, inspector, status, dan error states.
7. Menjadikan Playground sebagai interactive companion dari dokumentasi Fumadocs.
8. Menambahkan CTA dari Fumadocs menuju Playground.
9. Bila routing aktual mendukungnya, memungkinkan CTA dokumentasi membuka scenario Playground yang relevan secara langsung.
10. Menambahkan navigasi kembali dari Playground ke Fumadocs.
11. Melakukan regression testing dengan Playwright.
12. Melakukan exploratory visual validation dengan `agent-browser`.
13. Memastikan redesign tidak keluar dari konteks brand dan design system RumahKodingku Editor.

---

# 2. Prinsip Utama

Implementasi harus mengikuti prinsip berikut:

### 2.1 Functionality First

Visual redesign tidak boleh mengorbankan behavior editor.

### 2.2 Playground Is a Developer Workbench

Playground bukan dashboard admin dan bukan marketing landing page.

Karakter visual yang dituju:

```text
clean
technical
premium
developer-focused
dense but breathable
responsive
```

### 2.3 Public Package Boundary

Tailwind CSS hanya digunakan untuk aplikasi Playground dan tidak boleh menjadi dependency wajib published package.

Published packages tetap framework/UI-library agnostic sesuai architecture repository.

### 2.4 Source of Truth

Gunakan repository aktual sebagai source of truth untuk:

- public API;
- components;
- scenarios;
- routing;
- editor behavior;
- existing tests;
- package boundaries.

Jangan mengarang feature, API, package, scenario, atau behavior baru tanpa dasar implementasi aktual.

### 2.5 Existing Architecture First

Jangan melakukan rewrite besar terhadap architecture Playground apabila kebutuhan dapat diselesaikan dengan perubahan UI layer.

### 2.6 Documentation and Playground Are Connected

User journey yang dituju:

```text
Fumadocs
   ↓
Try in Playground
   ↓
Playground
   ↓
Documentation
```

---

# 3. Non-Goals

Task ini tidak mencakup:

- redesign `editor-core`;
- redesign `editor-react` hanya untuk kebutuhan visual Playground;
- perubahan public editor API;
- migrasi dari Tiptap;
- perubahan package architecture;
- penggantian Fumadocs;
- pembuatan backend baru;
- perubahan editor behavior yang tidak diperlukan;
- penggantian test framework;
- penambahan dependency besar tanpa kebutuhan;
- perubahan release/versioning infrastructure.

---

# 4. Current Baseline

Sebelum implementasi, audit harus dilakukan terhadap:

```text
apps/playground/
apps/playground/src/
apps/playground/src/components/
apps/playground/src/scenarios/
apps/playground/src/lib/
apps/playground/src/app.css
apps/playground/vite.config.ts
apps/playground/package.json

apps/fumadocs/

tests/browser/playground/
tests/browser/fumadocs/
playwright.config.ts
```

Repository saat ini sudah menggunakan Tailwind CSS v4 pada Playground.

Implementasi harus memanfaatkan setup Tailwind yang sudah tersedia daripada melakukan migrasi ulang.

---

# 5. Execution Workflow

Workflow wajib:

```text
Read repository rules
        ↓
Audit current Playground
        ↓
Audit Fumadocs integration
        ↓
Audit existing tests
        ↓
Identify ambiguity
        ↓
Ask user if needed
        ↓
Create implementation plan
        ↓
Approval
        ↓
Implement UI
        ↓
Implement Fumadocs integration
        ↓
Run repository checks
        ↓
Playwright
        ↓
agent-browser
        ↓
Fix issues
        ↓
Re-test
        ↓
Final QA
```

Jika terdapat ambiguity:

- jangan membuat asumsi pribadi;
- tanyakan kepada user;
- berikan rekomendasi terbaik;
- jelaskan trade-off secara singkat;
- tunggu keputusan jika keputusan tersebut materially affects architecture, routing, public behavior, atau UX.

---

# 6. Phase 1 — Audit & Baseline

## PLAY-01 — Read Repository Rules

Baca:

```text
AGENTS.md
ARCHITECTURE.md
DESIGN.md
taste-SKILL.md
```

Jika terdapat skill khusus pada:

```text
.agents/skills/
```

identifikasi skill yang relevan untuk:

- UI/UX;
- Tailwind;
- frontend;
- accessibility;
- responsive design;
- Playwright;
- browser testing.

### Acceptance Criteria

- Semua aturan repository dipahami.
- Skill relevan telah diidentifikasi.
- Tidak ada aturan architecture yang dilanggar.

---

## PLAY-02 — Audit Playground Structure

Audit seluruh:

```text
apps/playground/src/components/*
apps/playground/src/scenarios/*
apps/playground/src/lib/*
```

Petakan:

- shell;
- navigation;
- editor surface;
- panels;
- inspectors;
- scenario components;
- error handling;
- state handling.

### Acceptance Criteria

Terdapat mapping komponen UI dan behavior yang akan dipertahankan.

---

## PLAY-03 — Audit Existing Tailwind Setup

Periksa:

```text
apps/playground/package.json
apps/playground/vite.config.ts
apps/playground/src/app.css
```

Pastikan Tailwind v4 setup tetap digunakan.

### Acceptance Criteria

Tidak ada migrasi Tailwind yang tidak diperlukan.

---

## PLAY-04 — Audit All Playground Scenarios

Inventaris seluruh scenario aktual.

Kelompokkan berdasarkan fungsi aktual repository, misalnya:

```text
Editor
State
Content
Formatting
Toolbar
Links
Images
Upload
Extensions
Accessibility
```

Jangan membuat kategori yang tidak sesuai dengan scenario aktual.

---

## PLAY-05 — Audit Existing Playwright Coverage

Audit:

```text
tests/browser/playground/*
playwright.config.ts
```

Petakan test terhadap scenario dan behavior.

### Acceptance Criteria

Setiap perubahan UI yang dapat memengaruhi existing selectors atau interaction diketahui sebelum implementasi.

---

## PLAY-06 — Audit Fumadocs → Playground Entry Points

Audit:

```text
apps/fumadocs/
```

Cari:

- CTA existing;
- links menuju Playground;
- example pages;
- documentation pages yang relevan;
- routing;
- public URL Playground;
- environment-specific URL handling.

### Acceptance Criteria

Titik integrasi Fumadocs → Playground ditentukan berdasarkan implementasi aktual.

---

# 7. Phase 2 — Design System & Visual Foundation

## PLAY-07 — Define Playground Visual Direction

Gunakan:

**Modern Developer Workbench**

Playground harus terlihat seperti tool yang digunakan developer untuk mengeksplorasi editor.

---

## PLAY-08 — Define Visual Tokens

Standarisasi:

```text
background
surface
surface-muted
border
text
text-muted
accent
success
warning
error
radius
shadow
spacing
```

Gunakan token yang konsisten dengan design system repository.

---

## PLAY-09 — Define Typography Hierarchy

Tentukan hierarchy untuk:

```text
app title
scenario title
scenario description
section heading
panel heading
body
metadata
code
navigation
```

---

## PLAY-10 — Define Light/Dark Theme

Pastikan visual system mendukung:

```text
Light
Dark
```

dengan:

- contrast yang baik;
- surface hierarchy;
- border;
- active state;
- code surface;
- status states.

---

# 8. Phase 3 — App Shell & Navigation

## PLAY-11 — Redesign Header

Target:

```text
┌──────────────────────────────────────────────┐
│ Logo  RumahKodingku Editor Playground       │
│                                  Theme       │
└──────────────────────────────────────────────┘
```

Header harus:

- compact;
- modern;
- responsive;
- accessible.

---

## PLAY-12 — Redesign Sidebar

Target conceptual structure:

```text
PLAYGROUND

EDITOR
  Basic
  Controlled
  Uncontrolled

FEATURES
  Formatting
  Toolbar
  Links
  Images

ADVANCED
  Extensions
  Upload
  Security

STATES
  Read-only
  Disabled
  Labels
```

Kategori final harus mengikuti scenario aktual.

---

## PLAY-13 — Active Scenario State

Active item harus memiliki:

- clear visual state;
- accessible contrast;
- focus state;
- consistent accent;
- keyboard usability.

---

## PLAY-14 — Responsive Sidebar

Desktop:

```text
Persistent sidebar
```

Mobile:

```text
Drawer / sheet
```

Sidebar tidak boleh membuat horizontal overflow.

---

## PLAY-15 — Scenario Search/Filter

Audit jumlah scenario terlebih dahulu.

Jika jumlah scenario cukup besar untuk membutuhkan discovery mechanism, implementasikan search/filter.

Jika belum diperlukan, jangan menambah complexity hanya demi feature.

---

# 9. Phase 4 — Scenario UI

## PLAY-16 — Redesign Scenario Header

Setiap scenario memiliki:

```text
Title
Description
Optional contextual action
```

Hierarchy harus konsisten.

---

## PLAY-17 — Standardize Scenario Container

Gunakan layout yang konsisten:

```text
Scenario header
        ↓
Main editor/demo
        ↓
Inspectors/output
```

---

## PLAY-18 — Standardize Panel Primitive

Gunakan `Panel` sebagai primitive visual untuk:

- JSON;
- HTML;
- state;
- toolbar;
- inspectors;
- output.

---

## PLAY-19 — Redesign Editor Surface

Editor harus menjadi visual focal point.

Gunakan:

- clean surface;
- border;
- radius;
- subtle shadow;
- integrated toolbar presentation;
- readable content width.

---

## PLAY-20 — Toolbar Presentation

Redesign visual toolbar tanpa mengubah editor command implementation.

Pertahankan:

- formatting;
- links;
- image;
- custom toolbar behavior;
- keyboard interaction.

---

## PLAY-21 — Inspector Layout

Desktop:

```text
Editor
   +
Inspector
   +
Output
```

Mobile:

```text
Editor
↓
Inspector
↓
Output
```

---

# 10. Phase 5 — Output & Status UX

## PLAY-22 — JSON Inspector

Modernisasi:

- header;
- copy;
- code surface;
- overflow;
- responsive behavior.

---

## PLAY-23 — HTML Inspector

Gunakan visual pattern yang konsisten dengan JSON inspector.

---

## PLAY-24 — State Inspector

Gunakan hierarchy:

```text
Property
Value
Status
```

---

## PLAY-25 — Error State

Error UI harus menyediakan:

```text
Icon
Title
Description
Recovery action
```

Tetap mempertahankan debugging information yang dibutuhkan developer.

---

## PLAY-26 — Upload States

Image upload harus memiliki visual state:

```text
Idle
Uploading
Progress
Success
Error
```

Jangan mengubah upload contract hanya untuk kebutuhan visual.

---

## PLAY-27 — Action Feedback

Action seperti:

```text
Copy
Reset
Open
```

harus memberikan feedback visual yang konsisten.

---

# 11. Phase 6 — Responsive & Accessibility

## PLAY-28 — Desktop Validation

Target viewport:

```text
1440
1280
1024
```

Validasi:

- layout;
- sidebar;
- editor;
- inspectors;
- toolbar;
- output.

---

## PLAY-29 — Tablet Validation

Target:

```text
768
834
```

Pastikan:

- no horizontal overflow;
- readable content;
- controls remain accessible.

---

## PLAY-30 — Mobile Validation

Target:

```text
375
390
412
```

Validasi:

- sidebar drawer;
- editor;
- toolbar;
- panels;
- buttons;
- code output;
- long content.

---

## PLAY-31 — Touch Targets

Pastikan interactive controls nyaman digunakan pada touch device.

---

## PLAY-32 — Accessibility Semantics

Pertahankan:

- ARIA;
- roles;
- labels;
- keyboard navigation;
- focus management.

---

## PLAY-33 — Keyboard Validation

Validasi:

```text
Tab
Shift + Tab
Enter
Space
Arrow keys
Escape
```

untuk UI yang relevan.

---

## PLAY-34 — Contrast Validation

Validasi:

- light;
- dark;
- active;
- hover;
- focus;
- disabled;
- error;
- success.

---

# 12. Phase 7 — Fumadocs ↔ Playground Integration

## PLAY-35 — Define Playground CTA

Gunakan label utama:

**Try in Playground**

Alternatif hanya digunakan jika sesuai dengan existing content context.

---

## PLAY-36 — Add CTA to Introduction

Pada Fumadocs Introduction, CTA harus mengarahkan user ke Playground.

Contoh:

```text
[Try in Playground]
```

CTA tidak boleh mengganggu primary documentation actions.

---

## PLAY-37 — Identify Relevant Documentation Pages

Audit halaman yang memang membutuhkan CTA Playground.

Prioritas:

```text
Introduction
Quick Start
Features
Guides
Examples
```

Jangan menambahkan CTA secara massal tanpa alasan UX.

---

## PLAY-38 — Feature-specific Playground Links

Jika routing Playground mendukung deep linking, dokumentasi feature tertentu dapat membuka scenario yang relevan.

Contoh konseptual:

```text
Controlled Mode
      ↓
Try in Playground
      ↓
Controlled scenario
```

Jangan mengasumsikan format query/path sebelum memeriksa routing aktual.

---

## PLAY-39 — Define Scenario Deep-link Contract

Audit mekanisme scenario navigation saat ini.

Jika sudah ada:

- gunakan mekanisme tersebut.

Jika belum ada:

- desain deep-link minimal;
- pastikan backward compatible;
- jangan membuat routing system baru yang tidak diperlukan.

---

## PLAY-40 — Preserve Default Playground Entry

Direct Playground URL harus tetap membuka default scenario.

Deep-link merupakan enhancement, bukan dependency.

---

## PLAY-41 — Add Documentation Link to Playground Header

Playground header harus menyediakan navigasi kembali:

```text
[Documentation]
```

User dapat berpindah:

```text
Fumadocs
→ Playground
→ Fumadocs
```

---

## PLAY-42 — Responsive CTA

Fumadocs CTA dan Playground documentation link harus usable pada:

- desktop;
- tablet;
- mobile.

---

# 13. Phase 8 — Functionality Regression

## PLAY-43 — Preserve Editor Logic

Jangan memindahkan editor logic ke UI components hanya demi redesign.

---

## PLAY-44 — Preserve Public Package Usage

Playground tetap menggunakan package public yang benar:

```text
@rumahkodingku/editor-core
@rumahkodingku/editor-react
```

sesuai implementation aktual.

---

## PLAY-45 — Validate Basic Editor

Test:

- typing;
- selection;
- formatting;
- undo/redo;
- content rendering.

---

## PLAY-46 — Validate Controlled/Uncontrolled

Test:

- controlled;
- uncontrolled;
- external value updates;
- onChange behavior.

---

## PLAY-47 — Validate Read-only/Disabled

Test:

```text
Read-only
Disabled
```

dan pastikan perbedaan behavior tetap benar.

---

## PLAY-48 — Validate Toolbar

Test seluruh toolbar functionality yang digunakan oleh Playground.

---

## PLAY-49 — Validate Links

Test:

- link insertion;
- editing;
- security behavior;
- relevant validation.

---

## PLAY-50 — Validate Images

Test:

- image rendering;
- image controls;
- upload;
- upload progress;
- upload error.

---

## PLAY-51 — Validate Custom Extensions

Pastikan scenario custom extensions tetap bekerja.

---

## PLAY-52 — Validate Labels

Pastikan custom labels scenario tetap berjalan.

---

# 14. Phase 9 — Playwright

## PLAY-53 — Preserve Existing Tests

Existing tests harus tetap pass.

Jangan melemahkan assertion hanya agar UI redesign pass.

---

## PLAY-54 — Update Stable Selectors

Jika UI changes memerlukan perubahan selector:

- gunakan semantic selectors jika memungkinkan;
- hindari selector berbasis CSS visual;
- gunakan `data-testid` hanya jika memang diperlukan.

---

## PLAY-55 — Playground Smoke Test

Validasi:

```text
Playground loads
Scenario navigation works
Editor renders
No critical console errors
```

---

## PLAY-56 — Scenario Regression Tests

Test representative scenarios dari setiap kategori.

Minimal:

```text
Basic
Controlled
Uncontrolled
Toolbar
Custom Extension
Image Upload
Upload Error
Link Security
Read-only
Disabled
Labels
```

Gunakan scenario aktual repository sebagai source of truth.

---

## PLAY-57 — Responsive Playwright

Tambahkan coverage untuk:

```text
Desktop
Tablet
Mobile
```

---

## PLAY-58 — Fumadocs → Playground Test

Test:

```text
Open Fumadocs
↓
Click Try in Playground
↓
Playground loads
↓
Expected scenario appears
↓
Editor works
```

---

## PLAY-59 — Scenario Deep-link Test

Jika deep-link diterapkan:

```text
Documentation feature
↓
Try in Playground
↓
Correct scenario
```

---

## PLAY-60 — Playground → Fumadocs Test

Test:

```text
Playground
↓
Documentation
↓
Documentation loads correctly
```

---

# 15. Phase 10 — agent-browser Validation

## PLAY-61 — Desktop Exploratory Test

Gunakan `agent-browser` untuk mengevaluasi:

- hierarchy;
- spacing;
- typography;
- component balance;
- navigation;
- editor focus;
- output density.

---

## PLAY-62 — Mobile Exploratory Test

Periksa:

- sidebar;
- toolbar;
- editor;
- panels;
- buttons;
- scrolling;
- overflow.

---

## PLAY-63 — Scenario Exploratory Test

Jelajahi scenario representative dari:

```text
Editor
Features
Advanced
States
```

---

## PLAY-64 — Fumadocs Integration Exploratory Test

Validasi user journey:

```text
Documentation
→ Try in Playground
→ Playground
→ Documentation
```

---

## PLAY-65 — Visual Context Audit

Pastikan UI tidak berubah menjadi:

- generic dashboard;
- unrelated SaaS UI;
- overly decorative marketing UI;
- inconsistent component collection.

UI harus tetap terlihat seperti **professional developer workbench**.

---

# 16. Phase 11 — Visual Polish

## PLAY-66 — Spacing Audit

Periksa consistency:

```text
4
8
12
16
24
32
48
64
```

sesuai token final design system.

---

## PLAY-67 — Typography Audit

Pastikan:

- heading hierarchy;
- line height;
- readable body;
- code typography;
- muted text.

---

## PLAY-68 — Border & Radius Audit

Semua panels, cards, controls, dan navigation harus mengikuti token yang sama.

---

## PLAY-69 — Color Audit

Validasi seluruh color usage terhadap `DESIGN.md`.

---

## PLAY-70 — Interaction Polish

Audit:

```text
hover
active
focus
disabled
loading
success
error
```

---

# 17. Phase 12 — Final QA

## PLAY-71 — Repository Checks

Jalankan command yang ditentukan `AGENTS.md` dan repository.

Minimal check yang relevan:

```bash
pnpm run check
pnpm run check-types
pnpm run test
```

Gunakan command aktual repository apabila berbeda.

---

## PLAY-72 — Playground Build

Build production Playground menggunakan command yang benar dari repository.

---

## PLAY-73 — Fumadocs Build

Pastikan integrasi CTA tidak merusak build documentation.

---

## PLAY-74 — Playwright Full Run

Run seluruh browser suite yang relevan.

---

## PLAY-75 — Accessibility Run

Run accessibility test untuk Playground dan Fumadocs yang relevan.

---

## PLAY-76 — agent-browser Final Pass

Lakukan final visual review setelah semua fix.

---

## PLAY-77 — Console Error Audit

Pastikan tidak ada critical:

- JavaScript error;
- React error;
- routing error;
- hydration error;
- failed critical request.

---

## PLAY-78 — Diff Review

Review seluruh git diff.

Pastikan:

- perubahan relevan;
- tidak ada debug code;
- tidak ada unused dependency;
- tidak ada temporary styling;
- tidak ada generated artifacts yang tidak diperlukan.

---

# 18. Expected UI Architecture

Target conceptual structure:

```text
┌────────────────────────────────────────────────────────────┐
│ Logo  RumahKodingku Editor Playground        Theme  Docs │
├────────────────┬───────────────────────────────────────────┤
│                │                                           │
│ PLAYGROUND     │ Scenario Title                            │
│                │ Description                               │
│ EDITOR         │                                           │
│  Basic         │ ┌───────────────────────────────────────┐ │
│  Controlled    │ │                                       │ │
│  Uncontrolled  │ │ Editor                                │ │
│                │ │                                       │ │
│ FEATURES       │ │ Toolbar                               │ │
│  Formatting    │ │                                       │ │
│  Toolbar       │ │ Rich content...                       │ │
│  Links         │ │                                       │ │
│  Images        │ └───────────────────────────────────────┘ │
│                │                                           │
│ ADVANCED       │ ┌───────────────────────────────────────┐ │
│  Extensions    │ │ JSON Output                 [Copy]     │ │
│  Upload        │ │ { ... }                               │ │
│  Security      │ └───────────────────────────────────────┘ │
│                │                                           │
└────────────────┴───────────────────────────────────────────┘
```

Mobile:

```text
┌────────────────────────────────┐
│ ☰  RumahKodingku Editor    ◐  │
├────────────────────────────────┤
│                                │
│ Controlled Editor              │
│ Manage editor content...       │
│                                │
│ ┌────────────────────────────┐ │
│ │ Editor                     │ │
│ │                            │ │
│ └────────────────────────────┘ │
│                                │
│ JSON Output              Copy  │
│ ┌────────────────────────────┐ │
│ │ { ... }                    │ │
│ └────────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

---

# 19. Fumadocs Integration UX

Target journey:

```text
┌───────────────────────┐
│ Fumadocs              │
│                       │
│ Controlled Mode       │
│                       │
│ [Try in Playground]   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Playground            │
│                       │
│ Controlled Editor     │
│                       │
│ Editor                │
│ JSON Output           │
│                       │
│ [Documentation]       │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Fumadocs              │
└───────────────────────┘
```

---

# 20. Testing Matrix

| Area                | Desktop | Tablet | Mobile | Playwright | agent-browser |
| ------------------- | ------: | -----: | -----: | ---------: | ------------: |
| App shell           |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Sidebar             |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Scenario navigation |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Editor              |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Toolbar             |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Inspector           |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| JSON output         |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| HTML output         |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Upload              |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Error state         |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Dark mode           |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Accessibility       |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Fumadocs CTA        |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |
| Deep-link           |       ✓ |      ✓ |      ✓ |          ✓ |             ✓ |

---

# 21. Acceptance Criteria

## UI

- [ ] Playground memiliki visual identity yang modern.
- [ ] Playground terlihat seperti developer workbench.
- [ ] Tailwind CSS v4 digunakan secara konsisten.
- [ ] Tidak terdapat styling inconsistency yang signifikan.
- [ ] Light mode terlihat baik.
- [ ] Dark mode terlihat baik.

## Responsive

- [ ] Desktop layout berfungsi.
- [ ] Tablet layout berfungsi.
- [ ] Mobile layout berfungsi.
- [ ] Tidak ada horizontal page overflow.
- [ ] Sidebar mobile usable.
- [ ] Toolbar mobile usable.
- [ ] Inspector mobile usable.

## Functionality

- [ ] Basic editor berfungsi.
- [ ] Controlled editor berfungsi.
- [ ] Uncontrolled editor berfungsi.
- [ ] Read-only berfungsi.
- [ ] Disabled berfungsi.
- [ ] Formatting berfungsi.
- [ ] Toolbar berfungsi.
- [ ] Link functionality berfungsi.
- [ ] Image functionality berfungsi.
- [ ] Image upload berfungsi.
- [ ] Upload error state berfungsi.
- [ ] Custom extensions berfungsi.
- [ ] Labels berfungsi.
- [ ] Existing scenario behavior tidak mengalami regression.

## Fumadocs Integration

- [ ] Introduction memiliki CTA Playground.
- [ ] Relevant documentation pages memiliki CTA jika memang diperlukan.
- [ ] CTA menggunakan label yang konsisten.
- [ ] CTA membuka Playground dengan benar.
- [ ] Feature-specific CTA membuka scenario yang benar jika deep-link diterapkan.
- [ ] Playground menyediakan link kembali ke Documentation.
- [ ] Flow Documentation → Playground → Documentation berfungsi.

## Testing

- [ ] Repository checks pass.
- [ ] Typecheck pass.
- [ ] Unit/integration tests pass.
- [ ] Playground production build pass.
- [ ] Fumadocs build pass.
- [ ] Playwright pass.
- [ ] Accessibility tests pass.
- [ ] agent-browser validation selesai.
- [ ] Tidak terdapat critical browser console error.

---

# 22. Definition of Done

Task dianggap selesai apabila:

1. Playground memiliki UI modern yang konsisten dengan design system.
2. Tailwind CSS v4 digunakan sebagai styling foundation.
3. Desktop, tablet, dan mobile telah divalidasi.
4. Semua existing editor scenarios tetap berfungsi.
5. Tidak ada regression pada editor behavior.
6. Fumadocs dapat mengarahkan user ke Playground.
7. Playground dapat mengarahkan user kembali ke Fumadocs.
8. Deep-link scenario digunakan apabila mekanisme routing aktual mendukungnya.
9. Playwright telah dijalankan.
10. `agent-browser` telah digunakan untuk exploratory visual validation.
11. Semua masalah penting yang ditemukan telah diperbaiki.
12. Test dijalankan ulang setelah perbaikan.
13. Tidak ada debug code atau temporary workaround yang tertinggal.
14. Tidak ada perubahan yang melanggar package boundary.
15. Final UI tetap berada dalam konteks **RumahKodingku Editor**.

---

# 23. Final Quality Gate

Sebelum menyatakan selesai, agent wajib menjawab:

### Design

- Apakah UI sesuai `DESIGN.md`?
- Apakah visual hierarchy konsisten?
- Apakah Playground terlihat seperti developer workbench?

### Functionality

- Apakah seluruh scenario existing masih bekerja?
- Apakah editor behavior tidak berubah secara tidak sengaja?

### Responsive

- Apakah desktop, tablet, dan mobile sudah divalidasi?
- Apakah terdapat horizontal overflow?

### Accessibility

- Apakah keyboard navigation tetap bekerja?
- Apakah focus state terlihat?
- Apakah contrast memenuhi kebutuhan?

### Integration

- Apakah Fumadocs → Playground bekerja?
- Apakah Playground → Fumadocs bekerja?
- Apakah deep-link scenario bekerja jika diterapkan?

### Testing

- Apakah Playwright pass?
- Apakah accessibility test pass?
- Apakah agent-browser validation selesai?
- Apakah seluruh issue hasil validation sudah diperbaiki?

Jika salah satu jawaban penting adalah **tidak**, task belum dianggap selesai.

---

# 24. Final Principle

Tujuan akhir bukan sekadar:

> "Membuat Playground terlihat lebih bagus."

Tujuan sebenarnya adalah membangun pengalaman:

> **Read → Understand → Try → Experiment → Return to Documentation**

di mana Fumadocs menjadi sumber pengetahuan dan Playground menjadi lingkungan interaktif untuk mencoba RumahKodingku Editor.

Playground harus tetap menjadi:

**Professional Developer Workbench untuk RumahKodingku Editor.**
