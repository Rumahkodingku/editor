# RumahKodingku Editor — UI Redesign Specification

**Document:** UI Redesign Specification  
**Product:** RumahKodingku Editor  
**Scope:** Fumadocs landing page (`/`) and documentation route (`/docs`)  
**Status:** Ready for AI-agent implementation  
**Design reference:** `stripe-DESIGN.md` / uploaded `stripe-DESIGN(1).md`  
**Primary objective:** Replace the current default-looking Fumadocs presentation with a cohesive, premium developer-product experience while preserving Fumadocs functionality and documentation architecture.

---

## 1. Executive Summary

RumahKodingku Editor currently has functional Fumadocs pages, but the visual identity is still too close to the default documentation/theme presentation.

This redesign should establish a clear product identity:

> **Editorial Developer Infrastructure**

The website must feel like a serious developer product rather than a generic documentation template.

The redesign consists of two related but intentionally different experiences:

- `/` — product marketing / landing page
- `/docs` — developer documentation

They must share the same visual system, logo, typography, colors, spacing, and interaction language, but their visual density and purpose should differ.

### Landing page

The landing page should communicate:

- what RumahKodingku Editor is;
- why developers should use it;
- its framework-independent architecture;
- its typed and composable API philosophy;
- its actual editor experience;
- how to get started.

### Documentation

The documentation should communicate:

- how to install the packages;
- how to use the editor;
- how the architecture works;
- available APIs;
- features;
- guides;
- examples;
- accessibility;
- customization.

Do not turn `/docs` into a marketing page. Documentation remains an information-retrieval experience.

---

# 2. Design Source of Truth

The uploaded `stripe-DESIGN.md` is the visual foundation for this redesign.

Important source-derived tokens:

### Colors

```text
primary          #533AFD
primary-deep     #4434D4
primary-press    #2E2B8C
primary-soft     #665EFD
brand-dark-900   #1C1E54
ink              #0D253D
ink-secondary    #273951
ink-mute         #64748D
ink-mute-2       #61718A
on-primary       #FFFFFF
canvas           #FFFFFF
canvas-soft      #F6F9FC
canvas-cream     #F5E9D4
hairline         #E3E8EE
hairline-input   #A8C3DE
ruby             #EA2261
magenta          #F96BEE
lemon            #9B6829
shadow-blue      #003770
```

These values come directly from the supplied design reference.

The reference describes indigo as the signature CTA/link color, deep navy as the structural/product color, white as the primary canvas, and ruby/magenta/lemon as atmospheric gradient accents.

### Typography

Use the supplied typography hierarchy as the basis.

Preferred font stack:

```css
font-family:
  "Sohne",
  "SF Pro Display",
  system-ui,
  -apple-system,
  sans-serif;
```

If the project cannot legally or technically load Sohne, use the documented open-source approximation:

```css
font-family:
  Inter,
  system-ui,
  -apple-system,
  sans-serif;
```

Do not introduce Helvetica as the primary typeface for this redesign.

Display typography must preserve the reference's editorial character:

- weight: 300
- negative letter spacing
- generous whitespace

Important reference sizes:

```text
56px / 1.03 / -1.4px
48px / 1.15 / -0.96px
32px / 1.10 / -0.64px
26px / 1.12 / -0.26px
22px / 1.10 / -0.22px
20px / 1.40 / -0.20px
18px / 1.40 / 0
16px / 1.40 / 0
15px / 1.40 / 0
```

Do not make display headings unnecessarily bold.

### Radius

```text
xs     4px
sm     6px
md     8px
lg     12px
xl     16px
pill   9999px
```

### Spacing

```text
xxs    2px
xs     4px
sm     8px
md     12px
lg     16px
xl     24px
xxl    32px
huge   64px
```

Use an 8px base spacing rhythm.

The reference recommends approximately 64–96px section spacing on marketing surfaces and 32–48px on product/documentation surfaces.

---

# 3. Non-Goals

Do NOT:

