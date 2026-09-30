# Phase 00 — Repository Foundation & Agent Readiness

> **Status:** In Progress  
> **Roadmap:** RumahKodingku Editor  
> **Phase:** 00 of 09  
> **Depends on:** Repository scaffold only  
> **Blocks:** Phase 01 — Build & Package Infrastructure

## 1. Objective

Menjadikan repository `Rumahkodingku/editor` sebagai foundation yang bersih, konsisten, terdokumentasi, dan siap menjadi basis implementasi package editor.

Phase ini **belum mengimplementasikan editor**. Tidak ada pekerjaan Tiptap, `editor-core`, `editor-react`, tsdown, atau fitur editor yang boleh masuk ke phase ini kecuali diperlukan untuk verification.

Target akhir:

- repository structure konsisten dengan `ARCHITECTURE.md`;
- dokumentasi utama tersedia dan saling konsisten;
- scaffold Better-T-Stack yang sudah tidak relevan dibersihkan;
- package manager dan runtime baseline jelas;
- script root dapat dipercaya;
- Fumadocs scaffold jelas sebagai documentation app;
- AI agent rules dan repo-local skills tetap usable;
- tidak ada konfigurasi legacy yang diam-diam memengaruhi implementasi phase berikutnya.

## 2. Source of Truth

Urutan otoritas untuk keputusan Phase 00:

1. `ARCHITECTURE.md` — technical architecture dan constraints.
2. `PRD.md` — product requirements dan scope.
3. `AGENTS.md` — operational rules untuk AI agents.
4. Dokumen phase ini — execution plan Phase 00.
5. Existing package/config files — factual current state repository.

Jangan menganggap target structure di `ARCHITECTURE.md` sudah ada di codebase. Bedakan **current state** dan **target state**.

## 3. Current Repository State

Repository saat review Phase 00 memiliki:

```text
editor/
├── .agents/skills/
├── .commandcode/taste/
├── .husky/
├── apps/
│   └── fumadocs/
├── docs/
│   └── roadmap/
│       └── README.md
├── packages/
│   └── config/
├── AGENTS.md
├── ARCHITECTURE.md
├── PRD.md
├── README.md
├── bts.jsonc
├── biome.json
├── bunfig.toml
├── commitlint.config.mjs
├── lint-staged.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── skills-lock.json
├── tsconfig.json
└── turbo.json
```

Current implementation packages:

- `packages/config` — internal shared TypeScript configuration.
- `apps/fumadocs` — Next.js + Fumadocs documentation application.

Belum tersedia:

- `packages/editor-core`;
- `packages/editor-react`;
- `apps/playground`;
- `docs/adr/`;
- `LICENSE`;
- `.changeset/`;
- test infrastructure;
- editor implementation.

## 4. Repository Findings

### 4.1 README root masih merupakan Better-T-Stack scaffold

Root `README.md` masih menjelaskan project sebagai Better-T-Stack template dan memuat instruksi Varlock, environment schema, serta asumsi yang tidak sesuai dengan repository sekarang.

Beberapa detail yang perlu disinkronkan:

- project harus diperkenalkan sebagai RumahKodingku Editor;
- jangan mendokumentasikan `env:generate`, `.env.schema`, atau generated `src/env.ts` sebagai workflow repository;
- Fumadocs berjalan pada port `4000`, bukan port `3000`;
- dokumentasi harus menunjuk ke `PRD.md`, `ARCHITECTURE.md`, `AGENTS.md`, dan roadmap.

### 4.2 Root package masih membawa dependency scaffold

Root `package.json` saat ini berisi `zod` sebagai dependency dan `varlock` sebagai devDependency.

Phase 00 harus menentukan apakah keduanya benar-benar diperlukan.

Kriteria:

- `zod` hanya dipertahankan jika ada consumer internal repository yang benar-benar membutuhkannya;
- `varlock` dihapus jika tidak digunakan oleh aplikasi atau tooling setelah audit;
- dependency jangan dipertahankan hanya karena berasal dari scaffold.

### 4.3 Varlock masih bocor ke Turbo configuration

`turbo.json` masih memiliki:

- `_VARLOCK_ENV_KEY` dalam `globalEnv`;
- environment-related global dependencies melalui `.env*`.

Phase 00 harus menghapus konfigurasi khusus Varlock bila audit memastikan tidak ada consumer aktif.

Jangan menambah kembali environment system hanya karena Better-T-Stack pernah menggunakannya.

### 4.4 bunfig.toml masih ada

`bunfig.toml` hanya berisi:

```toml
env = false
```

