# Iron Tempo Tri — v2 Cloud Sync

A mobile-first gym + triathlon companion for GitHub Pages.

## What it tracks

- Full Body Pump, Upper Body, Lower Body + Core, Push, Pull, Tri Core + Rope
- Run / Bike / Rope Jump / Swim cardio logs
- Sets completed
- Weight used
- Exercise notes / RPE
- Total workout volume
- Last used weight and PR per exercise
- Google Sheets cross-device sync

## Files

```text
gym-app/
├── index.html
├── Code.gs          # paste into Google Apps Script, not into GitHub Pages
├── README.md
└── assets/          # keep your existing exercise GIFs/images
```

## Google Sheets setup

1. Open your Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Replace `Code.gs` with the included `Code.gs` file.
4. Run `setup()` once and approve permissions if needed.
5. Go to **Deploy → Manage deployments**.
6. Edit your Web App deployment.
7. Choose **Version: New version**.
8. Deploy.
9. Keep/copy the Web App URL ending in `/exec`.

The URL can stay the same if you update the existing deployment.

## App setup

1. Upload `index.html` to your GitHub Pages repo.
2. Keep your existing `assets/` folder.
3. Open the app.
4. Go to **Settings**.
5. Paste the Apps Script Web App URL.
6. Enable:
   - **Push finished sessions to Sheets**
   - **Pull Sheets on launch**
7. Click **Save settings**.
8. Click **Pull from Google Sheets now**.

Now the laptop and phone can share the same records through Google Sheets.

## Important behavior

- The app saves locally first so it still works offline.
- Finished workouts/cardio are pushed to Sheets.
- Other devices must pull from Sheets to see the latest data.
- The Progress tab includes **Exercise memory** showing last used load and load PR.

## Strava

Apple Watch → Strava remains the clean path for runs and rides.
This app can store Strava links manually inside cardio records.
Direct Strava sync would need a backend/OAuth token flow and is intentionally not included in this static GitHub Pages version.