- replace Fumadocs with another documentation framework;
- rewrite the documentation content unnecessarily;
- change public package APIs;
- change editor behavior;
- change package architecture;
- change routing semantics unless required for the visual redesign;
- add a backend;
- introduce a database;
- introduce authentication;
- introduce a new UI framework solely for visual styling;
- make Tailwind a runtime requirement for published editor packages;
- copy Stripe's exact website or proprietary visual assets.

This is a UI/UX redesign of the Fumadocs application.

---

# 4. Core Design Principles

## 4.1 Product-first

The landing page must show the actual value of the editor.

Avoid generic SaaS marketing sections.

Prefer:

- actual editor preview;
- architecture;
- code;
- packages;
- developer workflow.

## 4.2 Editorial

Large headings should have:

- thin weight;
- negative tracking;
- generous whitespace;
- restrained color usage.

## 4.3 Technical

The product is developer infrastructure.

The UI should therefore communicate:

- precision;
- composability;
- modularity;
- framework independence;
- TypeScript;
- extensibility.

## 4.4 Minimal

Do not add decorative UI elements without purpose.

## 4.5 Actual product over illustration

When possible, use actual editor UI, actual code examples, actual package names, and actual documentation information.

Do not create fake product capabilities.

## 4.6 Consistent but not identical

`/` and `/docs` belong to the same product, but must have different density.

---

# 5. Brand Architecture

Use the existing RumahKodingku Editor symbol logo.

The logo should appear as:

```text
[SYMBOL] RumahKodingku Editor
```

For the primary light theme:

- symbol: primary indigo
- wordmark: ink/deep navy

For dark surfaces:

- use the white/reversed logo where available.

Do not create a new logo during this UI implementation task.

The logo should be treated as a product mark, not as a generic Fumadocs icon.

---

# 6. Landing Page `/`

## 6.1 Goal

The landing page should immediately communicate:

> A modern, reusable, typed, composable rich-text editor for the web.

The page should make developers want to open the documentation or inspect the repository.

---

# 7. Landing Page Information Architecture

Recommended order:

```text
1. Navigation
2. Hero
3. Actual editor preview
4. Developer value / feature cards
5. Architecture
6. Quick-start / code section
7. Final CTA
8. Footer
```

Do not create excessive marketing sections.

---

# 8. Landing Navigation

Desktop structure:

```text
[Logo] RumahKodingku Editor

Features
Docs
Examples
GitHub

[Get Started]
```

Navigation should use a light surface.

Recommended:

```text
background: #FFFFFF
text: #0D253D
border-bottom: #E3E8EE
```

The navigation may visually overlap the gradient hero on the landing page.

### Navigation behavior

- sticky or top-positioned;
- compact;
- accessible;
- keyboard navigable;
- responsive;
- mobile menu below the mobile breakpoint.

Do not create a visually heavy navbar.

---

# 9. Landing Hero

## 9.1 Hero purpose

The hero is the strongest brand expression.

It should combine:

- editorial typography;
- subtle gradient mesh;
- concise product positioning;
- primary CTA;
- secondary GitHub action;
- actual editor preview.

## 9.2 Hero copy

Use wording based on the existing product positioning.

Recommended:

### Eyebrow

```text
DEVELOPER TOOL
```

### Headline

```text
A modern rich-text
editor for the web.
```

### Supporting line

```text
Typed. Composable. Framework-ready.
```

### Description

```text
A reusable, typed, composable WYSIWYG rich-text editor
built on Tiptap and ProseMirror for modern web applications.
```

Do not make the hero paragraph excessively long.

---

# 10. Hero CTA

Primary:

```text
Get Started →
```

Secondary:

```text
View on GitHub
```

Primary CTA:

```text
background: #533AFD
color: #FFFFFF
border-radius: 9999px
padding: 8px 16px
```

Secondary CTA can be an outlined or low-emphasis pill.

Do not use two filled primary buttons.

---

# 11. Hero Gradient Mesh

The design reference identifies the gradient mesh as a major marketing visual signature.

Use a subtle atmospheric mesh across the upper hero.

Suggested color family:

```text
cream
sherbet/orange
lavender
indigo
ruby/magenta
```

