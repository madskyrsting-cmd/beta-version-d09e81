# Kragnæs Landsby

A Danish community website for Kragnæs on Ærø, based on the supplied beta page. It brings together village news, upcoming events, Kragnæs Havn Bådelaug membership information, and email contact links.

The website uses semantic HTML, responsive CSS, and a small amount of vanilla JavaScript for mobile navigation. Netlify serves the `public` directory directly, with no package installation or build step. The supplied landscape photograph is stored locally and served in responsive sizes through Netlify Image CDN. Google Fonts provides DM Sans, Manrope, and Newsreader, with local font fallbacks.

## Local development

Run `netlify dev --port 8889` from the project root and open `http://localhost:8889`. Using Netlify CLI also supports the image transformation endpoint.

## Editing content

Update Danish page content, membership prices, and email links in `public/index.html`. Styles are in `public/styles.css`; navigation behavior is in `public/site.js`. The source photograph is `public/img/landscape.jpg`, downloaded from the Unsplash URL included in the supplied page.

The news entries remain clearly marked as beta examples. The event calendar has an explicit empty state until real events are available. Membership and event suggestions open a prefilled email to the contact supplied with the original page. No payments, form submissions, or personal data are processed by this website.