Architecture sudah memutuskan pnpm sebagai package manager resmi dan Bun tidak diperlukan untuk toolchain.

Phase 00 harus:

- menghapus `bunfig.toml` jika tidak ada dependency yang membutuhkannya; atau
- mendokumentasikan alasan teknis yang jelas apabila ternyata masih diperlukan.

Default outcome yang diharapkan: **hapus**.

### 4.5 Better-T-Stack metadata masih ada

`bts.jsonc` adalah metadata scaffold dan bukan bagian dari runtime editor.

Jangan menghapus file ini secara otomatis jika command Better-T-Stack masih dibutuhkan untuk maintenance scaffold. Namun Phase 00 harus memastikan file tersebut tidak lagi dianggap sebagai architecture/product source of truth.

Rule:

- `ARCHITECTURE.md` dan `PRD.md` tetap menjadi sumber keputusan;
- `bts.jsonc` hanya boleh dipertahankan sebagai metadata tooling jika memang diperlukan;
- jangan memperluas dependency Better-T-Stack setelah phase ini.

### 4.6 Fumadocs masih default scaffold

`apps/fumadocs` masih berisi konten placeholder seperti:

- `Hello World`;
- `Components`;
- metadata `My App`;
- konfigurasi GitHub `fuma-nama/fumadocs`;
- README default Create Fumadocs.

Phase 00 tidak perlu membangun dokumentasi produk secara lengkap.

Namun foundation harus memastikan:

- app tetap buildable;
- metadata tidak lagi menyesatkan;
- nama aplikasi dan repository identity dapat disinkronkan;
- placeholder content yang jelas-jelas hanya scaffold dapat dibersihkan atau ditandai.

Konten produk lengkap dikerjakan pada Phase 08.

### 4.7 Fumadocs memiliki dependency versioning yang terpisah

`apps/fumadocs/package.json` memakai Next 16, React 19, TypeScript 7, Fumadocs 16.x, Tailwind 4, dan konfigurasi app sendiri.

Jangan memaksa `apps/fumadocs` untuk menggunakan konfigurasi package library sebelum ada kebutuhan.

`apps/fumadocs/tsconfig.json` memang berdiri sendiri dan tidak extends `@editor/config`. Kondisi ini boleh dipertahankan pada Phase 00.

### 4.8 Root check-types belum mencakup Fumadocs

Root script:

```bash
pnpm run check-types
```

menjalankan Turbo `check-types`, sementara Fumadocs mendefinisikan script `types:check`.

Akibatnya root `check-types` saat ini tidak menjadi verifikasi lengkap untuk Fumadocs.

Phase 00 harus memilih salah satu desain yang konsisten:

1. menambahkan root verification command khusus Fumadocs; atau
2. menormalisasi script package agar Turbo ikut menjalankan typecheck.

Pilihan implementasi harus mempertahankan fakta bahwa Fumadocs menggunakan `next typegen && tsc --noEmit`.

Target minimum Phase 00: ada satu command terdokumentasi yang benar-benar memverifikasi typecheck repository yang relevan.

### 4.9 Test command belum tersedia

`pnpm run test` belum ada.

Ini bukan bug Phase 00.

Vitest memang ditetapkan sebagai implementation gate pada phase berikutnya, sehingga Phase 00 cukup memastikan absence ini terdokumentasi dan tidak ada dokumentasi yang mengklaim test suite sudah tersedia.

### 4.10 Hooks sudah tersedia

Husky:

- `.husky/pre-commit` → `pnpm exec lint-staged`;
- `.husky/commit-msg` → `pnpm exec commitlint --edit "$1"`.

Lint-staged menjalankan Biome pada file staged.

Commitlint memakai Conventional Commits dengan header maksimum 100 karakter.

Phase 00 harus mempertahankan behavior ini dan memastikan dokumentasi contributor sesuai dengan implementasi aktual.

### 4.11 Biome adalah formatter/linter resmi

Repository menggunakan:

- Biome;
- tab indentation;
- double quotes;
- organize imports;
- React/Next lint domains.

Tidak boleh menambahkan ESLint atau Prettier hanya untuk menyelesaikan pekerjaan Phase 00.

### 4.12 AI agent skills sudah tersedia

`.agents/skills/` memiliki skill:

- `code-review`;
- `executing-plans`;
- `tiptap`;
- `webapp-testing`;
- `writing-plans`.

`skills-lock.json` telah menyimpan source dan hash skill.

Phase 00 harus mempertahankan setup ini dan tidak mengganti skill dengan implementasi lokal yang duplikatif tanpa alasan.

## 5. Scope

### In Scope