Important:

- do not make it overpowering;
- do not reduce text contrast;
- do not use a simple flat CSS gradient if an organic SVG/background implementation is available;
- do not copy Stripe assets;
- use an original mesh implementation.

The gradient is decorative depth, not the primary content.

---

# 12. Hero Product Preview

The hero must contain an actual-looking editor UI.

Preferred approach:

Use the real editor UI from the existing playground/application where technically feasible.

If a static preview is necessary, make it visually consistent with the real editor.

Recommended structure:

```text
┌─────────────────────────────────────┐
│ Paragraph   B  I  U  •  ≡  🔗      │
├─────────────────────────────────────┤
│                                     │
│ Build rich content with a modern    │
│ editing experience.                 │
│                                     │
│ This editor is reusable, typed,     │
│ composable, and framework-ready.    │
│                                     │
└─────────────────────────────────────┘
```

The preview should look like a real product surface, not a generic illustration.

Use:

```text
background: #FFFFFF
border: #E3E8EE
radius: 12px
subtle shadow
```

---

# 13. Developer Value Section

Headline:

```text
Built for developers.
```

Subheadline:

```text
A rich-text editing foundation without the framework lock-in.
```

Create three feature cards.

## Card 1

```text
Framework independent
```

Description:

```text
The core editor logic does not depend on React,
so it can support additional frameworks without
duplicating editor logic.
```

## Card 2

```text
Typed
```

Description:

```text
Type-safe APIs built for modern TypeScript applications.
```

## Card 3

```text
Composable
```

Description:

```text
Extend the editor with your own extensions,
schemas, and custom UI.
```

Cards:

```text
background: #FFFFFF
border: 1px solid #E3E8EE
border-radius: 12px
padding: 32px
```

---

# 14. Architecture Section

This is a key differentiator and must not be omitted.

Use a deep navy product section.

Background:

```text
#1C1E54
```

Headline:

```text
Built as an editor ecosystem.
```

Supporting copy:

```text
A modular architecture with a framework-independent core
and adapters for supported UI frameworks.
```

Show an architecture diagram conceptually:

```text
                 React
                   │
                   ▼
       @rumahkodingku/editor-react
                   │
                   ▼
       @rumahkodingku/editor-core
                   │
             ┌─────┴─────┐
             ▼           ▼
          Tiptap     ProseMirror
```

Do not invent packages that do not exist.

The current project package names must be verified from the repository before implementation.

Use indigo for the central highlighted package.

---

# 15. Quick Start / Code Section

Headline:

```text
Write less editor infrastructure.
```

Supporting text:

```text
Get started with just a few lines of code.
```

Show a real installation and usage example from the documentation.

Example concept:

```bash
pnpm add @rumahkodingku/editor-react
```

Then:

```tsx
import { Editor } from "@rumahkodingku/editor-react";

<Editor
  defaultValue={content}
  onChange={setContent}
/>
```

Important:

- use the actual API from the repository;
- do not invent props;
- if the current API differs, document the real API instead.

Code block styling:

```text
background: #1C1E54
color: #FFFFFF
border-radius: 12px
```

---

# 16. Final CTA

Use a dark navy band.

Headline:

```text
Ready to build?
```

Supporting:

```text
Build rich editing experiences without rebuilding the editor.
```

CTA:

```text
Get Started →
```

Keep this section compact.

---

# 17. Footer

Footer should be restrained.

Suggested:

```text
[Logo]

RumahKodingku Editor
Reusable rich-text editing infrastructure.

Documentation
Examples
GitHub
NPM

© 2026 RumahKodingku
```

Use muted text.

Recommended:

```text
background: #FFFFFF
color: #64748D
padding: 64px 24px
```

---

# 18. Documentation Route `/docs`

## 18.1 Primary principle

Documentation is not marketing.

The documentation should optimize:

1. navigation;
2. readability;
3. search;
4. code copying;
5. API discovery;
6. accessibility.

---

# 19. Documentation Global Header

Recommended:

```text
[Logo] RumahKodingku Editor

Docs
Examples
GitHub

[Search documentation...]
[Theme]
[Language]
```

