# Old Glory — High-Converting Shopify Theme

A custom Shopify Online Store 2.0 theme built for a single hero product: a **hand-carved wooden American flag with eagle**, sold through the story of a veteran-owned American workshop.

Designed mobile-first, fully responsive, with modern subtle animations (scroll reveals, count-up stats, marquee, floating hero, button sheen) that respect `prefers-reduced-motion`.

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

| # | Section | Job |
|---|---------|-----|
| 1 | Hero | Problem-first headline, single CTA, star-rating trust line |
| 2 | Marquee | Modern motion + repeats core trust claims |
| 3 | Comparison | Agitates the "cheap import" pain (them vs. us) |
| 4 | Story | The veteran founder story — the emotional core |
| 5 | Featured product | The one and only buy box: benefits, urgency countdown, trust row |
| 6 | Testimonials | Social proof placed *right after* the price/quality objection |
| 7 | Process | "3 days of work" — justifies the price |
| 8 | Stats | Animated count-up credibility numbers |
| 9 | Guarantee | Kills the last objection (risk) |
| 10 | FAQ | Handles everything else |
| 11 | Final CTA | One last, single ask |

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
