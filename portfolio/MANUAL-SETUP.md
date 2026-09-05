# Manual Setup — Read This Before Launching Ads

Everything below is a placeholder. Nothing fake was added to the site itself —
these are just the real-world values only you can provide.

## 1. In `index.html`, find `window.SITE_CONFIG` and fill in:

- `WHATSAPP_NUMBER` — your number in international format, digits only
  (e.g. `"919876543210"`). Until this is set, the floating WhatsApp button
  stays hidden and the "Chat on WhatsApp" link in the contact section falls
  back to the form.
- `CONTACT_EMAIL` — where leads should land if you don't set up a form
  endpoint (see #2).
- `FORM_ENDPOINT` — see below.
- `GA4_ID` — your Google Analytics 4 Measurement ID (`G-XXXXXXX`), if you
  want visitor/conversion tracking. Leave blank to skip.
- `META_PIXEL_ID` — your Meta Pixel ID, if you're running Meta Ads. Leave
  blank to skip.

## 2. Get the contact form actually delivering leads to you

Right now, if `FORM_ENDPOINT` is blank, the form falls back to opening the
visitor's email app with a pre-filled message — usable, but not ideal for a
paid-ads funnel (some visitors have no email client configured).

Recommended: sign up for a free account at either
[Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com/) —
both let a static site like this send form submissions to your inbox with
no backend needed. Paste the endpoint URL/access key they give you into
`FORM_ENDPOINT`.

## 3. Domain

Search-and-replace `YOUR-DOMAIN.com` across `index.html`, `robots.txt`, and
`sitemap.xml` once you have a real domain.

## 4. Pricing

The Pricing section (`components/pricing.html`) intentionally has no
numbers — it's built around a "book a trial, discuss pricing after" flow.
If you'd rather show fixed prices, look for the `PRICE-PLACEHOLDER`
comments in that file.

## 5. Policies

`components/faq.html` has a few answers marked `<!-- TODO -->` in the code
(scheduling process, cancellation/refund policy). These use safe, generic
language for now — replace with your actual policy once decided.

## 6. Testimonials

Existing testimonials were left exactly as they were — nothing was changed,
added, or removed. Add real ones the same way when you have them.

## 7. Nice-to-haves (not urgent)

- No favicon is currently set up (none was in the original files, so none
  was invented). Add one via a `<link rel="icon">` in `index.html` once
  you have a logo mark.
- `og:image` isn't set — add a real 1200×630 social preview image if you
  want link previews to look good when shared.