Use a clean white header.

```text
background: #FFFFFF
border-bottom: #E3E8EE
```

Avoid the current heavy dark header presentation.

---

# 20. Documentation Layout

Desktop:

```text
┌──────────────────────────────────────────────────────────┐
│ Header                                                   │
├──────────────┬───────────────────────────┬───────────────┤
│ Sidebar      │ Documentation content     │ On this page  │
│              │                           │               │
│ Navigation   │ Heading                   │ Anchors       │
│              │ Lead                      │               │
│              │ Body                      │               │
│              │ Code                      │               │
│              │ Tables                    │               │
└──────────────┴───────────────────────────┴───────────────┘
```

Keep the three-column documentation structure where supported by Fumadocs.

Do not sacrifice existing navigation functionality.

---

# 21. Documentation Sidebar

Recommended information hierarchy:

```text
GET STARTED
Introduction
Installation
Quick Start

FUNDAMENTALS
Editor
Content
State
Extensions

FEATURES
Formatting
Links
Images
Toolbar

GUIDES
Controlled Mode
Custom Extensions
Theming
Image Upload
SSR
Browser Accessibility

API REFERENCE
Core
React
Editor Props
Components
Hooks
Types
Extensions
Toolbar
Upload

EXAMPLES
Basic Editor
Controlled Editor
Uncontrolled Editor
Read-only Editor
Disabled Editor
Custom Toolbar
Custom Extension
Image Upload
Theming
```

The exact page names must match actual documentation files.

Do not create navigation entries for pages that do not exist.

---

# 22. Sidebar Visual Style

Section labels:

```text
font-size: 10–11px
font-weight: 400
letter-spacing: 0.1px
text-transform: uppercase
color: #64748D
```

Navigation item:

```text
font-size: 14–15px
color: #273951
```

Active navigation:

```text
background: #F0EFFF
color: #4434D4
```

Optionally include a subtle 2px indigo active indicator.

Avoid large dark-gray active blocks.

---

# 23. Documentation Main Content

For a major page title:

```text
font-size: 48px
font-weight: 300
line-height: 1.15
letter-spacing: -0.96px
color: #0D253D
```

Example:

```text
Introduction
```

Lead:

```text
A reusable, typed, composable WYSIWYG rich-text editor
for modern web applications.
```

Body:

```text
15–16px
font-weight: 300
line-height: 1.4
color: #273951
```

Use generous vertical spacing.

---

# 24. Documentation Code Blocks

Code blocks should use the deep navy product surface.

```text
background: #1C1E54
color: #FFFFFF
border-radius: 12px
```

Include:

- language label;
- copy button;
- horizontal overflow on mobile;
- accessible contrast;
- clear syntax highlighting.

The code block should look like a premium developer tool rather than a generic markdown code block.

---

# 25. Documentation Tables

Use white cards/tables.

```text
background: #FFFFFF
border: 1px solid #E3E8EE
border-radius: 12px
```

Header:

```text
background: #F6F9FC
```

Body text:

```text
#273951
```

Muted metadata:

```text
#64748D
```

Do not use a heavy dark table unless the content specifically benefits from it.

---

# 26. "On This Page"

Keep the existing right-side table of contents concept.

Visual treatment:

```text
ON THIS PAGE

Packages
Key facts
Where to go next
```

Active anchor:

```text
color: #533AFD
```

Use a subtle vertical indicator.

Do not make the right rail visually dominant.

---

# 27. Search

Search should be one of the strongest documentation controls.

Recommended:

```text
┌────────────────────────────────────────┐
│ ⌕  Search documentation          ⌘ K   │
└────────────────────────────────────────┘
```

Style:

```text
background: #F6F9FC
border: 1px solid #E3E8EE
border-radius: 9999px
```

Preserve the current keyboard shortcut behavior.

Do not break Fumadocs search.

---

# 28. Dark Mode

Dark mode must remain supported.

Do not simply invert all colors.

Dark mode should use a deep-navy palette.

Suggested:

