# 🏔️ Colorado Nature & Wildlife Photography Season Tracker

A modern, cross-platform photography scouting application designed for Mac and PC. Track animal seasons (elk bugling rut, moose velvet, bighorn clashes, pika haying) and botanical phenology (wildflower superblooms, aspen fall gold, plains cottonwoods) across Colorado’s 5 life zones.

Deployable directly to **Vercel's free tier**, installable as a native desktop application (PWA) on macOS and Windows, and pre-configured for GitHub version control.

---

## 🌟 Key Features

### 1. Multi-Dimensional Phenology Filtering
- **Category Filter**: Big Game / Mammals, Birds & Raptors, Wildflowers & Flora, Trees & Autumn Foliage.
- **Month Scrubber**: Scrape through Jan–Dec or click **"Peaking Now"** to instantly see what's in prime condition for Colorado’s current date.
- **5 Elevation Life Zones**:
  - **Plains & Grasslands** (< 6,000 ft): Pawnee Buttes, Barr Lake, winter eagles, sandhill cranes.
  - **Foothills** (6,000 – 8,000 ft): Waterton Canyon, bighorn sheep rut, pasqueflowers, riparian cottonwoods.
  - **Montane Zone** (8,000 – 10,000 ft): RMNP Moraine Park elk rut, massive Kebler Pass aspen stands.
  - **Subalpine Zone** (10,000 – 11,500 ft): High tarns, Shiras moose in willow marshes, Crested Butte wildflower meadows.
  - **Alpine Tundra** (> 11,500 ft): American pika haying talus, pure white winter ptarmigan, ancient bristlecone pines.
- **Region Filtering**: Rocky Mountain National Park & Front Range, San Juan Mountains, Central Rockies, North Park / Walden, San Luis Valley, Crested Butte, Western Slope, and Eastern Plains.
- **Strict Peak Toggle**: Filter only for subjects at peak photographic readiness.

### 2. Deep Drill-Down Field Guides
- **12-Month Phenology Matrix**: Color-coded activity states (Dormant, Active, Peak) with detailed behavioral notes for every single month.
- **Photographer's Kit**: Recommended glass (focal lengths, prime vs zoom), best lighting conditions (alpenglow, morning mist, rim-light), and terrain difficulty ratings.
- **Curated Colorado Hotspots**: Exact public lands (National Parks, National Forests, State Parks, BLM, Wildlife Refuges) with road access notes and prime hours.
- **Wildlife & Alpine Ethics**: Built-in Colorado Parks and Wildlife (CPW) safety distance mandates (25–100+ yards) and tundra conservation guidelines.

### 3. Trip Planner & Field Scouting Itinerary
- Bookmark upcoming target shoots into your custom itinerary.
- Group shoots by target month or geographic region.
- Printable, clean scouting sheet with equipment checklist (polarizers, cold-weather batteries, bear spray, red-light headlamps).

### 4. Personal Sighting & Observation Journal
- Log field photo encounters: date, exact location / trailhead, GPS elevation, camera & lens settings, lighting conditions, and star ratings.
- Search past field sightings by subject, location, or notes.
- Export your journal to `.JSON` or import backups without needing a database.

### 5. Cross-Device Cloud Sync (Optional Free Supabase)
- Works 100% offline out-of-the-box using browser storage.
- Easily sync between your Mac, PC, and mobile device by pasting your free-tier Supabase credentials in the in-app **Settings** modal.

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository (or navigate to this folder)
cd colorado-photo-seasons

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Installing as a Desktop App on Mac & PC

This application is configured as a standalone **Progressive Web App (PWA)**:
1. Open the app in Google Chrome, Microsoft Edge, or Safari.
2. In the browser address bar, click the **Install App** icon (or in Safari: *File > Add to Dock*).
3. The app will launch in its own native, distraction-free desktop window with a dedicated dock/taskbar icon on both macOS and Windows.

---

## 🌐 Free Deployment to Vercel

Vercel provides a 100% free Hobby tier that effortlessly hosts this Next.js app:

### Option A: Via GitHub (Recommended)
1. Initialize your GitHub repository:
   ```bash
   git add .
   git commit -m "Scaffold Colorado Nature & Wildlife Photography Season Tracker"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com) (free account).
3. Click **"Add New Project"** and select your GitHub repository.
4. Click **Deploy**. Vercel will automatically build and assign a free HTTPS URL (e.g. `your-app.vercel.app`).
5. Any subsequent `git push` to your main branch will automatically deploy!

### Option B: Via Vercel CLI
```bash
npx vercel
```

---

## 🗄️ Optional Supabase Setup (Free Cross-Device Sync)

If you'd like to sync your personal sightings and targets across your Mac and PC:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run:

```sql
create table if not exists sightings (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null,
  subject_name text not null,
  date date not null,
  location_name text not null,
  elevation_ft integer,
  gear_notes text,
  photography_notes text,
  rating integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists saved_targets (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null,
  target_month integer,
  target_region text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

3. In the app, click the **Settings** gear icon in the top right and paste your **Project URL** and **Anon API Key**. Real-time cloud sync is now activated!

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Storage**: Offline-first LocalStorage with Supabase JS client integration
- **Deployment**: Zero-configuration static/serverless Vercel ready
