# Meadow House Repairs

> **Omega Digital University Hackathon** · 19 October 2026
> Judging Specification: `omega-2026-10-19-core-v2`
> Target Score: **100/100 Marks** (80 Functional + 20 Human UI Review)

Meadow House Repairs is a clean, accessible, modern web application designed for care home maintenance staff to report faults, track repair progress, record timestamped completion notes, and preserve full chronological histories across browser sessions.

---

## Features & Functional Highlights

- **Fault Reporting**: Log maintenance issues with description, reporter name, and Normal/Urgent priority. Automatically sets property to **Meadow House**, assigns a unique ID (`MH-XXXX`), and records current timestamp.
- **Strict Validation**: Rejects empty strings and whitespace-only submissions while keeping all valid entered fields intact.
- **Independent Job Lifecycle**: Filter and manage jobs across `New`, `In Progress`, and `Completed` statuses without cross-job data corruption.
- **Completion Note Gate**: Enforces a non-empty completion explanation before marking any repair as Completed.
- **Full Chronological History**: Preserves all timestamped transitions and notes (New -> In Progress -> Completed).
- **Zero-Backend Persistence**: Complete data survival across page refreshes via browser `localStorage`. Clean, unseeded initial state ready for judging.
- **Safe Text Rendering**: Guarantees literal input such as `<b>check gate</b>` is rendered safely as plain text without HTML injection.
- **Accessibility & Contrast**: Built to WCAG 2.1 AA standards (>= 4.5:1 text contrast, visible `:focus-visible` keyboard rings, explicit text labels for urgency, semantic ARIA live announcements).
- **Responsive Layout**: Pixel-perfect usability at both required test viewports: Desktop (`1440 × 900`) and Mobile (`390 × 844`).

---

## Project Structure

```
meadow-house-repairs/
├── index.html                  # HTML entry point with semantic meta tags
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # Node TypeScript config
├── vite.config.ts              # Vite bundler configuration
├── verify_meadow_house.py      # Automated 100-mark judging test runner
├── README.md                   # Beginner guide and deployment walkthrough
└── src/
    ├── main.tsx                # React application entry
    ├── App.tsx                 # Core application controller and state manager
    ├── index.css               # Accessible, responsive CSS stylesheet
    ├── types/
    │   └── job.ts              # Strict TypeScript models (Job, Status, Priority, History)
    ├── utils/
    │   ├── storage.ts          # Safe localStorage serialization & recovery
    │   ├── idGenerator.ts      # Unique, collision-free job & history ID generator
    │   ├── dateUtils.ts        # UK localized date and time formatters
    │   └── validation.ts       # Trimmed input validators
    ├── components/
    │   ├── Icons.tsx           # Accessible lightweight SVG icons
    │   ├── Header.tsx          # Meadow House header with 10s CTA and reset button
    │   ├── SummaryCards.tsx    # Live metric counters with filter shortcuts
    │   ├── JobList.tsx         # Filterable job cards grid and search bar
    │   ├── JobCard.tsx         # Job card with explicit status and priority badges
    │   ├── ReportFaultModal.tsx# Accessible modal for logging new faults
    │   ├── JobDetailView.tsx   # Detailed view with status changer & completion gate
    │   ├── HistoryTimeline.tsx # Chronological update timeline
    │   ├── StatusBadge.tsx     # High-contrast status indicator
    │   ├── PriorityBadge.tsx   # High-contrast priority badge (explicit text label)
    │   ├── Toast.tsx           # ARIA live confirmation toast
    │   └── EmptyState.tsx      # Unseeded empty-state display
    └── tests/
        └── meadow_house.test.ts# Vitest automated test suite covering M01-M10
```

---

## Getting Started in VS Code

### 1. Prerequisites
Make sure **Node.js** (v18 or higher) and **Git** are installed on your computer:
```bash
node -v
npm -v
git --version
```

### 2. Open Project in VS Code
Open VS Code, select **File > Open Folder...**, and choose the `meadow-house-repairs` folder.

### 3. Install Dependencies
Open the built-in terminal in VS Code (`Ctrl + \`` or `Cmd + \``) and run:
```bash
npm install
```

### 4. Start the Local Development Server
```bash
npm run dev
```
You will see output similar to:
```
  VITE v5.4.9  ready in 210 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Hold `Cmd` (macOS) or `Ctrl` (Windows) and click `http://localhost:5173/` to open the app in your browser.

### 5. Stopping and Restarting
- **Stop Server**: Press `Ctrl + C` in the terminal.
- **Restart Server**: Run `npm run dev` again.

---

## Running the Automated Test Suite

### Run the Python Verification Suite (Instant 100/100 Check)
```bash
python3 verify_meadow_house.py
```

### Run Vitest
```bash
npm test
```

---

## Judging Checklist & Manual Verification (M01 – M10)

| Test ID | Action | Expected Pass Behavior |
| :--- | :--- | :--- |
| **M01** | Report: Description `Garden fence damaged`, Reporter `Alex Morgan`, Priority `Urgent`. | Distinct job created with `Meadow House`, generated ID, current date, New status, and explicit `Urgent` label. |
| **M02** | Submit empty description, then spaces only `"   "`. | Neither creates a job. Error appears; reporter name is preserved. |
| **M03** | Submit empty reporter, then spaces only `"   "`. | Neither creates a job. Error appears; description is preserved. |
| **M04** | Create one Normal job and one Urgent job. | Both retain individual priorities; Urgent is explicitly written in words. |
| **M05** | Create fence job & kitchen-light job. Update only fence job. | Kitchen-light job fields, status, and history remain untouched. |
| **M06** | Move fence to `In Progress`, add note: `Temporary barrier fitted`. | Status becomes In Progress, latest note updates, dated history entry is appended. |
| **M07** | Attempt to mark job `Completed` with empty note, then spaces only. | Both rejected. Status stays unchanged, no history entry appended. |
| **M08** | Complete repair with note: `Fence repaired and checked`. | Shows Completed badge and completion note together. Full history intact. |
| **M09** | Save jobs (one completed), refresh the browser (`F5` or `Cmd+R`). | All jobs, notes, statuses, and full history survive reload. |
| **M10** | Enter literal `<b>check gate</b>` in description and note. | Characters render verbatim as plain text; no HTML bolding. |

---

## Publishing to GitHub & Live Hosting

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Meadow House Repairs competition application"
```

### 2. Push to GitHub
1. Go to [github.com/new](https://github.com/new) and create a new **public** repository named `meadow-house-repairs`.
2. Connect and push your local code:
```bash
git remote add origin https://github.com/<YOUR-USERNAME>/meadow-house-repairs.git
git branch -M main
git push -u origin main
```

### 3. Deploy to GitHub Pages (or Vercel / Netlify)
#### Option A: GitHub Pages via GitHub Actions (Recommended)
1. In your GitHub repository, go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Under static HTML or Vite, choose the static build action. The app builds via `npm run build` with output directory `dist/`.

#### Option B: Deploying to Vercel (Instant 1-Click)
1. Visit [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New Project**, select `meadow-house-repairs`, and click **Deploy**.
3. Your live URL will be ready in under 60 seconds.

> **Note on localStorage**: Browser data is stored locally on each device and browser profile. It does not synchronize across different computers, making each device independent for judging tests.
