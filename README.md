# Tend

Class-by-class to-do list, test study goals, calendar, focus timers and automatic Schoology sync.
A plain website (no build step) hosted on Netlify, installable on Mac and iPhone.

## What's in this folder

| Path | What it is |
|---|---|
| `site/` | The website itself: `index.html` (the whole app), `sw.js` (offline support), `manifest.webmanifest` and `icons/` (so it installs like an app). |
| `netlify/functions/schoology.mjs` | A small server helper that fetches your Schoology calendar so new assignments sync automatically. |
| `netlify.toml` | Tells Netlify where the site and helper are. |
| `tend-backup.json` | **Your data** from the Claude version (7 classes, 16 assignments, settings). Private: don't upload it anywhere. |

## Put it online (one time, about 15 minutes)

You need two free accounts: **GitHub** (stores the code) and **Netlify** (hosts the website).
Netlify reads the code from GitHub, which is what lets the Schoology helper run.

### 1. Upload the code to GitHub
1. Sign up or sign in at <https://github.com>.
2. Click **+** (top right) → **New repository**. Name it `tend`, choose **Private**, and click **Create repository**.
3. On the new repo's page, click **uploading an existing file**.
4. Open your `Documents/Tend` folder in Finder and drag in exactly these: the **`site`** folder, the **`netlify`** folder, **`netlify.toml`**, **`README.md`** and **`.gitignore`**.
   - Do **not** drag in `tend-backup.json`. It has your personal data and private Schoology link.
   - `.gitignore` is hidden in Finder. Press **Cmd + Shift + .** to show hidden files (it's fine to skip it).
5. Click **Commit changes**.

### 2. Connect it to Netlify
1. Sign up at <https://app.netlify.com> (choosing **Sign up with GitHub** is easiest).
2. Click **Add new site** → **Import an existing project** → **GitHub**, then allow Netlify to see your `tend` repo.
3. Pick `tend`. Leave the build settings as they are (Netlify reads `netlify.toml`) and click **Deploy**.
4. When it says **Published**, your site is live at an address like `https://random-name-123.netlify.app`.
5. Optional: **Site configuration → Change site name** to get something like `https://tend-beau.netlify.app`.

### 3. Bring your data over
1. Open your new site on your Mac.
2. Click **⚙** (top right) → **Restore from backup** → choose `tend-backup.json` from `Documents/Tend` → **Replace my data**.
3. Open the **Schoology** tab and tap **Sync now** to check the automatic sync works.

### 4. Install it like an app
- **iPhone:** open the site in **Safari** → **Share** → **Add to Home Screen**.
- **Mac:** open the site in **Safari** → **File** → **Add to Dock** (Chrome: the install icon in the address bar).

Installing matters on iPhone: Safari can clear data for websites you haven't opened in a while,
but apps added to the Home Screen keep their data.

## Your data lives on each device

There's no account or cloud sync in this version: your Mac and iPhone each keep their own copy.
To copy data from one device to the other: **⚙ → Download backup** on the first device, AirDrop the file over,
then **⚙ → Restore from backup** on the second. Download a backup now and then as a safety copy, too.

## Updating the app later

Edit files in this folder, then on GitHub open the repo → **Add file → Upload files**, drag in the changed files
(for example `site/index.html`), and **Commit changes**. Netlify republishes automatically within about a minute.

## How Schoology sync works

The app sends your saved calendar link to `/api/schoology` on your own site. The helper in
`netlify/functions/schoology.mjs` fetches that calendar from Schoology and hands it back.
It only accepts `schoology.com` links. The app syncs quietly when you open it (at most every 30 minutes),
and you can tap **Sync now** in the Schoology tab anytime. **Import a file instead** still works as a backup plan.

## Try it on this Mac without deploying

```bash
/usr/bin/ruby -run -e httpd ~/Documents/Tend/site -p 8765
```

Then open <http://localhost:8765>. Automatic Schoology sync only works on Netlify, not in this local preview.
