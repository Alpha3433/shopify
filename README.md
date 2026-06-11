# Old Glory — High-Converting Shopify Theme

A custom Shopify Online Store 2.0 theme built for a single hero product: a **hand-carved wooden American flag with eagle**, sold through the story of a veteran-owned American workshop.

**v2 design language** (original code, editorial-commerce style): cream canvas, big rounded tiles, pill buttons and pill variant pickers, large serif editorial type, navy band sections, countdown sale banner, giant gold-outline text marquees, newsletter band, sticky product buy column with a collage gallery — all in the navy / cream / heritage-red / gold palette.

Designed mobile-first, fully responsive, with modern subtle animations (scroll reveals, count-up stats, marquees, floating sticker, button sheen) that respect `prefers-reduced-motion`.

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
| 1 | Hero (editorial + collage) | Problem-first headline, single CTA, rating line, image collage with stat tile + round sticker |
| 2 | Marquee ticker | Modern motion + repeats core trust claims |
| 3 | Editorial statements | Big serif brand lines ("Carved by hand. / Burned into the grain.") |
| 4 | Countdown banner | Batch urgency with live countdown chips (auto-hides when passed) |
| 5 | Comparison | Agitates the "cheap import" pain (them vs. us) |
| 6 | Story | The veteran founder story — the emotional core |
| 7 | Featured product | The one and only buy box: benefits, pill variants, urgency countdown, trust row |
| 8 | Testimonials | Social proof placed *right after* the price/quality objection |
| 9 | Process | "3 days of work" — justifies the price |
| 10 | Stats | Animated count-up credibility numbers |
| 11 | Guarantee | Kills the last objection (risk) |
| 12 | Big marquee | Giant outline-text motion break ("Hang It Once ★ Pass It Down") |
| 13 | FAQ | Handles everything else |
| 14 | Final CTA | One last, single ask |
| 15 | Value props + Newsletter | Reassurance strip and list capture for non-buyers |

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

## Elixir-based variant (`elixir-american/`)

A second, separate storefront built on the store owner's licensed Elixir theme (v1.5.4): all demo colors re-mapped to the navy/cream/heritage-red/gold palette via global settings + per-section values, typography switched to Playfair Display / Work Sans, and the homepage, product page, announcement bar, and footer rewritten with the Old Glory veteran-story copy and conversion ladder (quantity-break bundles, scarcity notice, FAQ, comparison table, before/after, statistics, guarantee). Upload `dist/elixir-american.zip` as a new theme. Keep this repository private — Elixir is licensed third-party code.

After upload: assign your real collections in the "Shop the collection" and product-grid sections, upload your photos, relink the upsell products, and create the volume discounts matching the bundle offers.
