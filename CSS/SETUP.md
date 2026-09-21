# Setup and handover guide

Everything below assumes you are the maintainer and someone else owns the dealership.
Work through it in order. Nothing here needs more than VS Code and a web browser.

---

## Part 1 — Arranging the files in VS Code

### 1.1 Open the project

1. Unzip `newmississippi-site.zip` somewhere permanent. **Documents/newmississippi** is fine.
   Do not leave it in your Downloads folder, you will eventually clean that out by accident.
2. Open VS Code.
3. **File → Open Folder**, pick the `newmississippi` folder. Open the *folder*, not a single file.
   If you open one file, the sidebar stays empty and nothing else works right.
4. VS Code will offer the recommended extensions from `.vscode/extensions.json`. Say yes.
   You are installing **Live Server** (preview the site) and **Prettier** (tidies formatting).

### 1.2 What every file is, top to bottom

This is the whole project. There is nothing hidden.

**Pages — the six things a visitor can land on.** Each one is a near-empty shell.
The header, the footer and most of the content are filled in by JavaScript, so
these files stay short and you almost never edit them.

| File | What it is | How often you touch it |
|---|---|---|
| `index.html` | Homepage | Rarely |
| `inventory.html` | The full inventory list, with the search and sort controls | Rarely |
| `vehicle.html` | One vehicle's page. Every car shares this one file. `vehicle.html?v=NM1001` shows stock NM1001 | Rarely |
| `apply.html` | Financing application, or the handoff to the lender | Rarely |
| `visit.html` | Address, hours, directions | Rarely |
| `contact.html` | Phone, email, social | Rarely |
| `404.html` | Shown when a link is wrong or a sold car's page is gone | Never |
| `owner.html` | Owner tools. Not in the menu. Reachable only if you know the address | Never |

**The engine — `assets/js/`**

| File | What it does | How often you touch it |
|---|---|---|
| `data.js` | **The whole dealership.** Address, phone, hours, socials, where the Apply button goes, every announcement, every vehicle | Every single update |
| `site.js` | Builds the header and footer, holds shared helpers, decides where Apply points | Only to add a nav link |
| `home.js` | Assembles the homepage sections | Rarely |
| `inventory.js` | Search, sort and availability filtering | Rarely |
| `vehicle.js` | The vehicle detail page and its photo gallery | Rarely |
| `apply.js` | The application form, its validation, and the lender handoff screen | Rarely |
| `pages.js` | Fills in `visit.html` and `contact.html` | Rarely |
| `owner.js` | Owner tools. Generates a fresh `data.js` for the owner to send you | Never |

**Everything else**

| File | What it does |
|---|---|
| `assets/css/site.css` | All styling. The color palette is the `:root` block at the very top |
| `assets/img/` | Vehicle photos. One folder, flat, no subfolders |
| `netlify.toml` | Hosting config and security headers. Netlify reads it automatically |
| `robots.txt` | Tells search engines to index the site but skip Owner tools |
| `sitemap.xml` | Helps Google find all six pages |
| `.gitignore` | Junk files Git should ignore |
| `.vscode/extensions.json` | The extension recommendations VS Code offered you |
| `README.md` | Day-to-day reference |
| `SETUP.md` | This file |

### 1.3 Preview it

Right-click `index.html` in the sidebar → **Open with Live Server**. The site opens
in your browser and reloads every time you save. Leave it running while you work.

### 1.4 Put it under version control (do this before anything else)

You are about to be responsible for someone's business website. You want undo.

```bash
cd path/to/newmississippi
git init
git add .
git commit -m "Initial site"
```

Then create an empty repository on GitHub and follow the two commands it shows you
to push. From now on, after every change: `git add .`, `git commit -m "what changed"`,
`git push`. If you ever break the site, `git log` shows you every version and you can
go back to any of them.

---

## Part 2 — Hosting, and why there is no server

A dealership website that hands its applications to a lender has nothing to compute
and nothing to store, so it does not need a server. It needs **static hosting**: a
machine that serves files over HTTPS. That is what Netlify, Cloudflare Pages, Vercel
and GitHub Pages all do, and it is what almost every modern marketing site runs on.

This is not a lesser option. A static site has no database to breach, no login to
compromise, no software to patch, and it stays up under traffic that would flatten a
small server. It is the more professional choice here, not the budget one.

