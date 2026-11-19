# Project architecture

This is a static Danish website for Kragnæs Landsby on Ærø. The user supplied a complete HTML beta page, so the project intentionally uses plain HTML rather than a framework template. There is no build step, backend, database, or dependency installation.

## Key files

- `public/index.html`: page content, metadata, inline SVG icon symbols, section navigation, membership prices, and email actions.
- `public/styles.css`: design tokens, typography, responsive layouts, focus states, and reduced-motion support.
- `public/site.js`: progressively enhanced mobile navigation and current copyright year.
- `public/favicon.svg`: village sun-and-waves brand mark.
- `public/img/landscape.jpg`: the photograph referenced by the supplied source page, saved locally.
- `netlify.toml`: publishes `public` directly and configures local Netlify development on port 8889.

## Conventions and decisions

Keep visitor-facing copy in Danish and retain the supplied village name, contact details, and membership amounts unless the user asks to change them. News entries are examples and must remain visibly identified as beta content. Do not invent scheduled events, social profile URLs, payment instructions, or confirmed village announcements.

Use semantic HTML, CSS custom properties, and vanilla JavaScript. Preserve anchor targets (`om`, `nyheder`, `kalender`, `forening`, `medlemskab`, `kontakt`). Navigation remains visible without JavaScript; enhancement adds an accessible mobile menu with Escape support. All meaningful content and contact actions work without JavaScript.

Reference the local photograph through `/.netlify/images` with responsive sizes and WebP output. The photo is an atmospheric landscape from the supplied source, not a verified image of Kragnæs. Keep it decorative rather than labeling it as the village.

The site accepts no persistent input. Contact, event suggestions, and membership inquiries use the original email address through `mailto:` links. Add Netlify platform services if future requirements need persistence or server-side behavior.

No build or local validation commands were run during initial creation; the hosting pipeline validates the deployed project. Local development uses `netlify dev --port 8889`.
