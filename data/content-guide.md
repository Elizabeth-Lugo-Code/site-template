# content.json Field Guide

This file documents what every section of `data/content.json` is for, since JSON
itself doesn't support comments. Read this before editing `content.json` for a
new client site.

---

## `meta`
Controls the `<title>` and SEO description. These render directly into raw HTML
before any JS runs, so they can't be skipped or left blank without looking broken.

| Field | Purpose |
|---|---|
| `title` | Browser tab title. Currently set to `{{COMPANY_NAME}}` as a manual placeholder — must be hand-edited per site since JSON/JS can't auto-replace `{{}}` tokens. |
| `description` | Meta description for search engines. |

---

## `business`
Global company info, used across every page (nav, footer, contact page).

| Field | Purpose |
|---|---|
| `name` | Company name — used in nav logo, footer, and as the fallback for `footer.copyrightName`. |
| `shortTag` | Short suffix shown next to the name in the nav (e.g. "LLC"). |
| `logo` | Path to a logo image. Leave as `""` to fall back to a text-based logo instead. |
| `logoPosition` | `"left"`, `"center"`, or `"right"` — controls nav layout via CSS classes (`logo-pos-left`, etc. in styles.css Section 4). |
| `tagline` | Short company tagline — not currently rendered anywhere yet, reserved for future use. |
| `phone`, `email`, `address` | Contact info — primarily used by `contact.js` (info section) once built. |
| `socialMedia` | URLs per platform. Leave any platform's URL empty (`""`) to skip rendering that link entirely — `renderSocialLinks()` in site.js filters out empty ones automatically. |
| `socialMediaLabels` | Custom link text per platform (e.g. "See our work on Facebook"). |
| `navCta` | Optional persistent button in the nav bar. Set `enabled: true` to turn it on for a client that wants one (e.g. "Get an estimate", "Book now"). Leave `enabled: false` as the template default. |

---

## `nav`
Array of top-level navigation links, shared across every page.

```json
{ "label": "Home", "href": "index.html", "page": "home" }
```

- `label` — link text
- `href` — file to link to
- `page` — must match the `data-page="..."` value set on that page's `<body>` tag, so `site.js` can highlight the active nav link.

---

## `home`
Content for `index.html`, rendered by `home.js`.

### `home.intro`
The top hero section.
- `eyebrow` — small label above the headline (e.g. `"01 — Welcome"`)
- `headline`, `sub` — main heading and supporting sentence
- `primaryCta` / `secondaryCta` — two buttons, each with `label` + `href`
- `image` — currently unused; reserved for future use once a layout decision is made for where a hero image would go

### `home.highlight1` / `home.highlight2`
Generic feature-grid sections — same shape, reused for whatever the site needs
to showcase (services, products, portfolio pieces, testimonials, etc.). Both
sections are rendered by the same shared function, `renderHighlight()`, in
`home.js`.

- `eyebrow`, `headline`, `sub` — section heading
- `items[]` — array of cards, each with:
  - `tag` — small label above the card title (e.g. a number or category)
  - `title`, `body` — card heading and description
  - `featured` — `true`/`false`, adds a highlighted border/background style to that card

### `home.about`
A short about/story teaser section.
- `eyebrow`, `headline`, `body` — heading and paragraph text
- `image` — currently unused; same as above, reserved for a future layout decision

---

## `contact`
Content for `contact.html`. **Not yet wired to a `contact.js` — this shape is
locked in, but the render functions haven't been built yet.**

- `intro` — small heading section at the top (`eyebrow`, `headline`, `sub`)
- `form` — `fields[]` (which inputs to show) and `submitLabel` (button text)
- `info` — toggles (`showAddress`, `showPhone`, `showEmail`, `showSocial`) so a
  client can hide any piece of contact info without deleting data from
  `business`, plus `mapEmbedUrl` for an optional embedded map

---

## `mission`
Content for `mission.html`. **Not yet wired to a `mission.js` — this shape is
locked in, but the render functions haven't been built yet.**

- `intro` — heading section at the top (`eyebrow`, `headline`, `sub`, `image`)
- `story` — the main narrative section (`eyebrow`, `headline`, `body`)
- `values` — a list of core values/principles (`eyebrow`, `headline`, `items[]`
  each with `title` + `body`)
- `cta` — single closing call-to-action (`label` + `href`), usually pointing to
  the contact page

---

## `footer`
Global footer content, rendered by `site.js`'s `renderFooter()`.

| Field | Purpose |
|---|---|
| `copyrightName` | Leave as `""` to auto-fall-back to `business.name` — this avoids typing the company name in two places. Only fill this in if the footer should show a *different* name than the nav/business name. |
| `links` | Array of `{ label, href }` — usually mirrors the main `nav` array, but can differ if the footer needs extra links (e.g. a privacy policy page) that don't belong in the main nav. |

The copyright year is **not** stored in JSON — `site.js` calculates it
automatically with `new Date().getFullYear()`, so it's always current without
needing yearly manual updates.

---

## General conventions

- **Curly-brace placeholders** like `{companyName}` or `{{COMPANY_NAME}}` do
  **not** auto-replace. JSON has no templating engine built in — these are
  manual find-and-replace reminders only. Search for `{{` and `{` across all
  files when spinning up a new client site.
- **Empty strings (`""`) are the default "off" state** for optional fields —
  used consistently for skipping social links, falling back to `business.name`,
  and skipping unset image fields.
- **`enabled` / `show___` boolean flags** are the preferred pattern for
  optional features (like `navCta.enabled`, `contact.info.showPhone`) — since
  JSON can't have commented-out blocks, flipping a boolean is the template's
  equivalent of "uncommenting" a feature.