**You should only run a real server if you decide to receive applications yourself.**
And you should not decide that. See Part 3.

### 2.1 Get it live in ten minutes

**Fastest, no account needed to try:**

1. Go to `app.netlify.com/drop`
2. Drag the entire `newmississippi` folder onto the page
3. It is live, on a free `something-random.netlify.app` address, within about ten seconds

**The way you should actually do it, so updates are one command:**

1. Push the project to GitHub as in 1.4
2. Sign in to Netlify with your GitHub account
3. **Add new site → Import an existing project → GitHub**, pick the repository
4. Build command: leave blank. Publish directory: `.`
5. Deploy

Now every `git push` redeploys the live site automatically. That is your whole
maintenance loop: edit `data.js` in VS Code, save, commit, push, done.

### 2.2 A real domain

1. Buy the domain at Namecheap, Porkbun or Cloudflare. Around $12 to $15 a year.
   `newmississippimotors.com` reads better than `newmississippi.com`.
2. In Netlify: **Domain management → Add a domain**, enter it, follow the DNS steps.
3. HTTPS turns itself on within a few minutes. You do not buy a certificate.
4. Open `robots.txt` and `sitemap.xml` and replace `REPLACE-WITH-YOUR-DOMAIN.com`
   with the real domain. Commit and push.

**Decide who owns the domain and the Netlify account.** The cleanest arrangement is
that the dealership owns both and adds you as a collaborator. If you own them and the
relationship ends, you are holding their business hostage, which is a bad position for
everyone. Settle this before you take the first payment.

---

## Part 3 — Pointing Apply at a secure application

The site is already built for this. Only the URL is missing, and only the dealer can
get it.

### 3.1 The owner does this part

They contact whichever lender or platform they already use and ask for their
**dealer application URL**. The common ones:

- **RouteOne** — routeone.com, the most widely used
- **Dealertrack** — dealertrack.com
- **AppOne** — appone.com
- If they use a buy-here-pay-here DMS such as Frazer, DealerCenter or Wayne Reaves,
  ask that vendor. Most include a hosted credit application.

They come back with a link that looks roughly like
`https://apps.routeone.net/dealer/XXXXXXX/apply`.

### 3.2 You do this part, and it is one line

Open `assets/js/data.js` and find the `window.APPLY` block near the top:

```js
window.APPLY = {
  mode:       "hosted",
  hostedUrl:  "https://apps.routeone.net/dealer/XXXXXXX/apply",
  hostedName: "RouteOne"
};
```

Change `mode` to `"hosted"`, paste the URL, name the partner. Save.

Every Apply button on the site now opens that link in a new tab: the one in the
header, the one in the footer, the one on every inventory card, the one on every
vehicle page. If someone reaches `apply.html` directly, they get a short page that
explains applications are handled securely and links them onward, and if they came
from a vehicle it reminds them of the stock number.

### 3.3 Until they have that URL

Leave `mode: "builtin"`. The form works, it validates properly, and it is fine for
showing the owner how it looks. **It is not fine for real applicants**, because it
hands the completed application to the applicant's email program, and ordinary email
is not an acceptable way to move a date of birth and a driver license number. As a
dealer, your client is covered by the FTC Safeguards Rule for exactly this data.

If they want to collect applications themselves rather than through a lender, the
honest answer is that it needs more than a website: encrypted storage, access control,
retention limits, a written security program and an incident plan. Do not build that
into this project. Point them at their lender, or at a vendor who sells compliance
as a product.

---

## Part 4 — Handing Owner tools to the owner

`owner.html` is a page the owner can use with no code, no login and no risk, because
**it cannot change the live site**. It loads the current data, lets them edit it in a
normal form, and produces a new `data.js` file plus any new photos for them to send you.

### 4.1 What you tell the owner

> Go to `yourdomain.com/owner.html` and bookmark it. Add cars, mark things sold, post
> announcements, change your hours. When you are done, press **Download the updated
> data file**, and if you added photos press **Download new photos** too. Email me both
> and the website will be updated the same day. Nothing you do on that page goes live
> by itself, so you cannot break anything.

### 4.2 What you do when their email arrives

1. Drop their photos into `assets/img/`
2. Replace `assets/js/data.js` with the one they sent
3. Refresh Live Server and click through the homepage, the inventory and one vehicle
4. `git add . && git commit -m "Inventory update" && git push`
5. Netlify redeploys on its own. Reply that it is live.