```text
dark canvas       #0D1028
dark surface      #1C1E54
primary           #665EFD
text              #FFFFFF
muted             #A8B2C2
border            rgba(255,255,255,0.10)
```

Use the white/reversed RumahKodingku Editor logo.

Code blocks may use a slightly darker surface than cards.

---

# 29. Responsive Design

Follow the design reference's responsive principles.

Breakpoints:

```text
Wide       >= 1440px
Desktop    1024–1439px
Tablet     768–1023px
Mobile     < 768px
```

## Landing mobile

Navigation:

```text
[Logo]                 [Menu]
```

Hero:

- reduce heading size;
- stack content;
- editor preview below CTA;
- preserve gradient;
- maintain adequate contrast.

Feature cards become one column.

Architecture diagram becomes vertically stacked.

Code section becomes one column.

## Docs mobile

- sidebar becomes a drawer;
- right-side TOC becomes collapsible or moves below heading;
- code blocks become horizontally scrollable;
- header remains compact;
- search remains easily accessible.

Minimum interactive target should remain approximately 40–44px on mobile.

---

# 30. Accessibility Requirements

The redesign must preserve or improve the existing Phase 07 accessibility work.

Do not regress:

- keyboard navigation;
- focus visibility;
- semantic landmarks;
- heading hierarchy;
- ARIA semantics;
- accessible names;
- contrast;
- reduced-motion support;
- screen-reader usability.

Important:

> Visual redesign must not remove existing accessibility semantics simply to achieve a visual effect.

Run existing accessibility tests after implementation.

---

# 31. Motion

Motion should be subtle.

Allowed:

- hero gradient movement;
- hover transitions;
- button press;
- sidebar active transitions;
- navigation transitions.

Avoid:

- large parallax;
- continuous distracting animations;
- excessive bouncing;
- animation that delays documentation usage.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 32. Shadows and Elevation

Use shadows sparingly.

Recommended level 1:

```css
box-shadow:
  rgba(0, 55, 112, 0.08) 0 1px 3px;
```

Level 2:

```css
box-shadow:
  rgba(0, 55, 112, 0.08) 0 8px 24px,
  rgba(0, 55, 112, 0.04) 0 2px 6px;
```

Do not add strong black shadows.

Gradient mesh is the primary atmospheric depth mechanism for the landing hero.

---

# 33. Component Strategy

Prefer existing Fumadocs components and project components where possible.

Create custom components only where they provide real product value.

Potential landing-specific components:

```text
LandingHeader
HeroSection
EditorPreview
FeatureGrid
ArchitectureSection
CodeShowcase
FinalCTA
SiteFooter
```

Potential documentation customization:

```text
DocsHeader
DocsSidebar customization
DocsSearch customization
DocsTable styling
DocsCodeBlock styling
DocsToc styling
```

Exact component names are implementation suggestions, not mandatory API names.

Follow the current repository architecture.

---

# 34. CSS / Theme Strategy

Centralize visual tokens.

Prefer CSS variables:

```css
:root {
  --rk-primary: #533afd;
  --rk-primary-deep: #4434d4;
  --rk-primary-press: #2e2b8c;
  --rk-primary-soft: #665efd;

  --rk-brand-dark: #1c1e54;

  --rk-ink: #0d253d;
  --rk-ink-secondary: #273951;
  --rk-ink-muted: #64748d;

  --rk-canvas: #ffffff;
  --rk-canvas-soft: #f6f9fc;
  --rk-canvas-cream: #f5e9d4;

  --rk-hairline: #e3e8ee;

  --rk-ruby: #ea2261;
  --rk-magenta: #f96bee;
  --rk-lemon: #9b6829;
}
```

Use project conventions if an existing theme/token system already exists.

Do not duplicate the same token values across many CSS files.

---

# 35. Fumadocs Compatibility

The redesign must preserve:

- Fumadocs routing;
- source loader;
- generated metadata;
- search;
- Markdown copy;
- LLM routes;
- page navigation;
- table of contents;
- code blocks;
- language switching if already enabled;
- dark/light mode;
- GitHub source links;
- documentation links.

