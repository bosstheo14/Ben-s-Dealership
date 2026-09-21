# NewMississippi — dealership website

A plain HTML, CSS and JavaScript website. No build step, no framework, no server.
Open the folder in VS Code, edit a file, save, refresh the browser. That's the whole workflow.

---

## The pages

| File | What it is |
|---|---|
| `index.html` | Homepage: headline, hours card, announcements, three featured vehicles, directions, contact |
| `inventory.html` | Full inventory with search, sort and an availability filter |
| `vehicle.html` | One vehicle's photos and specs. Reached as `vehicle.html?v=NM1001` |
| `apply.html` | Credit application: applicant, employment and vehicle sections |
| `visit.html` | Address, hours, directions button, about the dealership |
| `contact.html` | Phone, email, address and social links |

Shared pieces live in `assets/`:

```
assets/
  css/site.css      all the styling, including the color palette
  js/data.js        <-- the only file you edit day to day
  js/site.js        header, footer and shared helpers
  js/home.js        homepage
  js/inventory.js   inventory search and sort
  js/vehicle.js     vehicle detail page
  js/apply.js       the application form
  js/pages.js       visit and contact pages
  img/              vehicle photos go here
```

The header and footer are built once in `site.js`, so adding a nav link is a one-line
change in the `PAGES` list at the top of that file, not an edit to six HTML files.

---

## Running it on your machine

1. Open the folder in VS Code: **File → Open Folder**
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**

The site opens in your browser and reloads every time you save. Opening the HTML
file directly by double-clicking works too, but Live Server is smoother.

---

## Adding a vehicle

Everything happens in `assets/js/data.js`.

1. Resize your photos to about 1400px wide and drop them in `assets/img/`
2. Scroll to `window.INVENTORY` and copy one whole `{ ... }` block
3. Paste it above the others (newest first)
4. Change `id` to the stock number — it has to be unique and have no spaces
5. Fill in the rest. Any field you leave as `""` is simply hidden on the site
6. List the photo filenames in `photos: [ ]`
7. Save, refresh

To mark something sold, change `status: "available"` to `status: "sold"`. It drops out
of the default inventory view but stays reachable, which is useful for your own records.
To remove it entirely, delete the block.

## Posting an announcement

Same file, `window.NEWS`. Newest goes at the top. Empty the list to hide the section.

## Changing your address, phone, hours or social links

Same file, `window.SITE` at the top. The directions buttons everywhere on the site
build their Google Maps link from the address you put there.

## Changing the colors

`assets/css/site.css`, the `:root` block at the very top. Change `--gold` and every
button, underline and price on the site follows. The dark-mode values are a few lines
below that.

---

## Putting it online

The site is static files, so almost anything hosts it, most of it free:

- **Netlify Drop** — go to app.netlify.com/drop and drag the folder onto the page. Live in about ten seconds.
- **GitHub Pages** — push the folder to a repo, then Settings → Pages → deploy from `main`. This also gives you version history, which is worth having.
- **Cloudflare Pages**, **Vercel** — same idea.
- **Any cPanel host** — upload the folder contents to `public_html`.

For a custom domain like `newmississippimotors.com`, buy it from any registrar
(roughly $12–15 a year) and point it at whichever host you picked.

---

## About the application form

The application collects everything a dealer credit app needs and validates it:
it checks the applicant is 18, flags an expired license, and catches bad phone
numbers and email addresses. When it passes, it opens the applicant's email app
with the whole application filled in, addressed to the `email` you set in `data.js`.

**Read this part before you take a real applicant through it.** A static site cannot
receive form submissions, and plain email is not a secure way to receive dates of
birth and driver license numbers. As a dealer you are covered by the FTC Safeguards
Rule for that data. Two ways to handle it properly:

1. **Point the Apply button at your lender's hosted application.** RouteOne,
   Dealertrack and AppOne all give you a secure application URL. In `site.js`,
   change the `apply.html` links to that URL. This is the least work and the
   safest option.
2. **Keep this form and wire it to a service that encrypts submissions.** Formspree,
   Basin and similar services take a static form and deliver it securely.

Either way, have whoever handles your compliance look at the final version first.

---

## A maintenance checklist

If you are billing $15 a month to keep this running, this is roughly the work:

**Weekly**
- Add new arrivals, mark sold units, adjust prices
- Post an announcement if anything changed

**Monthly**
- Click through all six pages on a phone and on a desktop
- Check every "Apply" and "Directions" button still goes where it should
- Compress any oversized photos that crept in

**Yearly**
- Renew the domain
- Refresh the homepage headline and the about paragraph