Two minutes of work, which is what makes $15 a month sustainable.

### 4.3 Worth knowing

- The generated `data.js` is valid JavaScript with the comments replaced by a
  timestamp header. It is still perfectly editable by hand.
- Owner tools is excluded from search engines by `robots.txt` and by a header in
  `netlify.toml`. It is unlisted, not secret, and it does not need to be secret,
  because it holds nothing and changes nothing.
- If the owner would rather edit the live site directly, the upgrade path is
  **Decap CMS**, a free editor that commits to your GitHub repository. That is a
  bigger job and worth charging separately for.

---

## Part 5 — Finishing the site

Work down this list. It is ordered by how much it matters.

### Must do before it goes live

1. **Fill in `window.SITE` in `data.js`.** Street address, city, state, ZIP, phone,
   email. Empty fields show visible placeholder text like "Add your address in
   data.js" on the live site. Nothing is more obviously unfinished.
2. **Delete the sample Honda Accord** from `window.INVENTORY` and add real cars.
   It has a fake VIN. Never leave a fake VIN on a dealer site.
3. **Replace the placeholder announcement** in `window.NEWS`, or empty the list to
   hide the section entirely.
4. **Set the Apply destination** per Part 3.
5. **Add real photos.** Every vehicle without photos shows a grey "No photo yet"
   box, and a car with no picture does not sell.
6. **Check the hours.** They are defaulted to 9 to 6 weekdays, 9 to 4 Saturday,
   closed Sunday. Confirm with the owner rather than assuming.
7. **Fill in the social links,** or leave them blank and they disappear on their own.

### Should do in the first week

8. Replace `REPLACE-WITH-YOUR-DOMAIN.com` in `robots.txt` and `sitemap.xml`.
9. Add a favicon: put a small square PNG at `assets/img/favicon.png` and add
   `<link rel="icon" href="assets/img/favicon.png">` into the `<head>` of each page.
10. Set up a Google Business Profile for the dealership. For a local lot this drives
    more traffic than the website does, and it is free.
11. Open the site on an actual phone, not just a narrowed browser window. Tap every
    button. Phones are most of your traffic.
12. Ask the owner to walk through Owner tools while you watch. Whatever confuses them
    is what you fix.

### Known limits, so nothing surprises you

- **Photos are not automatically resized when you add them by hand in VS Code.**
  Owner tools resizes them; you do not. A 5 MB phone photo will make the page crawl.
  Keep them around 1400px wide and under 300 KB. Squoosh.app does this in a browser.
- **`vehicle.html?v=NM1001` is one page serving every car.** Google indexes it fine,
  but it is not as strong for search as a separate file per vehicle would be. If the
  inventory grows past roughly fifty cars, that is worth revisiting.
- **The search box only matches text you actually entered.** A car with an empty
  `color` field will never turn up in a search for its color.
- **Everything renders with JavaScript.** If a visitor blocks JS, they see an empty
  page. This is true of most modern sites and is not worth fixing here.
- **Sold vehicles stay in `data.js` when you set `status: "sold"`.** They drop off the
  default inventory view but their page still loads. That is deliberate, so old links
  do not break. Delete the block when you want them truly gone.

### If something breaks

| What you see | What it usually is |
|---|---|
| Completely blank page | A typo in `data.js`. Press F12, open Console, read the red line. A missing comma between two vehicle blocks causes this nine times out of ten |
| Header and footer missing everywhere | `site.js` failed to load, or `data.js` has a syntax error that stopped it |
| A vehicle shows "not on the lot anymore" | The `id` in the link does not match any `id` in `data.js`. Check for a stray space |
| Photos are broken boxes | Filename mismatch. It is case-sensitive on the live server but not on Windows, so `Accord-1.jpg` works locally and fails live. Use lowercase everywhere |
| Fonts look wrong | The Google Fonts link is blocked or offline. The site falls back to system fonts and still works |
| Changes do not show up | Hard refresh: Ctrl+Shift+R, or Cmd+Shift+R on a Mac |
| Netlify deployed but shows the old site | Check the Deploys tab. If the newest one failed, the error is in the log |

**The single most useful habit:** when something breaks, press F12 and read the
Console tab. It almost always names the file and the line number.
