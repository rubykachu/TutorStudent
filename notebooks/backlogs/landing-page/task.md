# Landing page: Owl Yeah site

Public website (`https://toktiktak.click`) promoting the product **Owl Yeah**; the team toktiktak is only a secondary credit ("By toktiktak" chip, one sentence in About, copyright line). Needed for funding and startup-program applications.

Branding and contacts: the header, `<title>` and OG tags lead with Owl Yeah. The footer carries the contacts: support `support@toktiktak.click`, app `app.toktiktak.click`, team `admin@toktiktak.click`. The Contact section button uses `support@`. The About section has no info card.

## Built

- `landing/`: static site, no framework, no build step. `index.html`, `styles.css`, `main.js` (language toggle, mobile menu and copy button), `assets/` (owl, favicon, apple touch icon, `share.png` built for the page: owl, "Owl Yeah" and "by toktiktak").
- Bilingual EN/VI: every text has an `en` and a `vi` span; `<html lang>` picks one (default EN, choice saved in `localStorage` key `lang`).
- Sections: header (wordmark, nav, language switch), hero, features, how a session works, who it is for, try it, about Owl Yeah, contact, footer.
- No offline claim: production has offline disabled. Lessons are described as AI-drafted and checked against the textbook, never as independently reviewed.
- Below 1024px the nav sits behind a menu button (aria-expanded, closes on link click and Escape).
- Copy comes from `docs/spec.md` and `README.md`; no metrics, customers, team members or testimonials; nothing that identifies the learner described in `docs/learner.md`.
- Cosmos look: dark night sky (nebula glows, static and twinkling star tiles, ringed and banded planets from `src/components/cosmos-background.tsx`, glass cards), text checked for WCAG AA on the darkest and lightest surfaces; twinkle, planet drift and owl bob stop under `prefers-reduced-motion`. Planets hide where they would sit behind content (ringed below 768px, banded below 1200px).
- Footer: owl wordmark, tagline and team credit on the left; Support, App and Team links with icons on the right; copyright bar at the bottom; stacks left-aligned on phones.
- Checked with Playwright at 375, 768 and 1440 px in EN and VI: no horizontal scroll, no console errors, copy button puts the code on the clipboard, language survives a reload.

## Public demo code

`OWLTQVWC-4KH5KJYX`, family id `OWLTQVWC`. It is printed on the public page, so treat that family as public: revoke it (add `OWLTQVWC` to `FAMILY_CODES_REVOKED`, see `docs/operations.md`) if it is abused, and update the page with a new code. The page only links to `https://app.toktiktak.click/unlock`; it never fills the code in for the user.

## Deploy (done 08/10/2026)

- Vercel project `owlyeah-landing` (account `rubykachu`), deployed from `landing/` with `npx vercel deploy --prod --yes`; no build step.
- Domains: `toktiktak.click` on `owlyeah-landing`, `app.toktiktak.click` on the app project `tutor`. Cloudflare DNS holds the CNAME records Vercel proposed (applied through Domain Connect, proxy off).
- Media bucket CORS allows `https://owlyeah.vercel.app` and `https://app.toktiktak.click`.
- The support mailbox works (owner confirmed).
- Not set up: `www.toktiktak.click`.
