# 🐾 WildSeason: North American Wildlife & Nature Photography Tracker

A modern, cross-platform photography scouting application designed for Mac, PC, and mobile. Track animal life cycles (elk & bison rut, brown bear salmon runs, moose velvet, wolf pack dynamics, puffin nesting, sage-grouse leks) and botanical phenology (alpine wildflower superblooms, Colorado aspen gold, Appalachian hardwood autumn, saguaro blossoms) across North America.

Includes an **interactive Zillow-style spatial map**, **53 verified species** with authentic biological portraits and diagnostic identification marks, a **full-screen uncropped photo lightbox**, and **built-in private site password protection**.

---

## 🔒 Private Access & Password Protection

This application includes built-in password protection to ensure only you can access your deployed tracker:

* **Configuring your Password in Vercel**:
  1. In your Vercel Dashboard, go to **Settings > Environment Variables**.
  2. Add:
     * **Key**: `SITE_PASSWORD`
     * **Value**: `<Your-Secret-Password>`
  3. Redeploy (or trigger a new commit).
* **Local Development Default**:
  * If `SITE_PASSWORD` is not set in `.env.local`, the default fallback password is `wildlife`.
* **Session Persistence**:
  * Logging in sets a secure, encrypted HTTP-only cookie valid for 30 days.
  * You can log out anytime by clicking the **Lock / Log Out** icon in the header.

---

## 🌟 Key Features

### 1. Interactive Zillow-Style Spatial Map
- **Search As I Move the Map**: Drag and zoom around North America—the subject cards dynamically update in real time to show only animals and blooms within your visible screen area.
- **Synchronized Hover & Focus**: Hovering over cards highlights hotspots on the map, and clicking pins highlights the subject card.
- **Direct Location Hotspots**: Exact public land coordinates (National Parks, National Wildlife Refuges, State Parks, BLM).

### 2. Comprehensive 53-Species Catalog with Field Marks
- **100% Species-Accurate Portraits**: Curated authentic wildlife portraits from Wikimedia Commons (no European mixups, no domestic animals, no captive pets).
- **Field Identification Guides**: 3 diagnostic biological field marks and comparison tips to distinguish lookalikes (e.g., American Badger vs Wolverine, Trumpeter vs Tundra Swan, Grizzly vs Black Bear).
- **Full-Screen Uncropped Lightbox**: Inspect subjects with zero cropping (`object-contain`), fast arrow key navigation (`←`/`→`), and field mark overlays.

### 3. Multi-Dimensional Phenology & Season Scrubbing
- **12-Month Phenology Matrix**: Peak season (Green / Status 2) vs Active season (Yellow / Status 1) for every month.
- **"Peaking Now" Button**: Instant one-click filter for subjects peaking in the current calendar month.
- **5 Elevation Life Zones**: Filter from Plains (< 6,000 ft) up to Alpine Tundra (> 11,500 ft).

### 4. Field Scouting Planner & Journal
- **Trip Planner**: Save bucket-list target shoots grouped by month or region with scouting sheets.
- **Observation Field Log**: Record personal sightings, focal length, shutter settings, GPS elevations, and ratings.
- **Export & Backup**: Export your journal as JSON or sync across devices.

---

## 🌐 Deploy to Vercel in 60 Seconds

Your repository is already pushed to GitHub: [https://github.com/kyuushii/wildlife-tracker](https://github.com/kyuushii/wildlife-tracker).

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..." > "Project"**.
3. Find **`kyuushii/wildlife-tracker`** and click **Import**.
4. In the configuration screen, expand **"Environment Variables"** and add:
   * **Name**: `SITE_PASSWORD`
   * **Value**: `<your-desired-login-password>`
5. Click **Deploy**.

Vercel will build and assign you a free HTTPS URL (e.g. `wildlife-tracker.vercel.app`). Any time you push commits to GitHub, Vercel will automatically rebuild and deploy!

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/kyuushii/wildlife-tracker.git
cd wildlife-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. (Default password: `wildlife`).

---

## 💻 Install as a Desktop App on Mac & PC

1. Open your deployed URL in Google Chrome, Microsoft Edge, or Safari.
2. Click the **Install App** icon in the address bar (or Safari: *File > Add to Dock*).
3. The tracker will launch in its own native, distraction-free desktop window with a dedicated dock/taskbar icon.