- audit dan cleanup scaffold;
- root README synchronization;
- environment/Varlock configuration cleanup;
- bunfig decision;
- dependency audit;
- root command consistency;
- documentation metadata cleanup yang bersifat foundation;
- Node/pnpm baseline documentation;
- repository development workflow documentation;
- Phase 00 verification;
- optional ADR bila cleanup membutuhkan keputusan arsitektural yang belum tercakup.

### Out of Scope

- Tiptap installation;
- ProseMirror implementation;
- `editor-core`;
- `editor-react`;
- React editor UI;
- toolbar;
- image upload;
- content utilities;
- Vitest setup;
- Playwright setup;
- Changesets setup;
- package publishing;
- playground implementation;
- full product documentation.

## 6. Desired End State

```text
editor/
├── .agents/skills/
├── .husky/
├── apps/
│   └── fumadocs/
├── docs/
│   └── roadmap/
│       ├── README.md
│       └── phase-00-foundation.md
├── packages/
│   └── config/
├── AGENTS.md
├── ARCHITECTURE.md
├── PRD.md
├── README.md
├── biome.json
├── commitlint.config.mjs
├── lint-staged.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── skills-lock.json
├── tsconfig.json
└── turbo.json
```

Catatan: daftar di atas bukan perintah untuk menghapus `bts.jsonc` secara otomatis. Keberadaannya ditentukan oleh audit Phase 00.

## 7. Task Breakdown

### Task 00.1 — Audit Dependency dan Configuration

Review:

- `package.json`;
- `pnpm-workspace.yaml`;
- `turbo.json`;
- `biome.json`;
- `tsconfig.json`;
- `packages/config/package.json`;
- `apps/fumadocs/package.json`;
- `bunfig.toml`;
- `bts.jsonc`;
- `skills-lock.json`.

Tujuan:

- mengetahui dependency mana yang aktif;
- menemukan scaffold artifacts;
- memastikan tidak ada runtime dependency editor yang tersembunyi;
- memisahkan application tooling dan future package tooling.

Output:

- keputusan cleanup yang dapat dieksekusi;
- tidak ada dependency yang dihapus tanpa bukti pemakaian.

### Task 00.2 — Cleanup Varlock

Audit semua reference terhadap:

- `varlock`;
- `_VARLOCK_ENV_KEY`;
- `.env.schema`;
- `env:generate`;
- generated `src/env.ts`.

Cari reference pada:

- package manifests;
- Turbo config;
- scripts;
- documentation;
- app source.

Jika tidak ada consumer aktif:

- hapus `varlock` dependency;
- hapus variable Turbo terkait Varlock;
- hapus workflow documentation terkait Varlock;
- jangan membuat pengganti environment abstraction yang belum dibutuhkan.

Acceptance:

```bash
rg "varlock|VARLOCK|env:generate|\.env\.schema" -g '!pnpm-lock.yaml'
```

tidak menemukan active runtime/tooling reference yang tersisa.

### Task 00.3 — Remove bunfig.toml

Audit repository untuk penggunaan Bun.

Jika tidak ada penggunaan aktif:

- delete `bunfig.toml`;
- jangan menambahkan Bun ke README;
- pnpm tetap menjadi official package manager.

Acceptance:

```bash
test ! -f bunfig.toml
```

dan repository documentation hanya menjadikan pnpm sebagai package-manager workflow.

### Task 00.4 — Dependency Cleanup

Tinjau root `zod`.

Hapus dependency jika:

- tidak digunakan oleh root scripts;
- tidak digunakan package/app yang membutuhkan dependency inheritance dari root;
- tidak dibutuhkan tooling aktif.

Jangan menghapus dependency secara hanya berdasarkan nama.

Setelah perubahan:

```bash
pnpm install
```

dan pastikan lockfile konsisten.

### Task 00.5 — Root Scripts Contract

Root scripts setelah Phase 00 harus memiliki contract yang jelas.

Minimum:

```json
{
  "dev": "...",
  "build": "...",
  "check-types": "...",
  "check": "...",
  "lint:staged": "...",
  "prepare": "..."
}
```

Phase 00 boleh menambahkan script verification baru jika dibutuhkan, misalnya script yang memastikan typecheck Fumadocs benar-benar berjalan.

Jangan menambahkan `test` sampai Vitest benar-benar diimplementasikan pada Phase 02.

### Task 00.6 — Fumadocs Foundation Cleanup

Review:

- `apps/fumadocs/package.json`;
- `apps/fumadocs/README.md`;
- `apps/fumadocs/src/lib/shared.ts`;
- `apps/fumadocs/content/docs/index.mdx`;
- `apps/fumadocs/content/docs/test.mdx`.