Do not break:

```text
/llms.txt
/llms-full.txt
/llms.mdx/docs/*
```

if those routes already exist.

---

# 36. SEO / Metadata

Landing page metadata should communicate:

```text
RumahKodingku Editor
```

with a concise description such as:

```text
A reusable, typed, composable WYSIWYG rich-text editor
built on Tiptap and ProseMirror.
```

Documentation pages should retain meaningful page-specific metadata.

Do not replace useful existing metadata with generic Fumadocs titles.

---

# 37. Real Content Rule

This is mandatory.

AI agent must inspect the current repository before writing UI copy or examples.

Do not invent:

- packages;
- APIs;
- props;
- hooks;
- features;
- framework support;
- commands;
- version numbers;
- roadmap claims.

The UI must reflect the actual current implementation.

---

# 38. Image / Asset Rule

Prefer existing project assets.

For the hero editor preview:

1. Use actual Playground/editor UI where possible.
2. If a static visual is required, create a faithful representation of the current product.
3. Do not introduce unrelated stock imagery.
4. Do not use random developer stock photos.
5. Do not create decorative illustrations that compete with the editor.

The product itself is the visual asset.

---

# 39. Landing Page Visual Hierarchy

Target visual hierarchy:

```text
Brand
  ↓
Hero message
  ↓
Actual editor
  ↓
Developer benefits
  ↓
Architecture
  ↓
Code
  ↓
CTA
```

The visitor should understand the product within the first viewport.

---

# 40. Documentation Visual Hierarchy

Target hierarchy:

```text
Brand / Navigation
        ↓
Documentation navigation
        ↓
Page title
        ↓
Lead
        ↓
Content
        ↓
Code / API / examples
```

The docs must feel fast and easy to scan.

---

# 41. Comparison With Current UI

## Current landing

Problems:

- excessive empty space;
- no product preview;
- no visual product identity;
- minimal product storytelling;
- default documentation-style appearance;
- weak CTA hierarchy.

## Target landing

Should have:

- branded header;
- atmospheric hero;
- strong product headline;
- real editor preview;
- feature cards;
- architecture section;
- code section;
- final CTA.

---

## Current docs

Problems:

- default Fumadocs visual language dominates;
- dark-heavy presentation;
- weak product branding;
- navigation hierarchy can be more refined;
- typography does not express the brand;
- code/content surfaces lack a coherent product visual language.

## Target docs

Should have:

- clean light header;
- RumahKodingku Editor branding;
- structured sidebar;
- thin editorial typography;
- indigo active states;
- white cards;
- deep-navy code blocks;
- restrained TOC;
- excellent readability;
- preserved Fumadocs functionality.

---

# 42. Implementation Order

AI agent should implement in this order.

## Step 1 — Repository audit

Inspect:

```text
apps/fumadocs
apps/fumadocs/content/docs
apps/fumadocs/app
apps/fumadocs/components
apps/fumadocs/lib
```

and current styling/theme files.

Also inspect:

```text
apps/playground
packages/editor-core
packages/editor-react
```

when building the editor preview or examples.

Do not modify anything before understanding the current implementation.

---

## Step 2 — Establish design tokens

Create/reuse centralized tokens.

Implement:

- colors;
- typography;
- spacing;
- radius;
- shadows;
- responsive values.

---

## Step 3 — Redesign global shell

Update:

- header;
- navigation;
- logo;
- theme controls;
- responsive navigation.

---

## Step 4 — Redesign landing page

Implement:

1. Hero
2. Gradient mesh
3. Editor preview
4. Feature cards
5. Architecture
6. Code showcase
7. CTA
8. Footer

---

## Step 5 — Redesign docs shell

Implement:

- header;
- sidebar;
- active navigation;
- search;
- content typography;
- TOC;
- code block styling.

---

## Step 6 — Dark mode

After light mode is stable:

- define dark tokens;
- adapt surfaces;
- adapt borders;
- adapt text;
- use reversed logo;
- test code blocks.

---

## Step 7 — Responsive

Test:

