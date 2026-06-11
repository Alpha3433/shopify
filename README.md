# Old Glory — High-Converting Shopify Theme

A custom Shopify Online Store 2.0 theme built for a single hero product: a **hand-carved wooden American flag with eagle**, sold through the story of a veteran-owned American workshop.

**v3 "quiet" design language** (original code, editorial-commerce style): cream canvas, big rounded tiles, pill buttons and pill variant pickers, large serif editorial type, navy band sections, sticky product buy column with a collage gallery — all in the navy / cream / heritage-red / gold palette. The homepage is deliberately restrained: a short ladder of sections, soft scroll reveals, and **no stacked hype** (no marquees, ticking countdowns, or fake scarcity by default). The high-energy sections (marquees, countdown banner, comparison, process, stats) are still in the theme and can be re-added per page in the customizer.

**Honest urgency, built in:** the buy box has a *Sale offer* box with a real end date (it hides itself automatically after the date passes), a concrete *"Order today — arrives [date range]"* line computed from your real delivery settings, and sold-out variant states. Use a real Shopify discount with the sale, and keep the deadline real.

**Claims policy:** all default copy avoids made-in-USA, veteran-made, and hand-signed claims. Do not re-add origin or maker-identity claims unless they are literally true for your fulfillment — the FTC's Made-in-USA rule and deceptive-endorsement rules carry per-violation penalties, and ad platforms ban for it.

Designed mobile-first, fully responsive, with modern subtle animations (scroll reveals, count-up stats, floating sticker) that respect `prefers-reduced-motion`.

## Install

**Option A — Upload the zip**
1. Download `dist/old-glory-theme.zip` (or run `./package.sh` to rebuild it).
2. Shopify Admin → **Online Store → Themes → Add theme → Upload zip file**.
3. Click **Customize**, then **Publish** when ready.

**Option B — GitHub integration**
Shopify Admin → **Online Store → Themes → Add theme → Connect from GitHub** and pick this repository/branch. Edits in the theme editor sync back as commits.

## 10-minute setup checklist

1. **Product** — create your flag product with 3–6 photos (square, 1200×1200+). Set a `Compare-at price` to activate the "Save %" badge. Then, in the product admin's **Theme template** dropdown (right sidebar), select **`flag`** — this is the dedicated high-converting landing template (buy box → veteran story → testimonials → comparison → process → stats → guarantee → FAQ → final CTA).
2. **Homepage → Featured product section** — pick your product.
3. **Hero section** — upload your best product/lifestyle shot (square).
4. **Story section** — upload a photo of the maker at work (portrait 4:5); edit the story copy and signature to your real founder details.
5. **Menus** — set up `main-menu` (keep it short: Home, The Flag, Our Story, FAQ) and `footer` (Shipping, Returns, Privacy, Terms, Contact).
6. **Theme settings → Cart** — set the free-shipping threshold (e.g. 75) to enable the cart-drawer progress bar, or leave 0 to hide it.
7. **Theme settings → Social media** — add your links.
8. **Contact page** — create a page using the `page.contact` template.
9. **Testimonials / stats / FAQ** — replace the placeholder content with *real* reviews and numbers. Everything is editable per-section in the customizer.
10. **Favicon + logo** — Theme settings → Favicon, Header section → Logo.

> ⚠️ The default testimonials, ratings, and stats are **placeholder copy** to show layout and tone. Replace them with genuine customer reviews and accurate numbers before launch — fabricated reviews violate FTC rules and Shopify policy, and authenticity is this brand's entire premise.

## Conversion architecture (why the homepage is ordered this way)

The quiet ladder: every CTA scrolls to the single buy box (`#buy`). Restraint is the tactic — the page should read like a small workshop brand, not a funnel.

| # | Section | Job |
|---|---------|-----|
| 1 | Hero (editorial + collage) | Problem-first headline ("carved, not printed"), single CTA, guarantee stat tile |
| 2 | Story | Why carved beats printed — the emotional core, in plain we-voice |
| 3 | Featured product | The one and only buy box: benefits, pill variants, sale box with real end date, "arrives by" dates, trust row |
| 4 | Testimonials | Social proof placed *right after* the price/quality objection (replace placeholders with real reviews) |
| 5 | Guarantee | Kills the last objection (risk) — refund without return |
| 6 | FAQ | Handles everything else, including "Is it really hand-carved?" |
| 7 | Final CTA | One last, single ask |

Sections still available to add in the customizer if you want more energy: marquee tickers, editorial lines, countdown banner (auto-hides after its date), comparison, process, stats, big outline marquee, value props, newsletter.

> **Stale-date check:** the announcement bar and the buy-box sale offer default to "Father's Day Sale … June 21". The sale box hides itself after June 21 automatically; the announcement bar does **not** — edit it when the sale changes.

## Product templates

Assign a template in the product admin's **Theme template** dropdown (right sidebar):

- **`landing`** — the maximal conversion page. Sticky buy column with pill variants, **Bundle & Save offer cards** (Single / Patriot Pair / Family Set), quantity, dynamic checkout, dispatch countdown, and workshop note box; collage gallery with built-in content tiles; then countdown banner → veteran story → **Amazon-style review list** (rating summary + distribution bars) → comparison → process → stats → guarantee → outline marquee → FAQ → final CTA → value props → newsletter. Use this one for ad traffic.
- **`flag`** — the same ladder without bundles/review-list (testimonial cards instead). A lighter alternative.
- **`product`** (default) — short version for any other products.

> **Bundles:** the offer cards set the cart quantity and show the savings pill — create a matching Shopify **automatic volume discount** (Discounts → Amount off products → minimum quantity) so the discount is real at checkout.

The collage gallery tiles (banner, info lists, round "60 Days" guarantee badge, extra images) are editable blocks on the Product page section; add `Gallery tile: extra image` blocks as you shoot more photos.

One goal per page: the hero and final CTAs smooth-scroll to the buy box (`#buy`) instead of navigating away. The **`flag` product template** repeats the full ladder (buy box → story → proof → comparison → process → stats → guarantee → FAQ → final CTA) for ad traffic that lands there directly; the default `product` template is a shorter version for any other products.

## Troubleshooting

**"Liquid error: Could not find asset snippets/icon.liquid" (or stars/product-card) all over the page** — your theme install is missing the `snippets/` files (an earlier version of this theme had snippet headers that Shopify's upload validator rejected, causing those files to be silently skipped). Fix: rebuild the zip from this repo (`./package.sh`), then upload it as a **new** theme (Online Store → Themes → Add theme → Upload zip file) and republish. Re-select your product in the Featured product section afterward.

## Features

- AJAX add-to-cart with slide-out cart drawer + free-shipping progress bar
- Sticky mobile add-to-cart bar (appears after the buy button scrolls away)
- Dispatch-cutoff countdown timer (configurable hour, visitor-local)
- Variant picker, quantity stepper, sold-out states — all no-framework vanilla JS
- Scroll-reveal + count-up animations via IntersectionObserver, disabled for `prefers-reduced-motion`
- JSON-LD Product schema, Open Graph tags, semantic headings that read as a story (H1 → H2 chain)
- Full template coverage: home, product, collection(s), cart, pages, contact, blog, article, search, 404, password, gift card, customer accounts

## Structure

```
assets/      base.css (design system), theme.js (all interactivity)
config/      settings_schema.json, settings_data.json
layout/      theme.liquid, password.liquid
locales/     en.default.json
sections/    homepage + main-* template sections (all customizer-editable)
snippets/    icon, stars, product-card, cart-drawer
templates/   JSON templates + customers/ + gift_card.liquid
```
