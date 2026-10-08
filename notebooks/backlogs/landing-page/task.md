# Landing page: toktiktak site

Public website for the team **toktiktak** (`https://toktiktak.click`) presenting its product Owl Yeah, needed for funding and startup-program applications. Contact: `admin@toktiktak.click`.

## Built

- `landing/`: static site, no framework, no build step. `index.html`, `styles.css`, `main.js` (language toggle, mobile menu and copy button), `assets/` (owl, favicon, apple touch icon, `share.png` built for the page: owl, "Owl Yeah" and "by toktiktak").
- Bilingual EN/VI: every text has an `en` and a `vi` span; `<html lang>` picks one (default EN, choice saved in `localStorage` key `lang`).
- Sections: header (wordmark, nav, language switch), hero, features, how a session works, who it is for, try it, about toktiktak, contact, footer.
- No offline claim: production has offline disabled. Lessons are described as AI-drafted and checked against the textbook, never as independently reviewed.
- Below 1024px the nav sits behind a menu button (aria-expanded, closes on link click and Escape).
- Copy comes from `docs/spec.md` and `README.md`; no metrics, customers, team members or testimonials; nothing that identifies the learner described in `docs/learner.md`.
- Checked with Playwright at 375, 768 and 1440 px in EN and VI: no horizontal scroll, no console errors, copy button puts the code on the clipboard, language survives a reload.

## Public demo code

`OWLTQVWC-4KH5KJYX`, family id `OWLTQVWC`. It is printed on the public page, so treat that family as public: revoke it (add `OWLTQVWC` to `FAMILY_CODES_REVOKED`, see `docs/operations.md`) if it is abused, and update the page with a new code. The page only links to `https://app.toktiktak.click/unlock`; it never fills the code in for the user.

## Deploy (owner, not done)

1. Create a separate Vercel project from this repo with **Root Directory** `landing/`, framework preset "Other", no build command, output directory `.` (the folder is served as is).
2. Add the domain `toktiktak.click` (and `www.toktiktak.click` redirecting to it) to that project and set the DNS records Vercel shows.
3. Open the site, check the share preview (`og:image` is `https://toktiktak.click/assets/share.png`).

## Open item (not done)

Serving the app at `https://app.toktiktak.click`:

- Add the domain `app.toktiktak.click` to the app's Vercel project (`tutor`).
- The media bucket CORS allows only `https://owlyeah.vercel.app`; add `https://app.toktiktak.click` to the bucket CORS rule and to `docs/operations.md` (the media bucket line at the top and the CORS step). Until then, videos and narration fail on the new domain.
- Until the app domain works, the "Open the app" links on the landing page lead nowhere.