```text
1440+
1280
1024
768
390
375
```

---

## Step 8 — Accessibility

Run:

- keyboard navigation;
- focus tests;
- axe;
- heading hierarchy;
- color contrast;
- screen-reader-oriented semantics where applicable.

---

## Step 9 — Browser validation

Run the existing:

- Fumadocs smoke tests;
- Fumadocs accessibility tests;
- Playground smoke/scenario tests.

Add regression tests for new landing-page behavior where appropriate.

---

# 43. Definition of Done

The redesign is complete only when:

### Landing

- [ ] `/` has a branded RumahKodingku Editor header.
- [ ] Hero contains the new editorial headline.
- [ ] Hero has subtle original gradient mesh.
- [ ] Hero contains a product/editor preview.
- [ ] Primary CTA uses indigo pill.
- [ ] Feature cards exist.
- [ ] Architecture section exists.
- [ ] Code section exists.
- [ ] Final CTA exists.
- [ ] Footer exists.
- [ ] Mobile layout is polished.

### Documentation

- [ ] `/docs` has branded header.
- [ ] Sidebar is visually redesigned.
- [ ] Active navigation uses soft indigo.
- [ ] Typography follows the design system.
- [ ] Code blocks use deep navy.
- [ ] Tables/cards use light surfaces.
- [ ] Search remains functional.
- [ ] TOC remains functional.
- [ ] Documentation routing remains intact.
- [ ] Dark mode works.
- [ ] Mobile docs work.

### Quality

- [ ] No invented API.
- [ ] No broken Fumadocs functionality.
- [ ] No broken LLM documentation routes.
- [ ] No accessibility regression.
- [ ] No console errors.
- [ ] No TypeScript errors.
- [ ] No unnecessary dependencies.
- [ ] Existing project conventions are respected.

---

# 44. Visual Acceptance Criteria

The implementation should visually communicate:

### Landing

> Premium developer product

not:

> Generic SaaS template

### Documentation

> Professional developer documentation

not:

> Default Fumadocs

### Overall

> RumahKodingku Editor has its own recognizable product identity.

---

# 45. AI Agent Instructions

Before implementing:

1. Read this document completely.
2. Inspect the current repository.
3. Inspect existing Fumadocs configuration.
4. Inspect current theme/layout implementation.
5. Inspect the actual editor implementation.
6. Inspect current public documentation.
7. Identify the minimum files that need modification.
8. Preserve existing architecture.
9. Do not introduce unnecessary dependencies.
10. Implement the redesign incrementally.
11. Run the repository checks after implementation.
12. Run browser tests.
13. Run accessibility tests.
14. Fix regressions before finishing.
15. Verify the final UI at desktop and mobile sizes.

Do not stop after creating a visual mockup. The task is to implement the actual UI.

---

# 46. Important Design Constraint

The generated UI concept image is a **visual direction reference**, not an exact pixel-perfect specification.

The implementation must prioritize:

1. the actual repository;
2. actual Fumadocs behavior;
3. actual package APIs;
4. this specification;
5. the supplied design system;
6. visual similarity to the generated concept.

Do not reproduce the generated image literally if doing so would conflict with the actual project structure.

---

# 47. Final Design Statement

The target experience is:

> **RumahKodingku Editor — a premium, editorial, developer-first editor product with a clean marketing surface and a precise documentation experience.**

The visual language should combine:

```text
Indigo
+
Deep Navy
+
Editorial Typography
+
Subtle Gradient Mesh
+
Actual Product UI
+
Generous Whitespace
+
Precise Documentation
```

The result should feel cohesive, modern, technical, and production-ready without becoming visually noisy.

---

# 48. Reference Material

Primary design reference:

```text
stripe-DESIGN.md
```

The uploaded reference establishes:

- color tokens;
- typography;
- radius;
- spacing;
- cards;
- buttons;
- gradient mesh;
- navigation;
- shadows;
- responsive behavior;
- visual do/don't principles.

The implementation should use the reference as a **design-language source**, not as a request to clone another company's website.

---

**End of UI Redesign Specification**