Update foundation metadata minimum:

- application name → RumahKodingku Editor;
- GitHub configuration → `Rumahkodingku/editor`;
- branch → `main`;
- dev port documentation → `4000`.

Jangan mengubah architecture routing Fumadocs tanpa kebutuhan.

Placeholder documentation boleh diganti dengan halaman foundation sederhana yang menjelaskan bahwa documentation content akan dibangun pada Phase 08.

### Task 00.7 — Root README Rewrite

Root README harus menjadi entry point repository, bukan dokumentasi Better-T-Stack.

Minimum sections:

```text
# RumahKodingku Editor

## Overview
## Repository Structure
## Development
## Verification
## Documentation
## Project Documents
## Roadmap
## Contributing / Commit Convention
```

README harus menyebut:

- pnpm;
- Node baseline;
- development command;
- verification commands;
- Fumadocs port;
- lokasi PRD, Architecture, Agents, roadmap.

README tidak boleh lagi menyebut workflow Varlock yang sudah dihapus.

### Task 00.8 — Runtime and Package Manager Baseline

Dokumentasikan:

- official package manager: pnpm;
- package manager version: `pnpm@10.34.5`;
- Node baseline: `>=22`;
- build environment requirement: Node `22.18+`.

Phase 00 hanya mencatat baseline yang sudah diputuskan dalam `ARCHITECTURE.md`; tsdown sendiri baru dipasang pada Phase 01.

Jangan memperkenalkan Node 20 compatibility.

### Task 00.9 — Documentation Consistency Audit

Verify:

- README;
- PRD;
- ARCHITECTURE;
- AGENTS;
- roadmap README;
- Fumadocs README;
- package scripts.

Look specifically for:

- wrong port;
- Bun instructions;
- Varlock instructions;
- references to packages that do not yet exist;
- claims that tests already exist;
- claims that editor implementation already exists.

The target-state structure in architecture must remain clearly distinguished from current state until later phases create the packages.

### Task 00.10 — Verification Baseline

Run all applicable checks.

Minimum:

```bash
pnpm install
pnpm run check
pnpm --filter fumadocs run types:check
pnpm run build
```

Also run relevant repository searches for removed scaffold references.

If `pnpm run check` modifies files because it uses `biome check --write .`, review resulting changes before commit.

Do not claim `pnpm run test` passes in Phase 00 because the test script does not exist yet.

## 8. Required Files Changed

Expected candidates:

- `README.md`;
- `package.json`;
- `pnpm-lock.yaml`;
- `turbo.json`;
- `bunfig.toml` — deletion if unused;
- `apps/fumadocs/README.md`;
- `apps/fumadocs/src/lib/shared.ts`;
- `apps/fumadocs/content/docs/index.mdx`;
- `apps/fumadocs/content/docs/test.mdx`;
- this file.

Files not to modify without a separate reason:

- `ARCHITECTURE.md`;
- `PRD.md`;
- `AGENTS.md`;
- `skills-lock.json`.

If a Phase 00 discovery proves one of those files is factually wrong, update it only as part of a documented consistency fix.

## 9. Verification Matrix

| Area                   | Verification                             | Expected                             |
| ---------------------- | ---------------------------------------- | ------------------------------------ |
| Install                | `pnpm install`                           | Success                              |
| Formatting/lint        | `pnpm run check`                         | Success, intentional formatting only |
| Fumadocs types         | `pnpm --filter fumadocs run types:check` | Success                              |
| Build                  | `pnpm run build`                         | Success                              |
| Varlock cleanup        | `rg "varlock                             | VARLOCK                              |
| env:generate           | \.env\.schema"`                          | No active references                 |
| Bun cleanup            | `test ! -f bunfig.toml`                  | Success when unused                  |
| Port docs              | inspect docs                             | 4000                                 |
| Repo identity          | inspect Fumadocs metadata                | RumahKodingku/editor                 |
| Tests                  | `pnpm run test`                          | Not required yet                     |
| Package implementation | inspect workspace                        | No editor package required yet       |

## 10. Acceptance Criteria

Phase 00 is complete when all of the following are true:

### Repository

- [ ] Root README describes RumahKodingku Editor instead of Better-T-Stack.
- [ ] Repository structure documentation matches actual files.
- [ ] No obsolete Varlock workflow remains when Varlock is removed.
- [ ] `bunfig.toml` is removed unless a documented technical dependency requires it.
- [ ] Root dependency set contains only dependencies justified by current repository usage.
- [ ] pnpm is the only documented package manager.
- [ ] Node `>=22` is documented consistently.

