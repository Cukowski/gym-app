# Iron Tempo Tri

A mobile-first gym + triathlon training log for GitHub Pages.

## What changed

- New triathlon-aware home screen.
- Strength templates:
  - Full Body Pump
  - Upper Body Pump
  - Lower Body + Core
  - Push
  - Pull
  - Tri Core + Rope
- Cardio logs:
  - Run
  - Bike
  - Rope Jump
  - Swim
- Local progress dashboard.
- Export JSON / CSV.
- Optional Google Sheets sync through Apps Script.
- Timestamp-based timer so the rest countdown does not freeze when switching tabs/apps.

## Files

- `index.html` — upload to the root of your GitHub Pages repo.
- `Code.gs` — optional Google Apps Script backend for Google Sheets.

## Assets

Keep your existing `assets/` folder. The app uses only the file names you already listed:

- `back-squat.gif`
- `barbell-deadlift.webp`
- `barbell-row.gif`
- `bench-press.gif`
- `biceps-21s.gif`
- `chest-fly-dumbells.gif`
- `dumbbell-shoulder-press.gif`
- `dynamic-warmup.gif`
- `ez-bar-curl.gif`
- `face-pull.gif`
- `incline-db-curl.gif`
- `incline-db-press.gif`
- `lat-pulldown.gif`
- `overhead-press.gif`
- `push-up.gif`
- `romanian-deadlift.gif`
- `seated-row-machine.gif`
- `skull-crushers.gif`
- `stretching-cooldown.gif`
- `tricep-dips.gif`
- `walking-lunge.gif`

If an asset is missing, the app shows a clean fallback tile instead of breaking.

## GitHub Pages

1. Replace your old `index.html` with the new one.
2. Keep the `assets/` folder next to it.
3. Push to GitHub.
4. Open your Pages URL on your phone.
5. Optional: Add it to your home screen.

## Google Sheets sync

1. Create a Google Sheet.
2. Open **Extensions → Apps Script**.
3. Paste `Code.gs`.
4. Run `setup()` once.
5. Deploy as a Web App:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the Web App URL.
7. In the app: **Settings → Google Sheets endpoint**.
8. Paste URL and enable cloud sync.

The app still stores everything locally first. Sheets sync is an append-only backup.