### Tooling

- [ ] Biome remains the only formatter/linter.
- [ ] Husky hooks still execute successfully.
- [ ] Commitlint configuration remains valid.
- [ ] Turbo configuration contains no obsolete scaffold environment settings.
- [ ] Root scripts have accurate documentation.
- [ ] Fumadocs typecheck is included in the documented verification flow.

### Fumadocs

- [ ] Fumadocs development port is documented as 4000.
- [ ] Repository metadata no longer points to the Fumadocs example repository.
- [ ] Application identity is RumahKodingku Editor.
- [ ] Placeholder content is either removed or clearly replaced with foundation content.
- [ ] Fumadocs build/typecheck passes.

### Agent readiness

- [ ] `AGENTS.md` remains accurate.
- [ ] `skills-lock.json` remains intact.
- [ ] Repo-local skills remain available.
- [ ] AI agent instructions do not refer to files that Phase 00 deleted without updating the instructions.
- [ ] The next-phase agent can discover Phase 01 from `docs/roadmap/README.md`.

### Verification

- [ ] `pnpm install` passes.
- [ ] `pnpm run check` passes.
- [ ] Fumadocs typecheck passes.
- [ ] `pnpm run build` passes.
- [ ] No unresolved cleanup item remains that blocks Phase 01.

## 11. Agent Instructions

AI agents executing this phase MUST:

1. Read `AGENTS.md`, `ARCHITECTURE.md`, and `PRD.md` before modifying code.
2. Inspect actual repository state before assuming a target directory exists.
3. Prefer deletion of obsolete scaffold configuration over creating a replacement abstraction.
4. Do not install Tiptap, tsdown, Vitest, Playwright, or Changesets during Phase 00.
5. Do not create `editor-core`, `editor-react`, or playground implementation in this phase.
6. Do not add Tailwind, icon libraries, or UI libraries to future published packages.
7. Do not move application configuration into `packages/config` unless an existing shared use case requires it.
8. Do not modify public package API because no public editor package exists yet.
9. Treat documentation cleanup as functional repository work: inaccurate docs are a Phase 00 defect.
10. Use pnpm commands.
11. Run verification after configuration changes.
12. Report failures explicitly. Never hide a failing check by removing the check.

## 12. Change Safety Rules

### Safe changes

Generally safe when backed by current-state evidence:

- rewriting stale README content;
- removing unused Varlock dependency/configuration;
- removing unused `bunfig.toml`;
- cleaning Fumadocs example metadata;
- fixing incorrect development port documentation;
- adding verification documentation;
- clarifying root scripts.

### Changes requiring extra review

Create or update an ADR when Phase 00 needs to:

- change package manager;
- change Node baseline;
- replace Turborepo;
- replace Biome;
- change workspace layout;
- change the package dependency direction defined in architecture;
- introduce a new infrastructure abstraction;
- alter the role of Fumadocs;
- change a resolved architectural decision.

Do not use Phase 00 as a reason to reopen settled architecture decisions.

## 13. Exit Criteria

Phase 00 can transition to Phase 01 only when:

```text
Repository is clean
        ↓
Scaffold artifacts audited
        ↓
Documentation synchronized
        ↓
Package/runtime baseline verified
        ↓
Fumadocs foundation verified
        ↓
Agent instructions verified
        ↓
check + typecheck + build pass
        ↓
Phase 01 unlocked
```

Phase 01 may then install Tiptap 3.x, introduce tsdown, and create the published package foundations.

## 14. Recommended Commit Boundaries

Keep Phase 00 changes reviewable. Suggested commit grouping:

1. `chore: clean scaffold configuration`
2. `docs: align repository documentation`
3. `chore: normalize fumadocs metadata`
4. `chore: verify repository foundation`

Use fewer or more commits when that makes the actual dependency graph clearer, but retain conventional commit syntax.

## 15. Definition of Done

Phase 00 is done when:

- current repository state is understood;
- obsolete scaffold assumptions are removed;
- repository documentation is trustworthy;
- pnpm/Node/tooling baseline is explicit;
- Fumadocs is a correctly identified documentation application;
- AI agent guidance is usable;
- verification commands work;
- no editor implementation has been prematurely introduced;
- the repository is ready for Phase 01 without another foundation cleanup cycle.

## 16. Deliverable

Primary deliverables:

- updated repository foundation;
- synchronized root README;
- cleaned scaffold configuration;
- verified Fumadocs metadata;
- verified repository commands;
- this Phase 00 execution document.

The expected end result is not a working rich-text editor. The expected end result is a repository that is **ready to implement the rich-text editor correctly**.
